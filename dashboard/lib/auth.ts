import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, sessionToken } from "@/lib/api";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/constants";

/**
 * Login is handled by the backend. The dashboard only keeps the signed token it hands back
 * in an httpOnly cookie and sends it with every API call; the backend checks it each time.
 */

export async function startSession(token: string, maxAge = SESSION_MAX_AGE_SECONDS): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in admin, or null. Asks the backend, so expired or forged tokens are rejected. */
export async function getAdminSession(): Promise<{ sub: string } | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return response.ok ? ((await response.json()) as { sub: string }) : null;
  } catch {
    return null;
  }
}

/** Use at the top of every dashboard page that needs a signed-in admin. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  return session;
}

/** For the login screen: is the backend reachable, and is admin login configured there? */
export async function backendStatus(): Promise<"ok" | "unconfigured" | "offline"> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/status`, { cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (!response.ok) return "offline";
    const data = (await response.json()) as { configured: boolean };
    return data.configured ? "ok" : "unconfigured";
  } catch {
    return "offline";
  }
}
