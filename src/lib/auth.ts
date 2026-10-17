import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { readSession, SESSION_COOKIE, SESSION_TTL_SECONDS, signSession } from "@/lib/session-token";

export async function createSession(userId: string, version: number) {
  const token = await signSession({ userId, version });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Returns the logged-in admin, or null. Checks the DB so old sessions die after a password change. */
export const getAdmin = cache(async () => {
  const session = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, sessionVersion: true },
  });
  if (!user || user.sessionVersion !== session.version) return null;
  return { id: user.id, email: user.email };
});

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
