"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StaggerChildrenProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: number;
  y?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  stagger = 0.15,
  duration = 0.6,
  y = 40,
  className = "",
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const childElements = el.children;
    if (!childElements.length) return;

    gsap.fromTo(
      childElements,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  }, { scope: ref, dependencies: [stagger, duration, y], revertOnUpdate: true });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
