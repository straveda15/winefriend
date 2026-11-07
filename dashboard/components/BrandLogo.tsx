import Image from "next/image";
import Link from "next/link";

/** Compact Kamaltara / Wine Friend lockup for the dashboard sidebar and login screen. */
export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="Wine Friend dashboard" className="flex items-center gap-3">
      <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-black">
        <Image
          src="/kamaltara-logo.png"
          alt=""
          width={800}
          height={600}
          priority
          unoptimized
          className="h-full w-full scale-[1.08] rounded-full object-contain"
        />
        <span className="absolute right-[14%] top-[14%] z-10 text-base font-semibold leading-none text-[#c69a3a]" aria-hidden="true">
          {"\u2122"}
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
