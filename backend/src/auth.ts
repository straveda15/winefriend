import { createHash, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { config, isProduction } from "./config";
import { verifySessionToken } from "./session";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

export function adminConfigured(): boolean {
  return Boolean(config.adminEmail && config.adminPassword);
}

export function credentialsValid(email: string, password: string): boolean {
  if (!adminConfigured()) return false;
  // Evaluate both so timing does not reveal which field was wrong.
  const emailOk = safeEqual(email.trim().toLowerCase(), config.adminEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, config.adminPassword);
  return emailOk && passwordOk;
}

/**
 * In-memory login throttle: 5 failures per 15 minutes per client.
 * Only enforced in production, so development is never locked out by typos.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function isThrottled(key: string): boolean {
  if (!isProduction) return false;
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailure(key: string): void {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  else entry.count += 1;
}

export function clearFailures(key: string): void {
  attempts.delete(key);
}

/** The visitor's address, as forwarded by the website or dashboard. */
export function clientKey(request: Request): string {
  const forwarded = request.header("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.ip || "local";
}

export function bearerToken(request: Request): string | undefined {
  const header = request.header("authorization");
  return header?.startsWith("Bearer ") ? header.slice(7) : undefined;
}

/** Express middleware: only requests carrying a valid admin session token get through. */
export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const session = verifySessionToken(bearerToken(request));
  if (!session) {
    response.status(401).json({ error: "Please sign in again." });
    return;
  }
  response.locals.admin = session;
  next();
}
