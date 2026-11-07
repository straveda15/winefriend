"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<import("lenis").default | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let lenis: import("lenis").default | null = null;
    let rafCallback: ((time: number) => void) | null = null;

    void import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      rafCallback = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      disposed = true;
      if (rafCallback) gsap.ticker.remove(rafCallback);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ContactScrollReset lenisRef={lenisRef} />
      </Suspense>
    </>
  );
}

function ContactScrollReset({
  lenisRef,
}: {
  lenisRef: RefObject<import("lenis").default | null>;
}) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/contact") return;

    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, lenisRef]);

  return null;
}
