"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ImageRevealProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}

export function ImageReveal({
  children,
  direction = "left",
  className = "",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const clipPaths: Record<string, { from: string; to: string }> = {
      left: {
        from: "inset(0 100% 0 0)",
        to: "inset(0 0% 0 0)",
      },
      right: {
        from: "inset(0 0 0 100%)",
        to: "inset(0 0 0 0%)",
      },
      up: {
        from: "inset(100% 0 0 0)",
        to: "inset(0% 0 0 0)",
      },
      down: {
        from: "inset(0 0 100% 0)",
        to: "inset(0 0 0% 0)",
      },
    };

    const { from, to } = clipPaths[direction];

    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
    });
    reveal.fromTo(el, { clipPath: from }, { clipPath: to, duration: 1.2, ease: "power3.inOut" });

    const img = el.querySelector("img, .img-inner");
    if (img) reveal.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.35, ease: "power3.out" }, 0);
  }, { scope: ref, dependencies: [direction], revertOnUpdate: true });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
