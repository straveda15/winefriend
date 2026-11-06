"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ParallaxWrapProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxWrap({
  children,
  speed = 30,
  className = "",
}: ParallaxWrapProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      el,
      { y: -speed },
      {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  }, { scope: ref, dependencies: [speed], revertOnUpdate: true });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
