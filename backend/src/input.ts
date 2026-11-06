/** Helpers for reading values out of untrusted JSON request bodies. */

export type Body = Record<string, unknown>;

export function asBody(value: unknown): Body {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Body) : {};
}

export function str(body: Body, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export function bool(body: Body, key: string): boolean {
  return body[key] === true;
}
