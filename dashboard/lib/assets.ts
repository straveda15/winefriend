import { UPLOAD_PREFIX } from "@winefriend/shared/constants";

/**
 * Uploaded images are served by the dashboard itself (/uploads/...). The sample images that
 * ship with the website live in the website's public folder, so point those at the website.
 */
export function assetUrl(src: string): string {
  if (src.startsWith(UPLOAD_PREFIX) || !src.startsWith("/")) return src;
  const site = process.env.NEXT_PUBLIC_WEBSITE_URL?.replace(/\/$/, "") ?? "";
  return `${site}${src}`;
}
