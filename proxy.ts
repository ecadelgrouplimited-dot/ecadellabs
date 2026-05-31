import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";

// Routes only "admin" role can access
const ADMIN_ONLY = [
  "/admin/settings",
  "/admin/users",
  "/admin/newsletter",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token   = request.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Editor role: block admin-only routes
    if (payload.role === "editor" && ADMIN_ONLY.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
