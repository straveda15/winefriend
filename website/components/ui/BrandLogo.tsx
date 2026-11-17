import Link from "next/link";
import { Img } from "@/components/ui/Img";

interface BrandLogoProps { inverse?: boolean; className?: string }

export function BrandLogo({ inverse = false, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="WineFriend — Everything Wine. One Trusted Friend."
      className={`wf-brand-logo ${inverse ? "wf-brand-logo-inverse" : ""} ${className}`}
    >
      <span className="wf-brand-logo-frame wf-logo-mark-frame">
        <Img
          src="/kamaltara-logo.png"
          alt="WineFriend"
          fill
          preload
          sizes="(max-width: 640px) 2.75rem, (max-width: 767px) 3.25rem, (max-width: 1023px) 3.75rem, 4.5rem"
          unoptimized
          className="wf-brand-logo-image"
        />
        <span className="wf-logo-trademark" aria-hidden="true">{"\u2122"}</span>
      </span>
      <span className="wf-brand-logo-enterprise">
        <span>KAMALTARA</span>
        <span>ENTERPRISES</span>
        <span className="wf-brand-logo-tagline">ALWAYS IN ALL WAYS FOR THE WINE LOVERS</span>
      </span>
    </Link>
  );
}
