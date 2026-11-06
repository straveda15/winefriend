import { createHmac, timingSafeEqual } from "node:crypto";
import { config, isProduction } from "./config";

/** Stateless signed admin session token: base64url(payload).hmac */

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = { sub: string; exp: number };

const devFallbackSecret = "dev-only-insecure-session-secret-set-SESSION_SECRET-in-env";

function secret(): string | null {
  if (config.sessionSecret.length >= 32) return config.sessionSecret;
  return isProduction ? null : devFallbackSecret;
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

export function createSessionToken(subject: string): string | null {
  const key = secret();
  if (!key) return null;
  const payload: SessionPayload = { sub: subject, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const key = secret();
  if (!key) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body, key));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
