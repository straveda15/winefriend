/**
 * Sample images (/images/...) are copied into this app's public folder and uploaded photos
 * (/uploads/...) are passed through by this app, so every image path works as-is.
 */
export function assetUrl(src: string): string {
  return src;
}
