"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface GrapevineDecorationProps {
  className: string;
  variant?: "olive" | "champagne";
}

/** Photographic replacement for the former botanical SVG, in its existing page position. */
export function GrapevineDecoration({ className }: GrapevineDecorationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const photo = root?.querySelector<HTMLElement>(".wf-grapevine-photo");
    if (!root || !photo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const corner = className.includes("wf-vine--top-left")
      ? { origin: "100% 0%", sway: 0.95, drift: 3.1, lift: -1.2, duration: 4.4 }
      : className.includes("wf-vine--top-right")
        ? { origin: "0% 0%", sway: -0.85, drift: -2.8, lift: 1, duration: 5.1 }
        : className.includes("wf-vine--bottom-left")
          ? { origin: "0% 100%", sway: -1, drift: 2.7, lift: 1.3, duration: 4.8 }
          : { origin: "100% 100%", sway: 0.82, drift: -2.9, lift: -1, duration: 5.4 };
    const { origin: transformOrigin, sway, drift, lift, duration } = corner;
    gsap.set(photo, { transformOrigin });
    const breeze = gsap.timeline({
      repeat: -1,
      delay: (duration % 1) * 0.6,
      repeatRefresh: true,
      defaults: { ease: "sine.inOut" },
    });
    breeze
      .to(photo, {
        rotation: () => sway * gsap.utils.random(0.88, 1.12),
        x: () => drift * gsap.utils.random(0.9, 1.12),
        y: () => lift * gsap.utils.random(0.88, 1.12),
        duration,
      }, 0)
      .to(photo, {
        rotation: () => -sway * gsap.utils.random(0.5, 0.65),
        x: () => -drift * gsap.utils.random(0.35, 0.5),
        y: () => lift * gsap.utils.random(0.25, 0.42),
        duration: duration * 0.86,
      })
      .to(photo, { rotation: 0, x: 0, y: 0, duration: duration * 1.08 });

    const section = root.closest("section, footer");
    if (section) {
      gsap.fromTo(root, { y: 8 }, {
        y: -8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });
    }
  }, { scope: rootRef, revertOnUpdate: true });

  return (
    <div ref={rootRef} className={`wf-grapevine-decoration ${className}`} aria-hidden="true">
      <Image
        className="wf-grapevine-photo"
        src="/images/real-grapevine.png"
        alt=""
        fill
        sizes="(max-width: 640px) 34vw, 25vw"
      />
    </div>
  );
}
