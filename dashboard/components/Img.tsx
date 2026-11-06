import { assetUrl } from "@/lib/assets";

/** Fills its (relatively positioned) parent. Plain <img>: these are small admin thumbnails. */
export function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={assetUrl(src)} alt={alt} loading="lazy" decoding="async" className={`absolute inset-0 size-full ${className}`} />
  );
}
