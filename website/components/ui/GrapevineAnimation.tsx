"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type GrapevineAnimationProps = {
  className?: string;
  mode: "intro" | "home";
  onGrowthComplete?: () => void;
};

const corners = [
  // These are flattened photographs, so the complete branch moves from its
  // attachment point. A little extra travel keeps the breeze visible at screen size.
  { name: "top-left", sway: 2.35, drift: 8, lift: -3, origin: "4% 12%", duration: 3.2 },
  { name: "bottom-right", sway: -2.6, drift: -7.5, lift: 2.7, origin: "96% 88%", duration: 4.1 },
] as const;

/** Uses the supplied flattened photograph, moving each complete branch subtly. */
export function GrapevineAnimation({ className = "", mode, onGrowthComplete }: GrapevineAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const branches = gsap.utils.toArray<HTMLElement>(".wf-grapevine-photo", root);
    branches.forEach((branch, index) => {
      const corner = mode === "intro" ? corners[index] : null;
      if (corner) {
        const holder = branch.closest<HTMLElement>(".wf-grapevine-corner");
        if (holder) gsap.set(holder, { visibility: "visible" });
      }
      gsap.set(branch, {
        autoAlpha: 1,
        transformOrigin: corner?.origin ?? "12% 55%",
      });
      if (reduceMotion) return;
      const sway = corner?.sway ?? (index % 2 ? -1.5 : 1.55);
      const drift = corner?.drift ?? (index % 2 ? -5 : 5.2);
      const lift = corner?.lift ?? -1.8;
      const duration = corner?.duration ?? 5.2;
      const breeze = gsap.timeline({
        repeat: -1,
        delay: corner ? index * 0.31 : 0,
        repeatRefresh: true,
        defaults: { ease: "sine.inOut" },
      });
      breeze
        .to(branch, {
          rotation: () => sway * gsap.utils.random(0.88, 1.12),
          x: () => drift * gsap.utils.random(0.9, 1.12),
          y: () => lift * gsap.utils.random(0.88, 1.12),
          duration,
        }, 0)
        .to(branch, {
          rotation: () => -sway * gsap.utils.random(0.48, 0.64),
          x: () => -drift * gsap.utils.random(0.34, 0.5),
          y: () => lift * gsap.utils.random(0.24, 0.42),
          duration: duration * 0.82,
        })
        .to(branch, { rotation: 0, x: 0, y: 0, duration: duration * 1.08 });
    });
    if (mode === "intro") onGrowthComplete?.();
  }, { scope: rootRef, dependencies: [mode], revertOnUpdate: true });

  return (
    <div ref={rootRef} className={`wf-grapevine-animation ${className}`} aria-hidden="true">
      {mode === "intro" ? corners.map(({ name }) => (
        <div className={`wf-grapevine-corner wf-grapevine-corner--${name}`} key={name}>
          <Image className="wf-grapevine-photo" src="/images/real-grapevine.png" alt="" fill sizes="(max-width: 640px) 36vw, 26vw" priority />
        </div>
      )) : (
        <Image className="wf-grapevine-photo" src="/images/real-grapevine.png" alt="" fill sizes="(max-width: 768px) 50vw, 45vw" priority />
      )}
    </div>
  );
}
