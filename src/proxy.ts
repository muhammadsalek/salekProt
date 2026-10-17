import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session-token";

// Optimistic check from the cookie only; pages and Server Actions verify against the DB.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
