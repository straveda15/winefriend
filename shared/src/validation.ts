import { UPLOAD_PREFIX } from "./constants";

export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function checked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export function lines(value: string, maxItems: number, maxLength: number): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((line) => line.slice(0, maxLength));
}

const UPLOAD_PATH = /^\/uploads\/[a-z0-9][a-z0-9-]{3,80}\.(jpg|png|webp|gif)$/;
const BUNDLED_PATH = /^\/images\/[A-Za-z0-9 _./-]+$/;

/** Only accept images we uploaded ourselves or that ship in /public/images. */
export function isAllowedImagePath(src: unknown): src is string {
  if (typeof src !== "string") return false;
  if (src.startsWith(UPLOAD_PREFIX)) return UPLOAD_PATH.test(src);
  return BUNDLED_PATH.test(src) && !src.includes("..");
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}
