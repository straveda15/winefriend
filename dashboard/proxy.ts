import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

/**
 * Optimistic gate: visitors without a session cookie are sent to the login page before
 * anything renders. The real check happens in the backend, which verifies the token on
 * every API call (an expired or forged token is bounced to /login there).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/login") return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next.js internals, uploaded images and static assets.
  matcher: ["/((?!_next/|uploads/|fonts/|logo\\.png|kamaltara-favicon).*)"],
};
