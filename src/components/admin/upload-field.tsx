"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getUploadTicket } from "@/app/admin/actions";
import type { Field } from "@/lib/admin/fields";

const ACCEPT = {
  image: "image/jpeg,image/png,image/webp",
  pdf: "application/pdf",
} as const;

type Status =
  { kind: "idle" } | { kind: "uploading"; percent: number } | { kind: "error"; message: string };

export function UploadField({
  field,
  initialUrl,
  describedBy,
}: {
  field: Field;
  initialUrl: string;
  describedBy?: string;
}) {
  const kind = field.upload ?? "image";
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const id = `field-${field.name}`;
  const uploading = status.kind === "uploading";

  async function handleFile(file: File) {
    if (!ACCEPT[kind].split(",").includes(file.type)) {
      setStatus({
        kind: "error",
        message:
          kind === "pdf" ? "Please choose a PDF file." : "Please choose a JPG, PNG or WebP image.",
      });
      return;
    }

    setStatus({ kind: "uploading", percent: 0 });
    const ticket = await getUploadTicket(kind).catch(() => null);
    if (!ticket) {
      setStatus({
        kind: "error",
        message: "Uploads are not set up yet. Add the Cloudinary keys to the server settings.",
      });
      return;
    }
    if (file.size > ticket.maxBytes) {
      setStatus({
        kind: "error",
        message: `This file is too large. The limit is ${ticket.maxBytes / 1024 / 1024} MB.`,
      });
      return;
    }

    const body = new FormData();
    for (const [k, v] of Object.entries(ticket.fields)) body.append(k, v);
    body.append("file", file);

    // XHR rather than fetch, for upload progress.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", ticket.url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setStatus({ kind: "uploading", percent: Math.round((e.loaded / e.total) * 100) });
      }
    };
    xhr.onload = () => {
      const res = safeJson(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300 && typeof res?.secure_url === "string") {
        setUrl(res.secure_url);
        setStatus({ kind: "idle" });
      } else {
        setStatus({
          kind: "error",
          message: res?.error?.message ?? "Upload failed. Please try again.",
        });
      }
    };
    xhr.onerror = () =>
      setStatus({ kind: "error", message: "Upload failed. Check your connection and try again." });
    xhr.send(body);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={field.name} value={url} />

      {url ? (
        kind === "image" ? (
          <Image
            src={url}
            alt={`Current ${field.label.toLowerCase()}`}
            width={160}
            height={160}
            unoptimized
            className="border-border size-40 rounded-lg border object-cover"
          />
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent inline-block text-sm underline"
          >
            Open current file ↗
          </a>
        )
      ) : (
        <p className="text-muted text-sm">No file uploaded yet.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT[kind]}
          className="sr-only"
          aria-describedby={describedBy}
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void handleFile(file);
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="border-border hover:border-accent rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-60"
        >
          {uploading ? `Uploading… ${status.percent}%` : url ? "Replace" : "Upload"}
        </button>
        {url && !uploading && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-danger text-sm hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {status.kind === "error" && (
        <p role="alert" className="text-danger text-xs">
          {status.message}
        </p>
      )}
      {url !== initialUrl && !uploading && (
        <p className="text-highlight text-xs">Not saved yet. Click the save button below.</p>
      )}
    </div>
  );
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
