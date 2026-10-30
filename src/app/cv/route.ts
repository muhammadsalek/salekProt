import { connection } from "next/server";
import { downloadAsset, parseAssetUrl } from "@/lib/cloudinary";
import { db } from "@/lib/db";

// Stable public link to the current CV, so shared links never break when it is replaced.
// Cloudinary PDFs are streamed through here because Cloudinary blocks public links to PDFs.
export async function GET(request: Request) {
  await connection();
  const profile = await db.profile.findUnique({
    where: { id: 1 },
    select: { cvUrl: true, name: true },
  });
  if (!profile?.cvUrl) return new Response("CV not available yet.", { status: 404 });

  // Not a Cloudinary upload (e.g. a file shipped with the site): send visitors straight to it.
  if (!parseAssetUrl(profile.cvUrl)) {
    return Response.redirect(new URL(profile.cvUrl, request.url), 307);
  }

  const file = await downloadAsset(profile.cvUrl);
  if (!file?.body) {
    return new Response("The CV could not be loaded right now. Please try again shortly.", {
      status: 502,
    });
  }

  const filename = `${profile.name.trim().replace(/[^\w-]+/g, "_") || "CV"}_CV.pdf`;
  return new Response(file.body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${filename}"`,
      // Short cache so a replaced CV shows up within minutes.
      "cache-control": "public, max-age=300",
    },
  });
}
