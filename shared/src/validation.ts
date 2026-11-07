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
  if (value.length > 254) return false;
  const [local, domain, ...extra] = value.split("@");
  if (extra.length > 0 || !local || local.length > 64 || !domain || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return false;
  return /^(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i.test(domain);
}

export function isValidContactName(value: string): boolean {
  const name = value.trim();
  return name.length >= 2 && name.length <= 100 && /^[\p{L} ]+$/u.test(name);
}

export function isValidIndianMobile(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}

export function isValidEnquiryMessage(value: string): boolean {
  const message = value.trim();
  return message.length > 0 && message.length <= 3000;
}
