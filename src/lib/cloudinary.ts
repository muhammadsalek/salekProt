import "server-only";
import { createHash } from "node:crypto";

/**
 * Minimal Cloudinary client: signed browser uploads + deleting replaced files.
 * Files go straight from the browser to Cloudinary, so they never hit our server's body-size limits.
 */

export type UploadKind = "image" | "pdf";

const KINDS = {
  // Photos and research images.
  image: { resourceType: "image", allowedFormats: "jpg,jpeg,png,webp", maxBytes: 5 * 1024 * 1024 },
  // CV. Stored as "raw" so free Cloudinary accounts can deliver it (image-type PDFs are blocked by default).
  pdf: { resourceType: "raw", allowedFormats: undefined, maxBytes: 10 * 1024 * 1024 },
} as const;

export function uploadLimits(kind: UploadKind) {
  return { maxBytes: KINDS[kind].maxBytes };
}

function config() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret, folder: process.env.CLOUDINARY_FOLDER || "portfolio" };
}

export function isCloudinaryConfigured() {
  return config() !== null;
}

/** Cloudinary request signature: sorted `key=value` pairs joined by `&`, plus the secret, SHA-1. */
export function sign(params: Record<string, string | number>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

export type UploadTicket = {
  url: string;
  fields: Record<string, string>;
  maxBytes: number;
};

/** Everything the browser needs to POST one file directly to Cloudinary. */
export function createUploadTicket(kind: UploadKind): UploadTicket | null {
  const c = config();
  if (!c) return null;
  const k = KINDS[kind];
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = { folder: c.folder, timestamp };
  if (k.allowedFormats) params.allowed_formats = k.allowedFormats;
  // Raw files keep their extension only if it is part of the public id.
  if (kind === "pdf") params.public_id = `cv-${timestamp}.pdf`;

  return {
    url: `https://api.cloudinary.com/v1_1/${c.cloudName}/${k.resourceType}/upload`,
    fields: {
      ...Object.fromEntries(Object.entries(params).map(([key, v]) => [key, String(v)])),
      api_key: c.apiKey,
      signature: sign(params, c.apiSecret),
    },
    maxBytes: k.maxBytes,
  };
}

/** Parses a delivery URL we created; returns null for anything outside our cloud + folder. */
export function parseAssetUrl(url: string) {
  const c = config();
  if (!c) return null;
  const match = url.match(
    new RegExp(
      `^https://res\\.cloudinary\\.com/${c.cloudName}/(image|raw)/upload/(?:v\\d+/)?(.+)$`,
    ),
  );
  if (!match) return null;
  const [, resourceType, path] = match;
  if (!path.startsWith(`${c.folder}/`)) return null;
  // Image public ids exclude the extension; raw ids include it.
  const publicId = resourceType === "image" ? path.replace(/\.[a-z0-9]+$/i, "") : path;
  return { resourceType, publicId };
}

export function isOwnAsset(url: string, kind: UploadKind) {
  return parseAssetUrl(url)?.resourceType === KINDS[kind].resourceType;
}

/**
 * Fetches one of our files through Cloudinary's authenticated download API.
 * Needed for PDFs: new Cloudinary accounts refuse to deliver PDFs from public links (401).
 */
export async function downloadAsset(url: string): Promise<Response | null> {
  const c = config();
  const asset = parseAssetUrl(url);
  if (!c || !asset) return null;
  const params = {
    public_id: asset.publicId,
    timestamp: Math.floor(Date.now() / 1000),
    type: "upload",
  };
  const query = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    api_key: c.apiKey,
    signature: sign(params, c.apiSecret),
  });
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${c.cloudName}/${asset.resourceType}/download?${query}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    console.error("Cloudinary download failed", res.status, await res.text().catch(() => ""));
    return null;
  }
  return res;
}

/** Deletes an uploaded file. Best effort: failures are logged, never thrown. */
export async function deleteAsset(url: string | null | undefined) {
  const c = config();
  const asset = url ? parseAssetUrl(url) : null;
  if (!c || !asset) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { invalidate: "true", public_id: asset.publicId, timestamp };
  const body = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    api_key: c.apiKey,
    signature: sign(params, c.apiSecret),
  });
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${c.cloudName}/${asset.resourceType}/destroy`,
      { method: "POST", body },
    );
    if (!res.ok) console.error("Cloudinary delete failed", res.status, await res.text());
  } catch (err) {
    console.error("Cloudinary delete failed", err);
  }
}
