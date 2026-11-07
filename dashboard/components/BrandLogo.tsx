import Image from "next/image";
import Link from "next/link";

/** Compact Kamaltara / Wine Friend lockup for the dashboard sidebar and login screen. */
export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="Wine Friend dashboard" className="flex items-center gap-3">
      <Image src="/new_logo.png" alt="" width={1033} height={665} priority unoptimized className="h-12 w-auto" />
      <span className={`flex flex-col leading-tight font-serif ${inverse ? "text-[#f5efe3]" : "text-charcoal"}`}>
        <span className="text-[0.8rem] font-semibold tracking-[0.12em]">KAMALTARA</span>
        <span className="text-[0.8rem] font-semibold tracking-[0.12em]">ENTERPRISES</span>
        <span className={`mt-1 font-sans text-[0.5rem] tracking-[0.1em] ${inverse ? "text-[#f5efe3]/70" : "text-slate"}`}>
          WEBSITE DASHBOARD
        </span>
      </span>
    </Link>
  );
}
