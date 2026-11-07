import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps { inverse?: boolean; className?: string }

export function BrandLogo({ inverse = false, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="WineFriend — Everything Wine. One Trusted Friend."
      className={`wf-brand-logo ${inverse ? "wf-brand-logo-inverse" : ""} ${className}`}
    >
      <span className="wf-brand-logo-frame wf-logo-mark-frame">
        <Image
          src="/kamaltara-logo.png"
          alt="WineFriend"
          width={800}
          height={600}
          priority
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
