import { connection } from "next/server";
import { db } from "@/lib/db";

// Stable public link to the current CV, so shared links never break when it is replaced.
export async function GET() {
  await connection();
  const profile = await db.profile.findUnique({ where: { id: 1 }, select: { cvUrl: true } });
  if (!profile?.cvUrl) return new Response("CV not available yet.", { status: 404 });
  return Response.redirect(profile.cvUrl, 307);
}
