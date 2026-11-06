import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/constants";

/** Base URL of the Wine Friend backend (API). Set BACKEND_URL in the dashboard's environment. */
export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function describeFetchError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause;
  if (cause instanceof Error && cause.message !== error.message) return `${error.message}: ${cause.message}`;
  if (cause && typeof cause === "object" && "code" in cause && typeof cause.code === "string") {
    return `${error.message} (${cause.code})`;
  }
  return error.message;
}

export function backendFetchErrorMessage(path: string, error: unknown): string {
  let backendHost = BACKEND_URL;
  try {
    backendHost = new URL(BACKEND_URL).host;
  } catch {
    // Keep the original value in the message so a malformed URL is easy to fix.
  }
  return `Could not reach the backend at ${backendHost}${path}: ${describeFetchError(error)}. Check BACKEND_URL and make sure the backend is running.`;
}

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** JSON body. */
  body?: unknown;
  /** Raw body (image bytes). */
  raw?: BodyInit;
  contentType?: string;
  /** Extra headers, e.g. x-forwarded-for. */
  headers?: Record<string, string>;
  /** Set false for the few public calls (login, status). Default true. */
  auth?: boolean;
};

/**
 * Calls the backend with the signed-in admin's session token.
 * No session, or a rejected one, sends the user to /login.
 */
export async function api<T = unknown>(path: string, options: Options = {}): Promise<T> {
  const headers: Record<string, string> = { accept: "application/json", ...options.headers };

  if (options.auth !== false) {
    const token = await sessionToken();
    if (!token) redirect("/login");
    headers.authorization = `Bearer ${token}`;
  }
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.contentType) headers["content-type"] = options.contentType;

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.raw ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(503, backendFetchErrorMessage(path, error));
  }

  if (response.status === 401 && options.auth !== false) redirect("/login");

  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new ApiError(response.status, data.error ?? `Backend responded with ${response.status}.`);
  return data as T;
}
