import Image from "next/image";
import Link from "next/link";

/** Compact Kamaltara / Wine Friend lockup for the dashboard sidebar and login screen. */
export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="Wine Friend dashboard" className="flex items-center gap-3">
      <span className="relative block size-12 shrink-0">
        <Image src="/winelogo-circle.png" alt="" width={512} height={512} priority unoptimized className="h-full w-full object-contain" />
        <span
          aria-hidden="true"
          className="absolute left-[64%] top-[18%] font-[Arial,sans-serif] text-xs leading-none font-medium text-[#D9A321]"
        >
          TM
        </span>
      </span>
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
