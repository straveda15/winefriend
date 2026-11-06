"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface GrapevineDecorationProps {
  className: string;
  variant?: "olive" | "champagne";
}

/** A lightweight, transparent botanical accent for content sections (never the hero). */
export function GrapevineDecoration({ className, variant = "olive" }: GrapevineDecorationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const leaves = svg.querySelectorAll<SVGGElement>(".wf-grapevine-leaf");
    const cluster = svg.querySelector<SVGGElement>(".wf-grapevine-cluster");
    const footerBranch = className.includes("wf-vine--footer")
      ? svg.querySelector<SVGGElement>(".wf-grapevine-branch")
      : null;
    gsap.to(leaves, {
      rotate: (index) => (index % 2 ? 2.2 : -2.2),
      transformOrigin: "50% 90%",
      duration: 5.5,
      stagger: 0.32,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    if (cluster) {
      gsap.to(cluster, {
        y: 4,
        rotate: 1.5,
        transformOrigin: "50% 0%",
        duration: 6.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    const section = svg.closest("section, footer");
    if (section) {
      if (footerBranch) {
        const paths = footerBranch.querySelectorAll<SVGPathElement>("path");
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            once: true,
          },
        });
      }
      gsap.fromTo(
        svg,
        { y: 12 },
        {
          y: -12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        },
      );
    }
  }, { scope: svgRef });

  const leaf = variant === "olive" ? "#596548" : "#9C895B";
  const leafLight = variant === "olive" ? "#7B8059" : "#C3A967";
  const vein = variant === "olive" ? "#C6AD6D" : "#E0C990";

  return (
    <svg
      ref={svgRef}
      className={`wf-grapevine-decoration ${className}`}
      viewBox="0 0 360 340"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="wf-grapevine-branch" stroke={vein} strokeWidth="2.2" strokeLinecap="round" opacity=".66">
        <path d="M20 310C91 265 86 212 154 190c61-20 79-60 123-116" />
        <path d="M116 224c-5-39-24-65-61-81M153 191c-4-51 10-86 43-119M183 177c36 0 64 14 84 43M231 136c34-5 62 5 89 27M91 270c31 8 54 3 76-15" />
      </g>
      <g className="wf-grapevine-leaf" transform="translate(53 139) rotate(-14)">
        <path d="M0 0C-30-9-50-33-43-59c19 7 35 15 46 31 3-28 18-49 43-55 5 25-2 47-19 65C49-25 71-26 89-12 76 10 55 19 29 16 18 38 1 49-24 44-20 25-12 11 0 0Z" fill={leaf} fillOpacity=".34" stroke={leafLight} strokeOpacity=".6" strokeWidth="1.4" />
        <path d="M0 0 43-81M0 0-40-56M0 0 69-14M0 0-18 41M0 0 43 10" stroke={vein} strokeOpacity=".46" strokeWidth="1" />
      </g>
      <g className="wf-grapevine-leaf" transform="translate(197 72) rotate(12) scale(.88)">
        <path d="M0 0C-29-13-45-37-34-61c20 6 33 18 40 37 8-26 27-43 52-43 0 24-10 45-31 59 24-4 45 5 58 25-20 17-43 19-66 8C3 45-17 50-40 36-31 18-18 6 0 0Z" fill={leafLight} fillOpacity=".28" stroke={leafLight} strokeOpacity=".58" strokeWidth="1.4" />
        <path d="M0 0 52-67M0 0-31-57M0 0 74-8M0 0-34 31M0 0 38 22" stroke={vein} strokeOpacity=".45" strokeWidth="1" />
      </g>
      <g className="wf-grapevine-leaf" transform="translate(282 225) rotate(25) scale(.78)">
        <path d="M0 0C-28-11-44-32-37-56c20 5 34 16 42 34 5-25 22-43 47-46 3 24-5 44-25 60 22-6 43 1 58 19-18 18-41 23-65 14C8 47-11 54-35 43-29 23-17 8 0 0Z" fill={leaf} fillOpacity=".32" stroke={leafLight} strokeOpacity=".58" strokeWidth="1.5" />
        <path d="M0 0 48-65M0 0-33-52M0 0 75-1M0 0-29 38M0 0 40 24" stroke={vein} strokeOpacity=".45" strokeWidth="1" />
      </g>
      <g className="wf-grapevine-leaf" transform="translate(166 280) rotate(-35) scale(.68)">
        <path d="M0 0C-30-8-48-29-43-53c20 3 35 13 45 30 2-25 18-45 42-50 6 23 0 45-18 63 21-9 43-5 61 11-15 20-36 28-61 22C11 45-7 55-32 47-30 26-18 10 0 0Z" fill={leafLight} fillOpacity=".26" stroke={leafLight} strokeOpacity=".54" strokeWidth="1.5" />
        <path d="M0 0 43-69M0 0-39-49M0 0 75 9M0 0-26 40M0 0 43 28" stroke={vein} strokeOpacity=".42" strokeWidth="1" />
      </g>
      <g className="wf-grapevine-cluster" transform="translate(282 188)" fill={variant === "olive" ? "#7F6844" : "#A88D54"} fillOpacity=".48" stroke={vein} strokeOpacity=".38" strokeWidth="1">
        <path d="M0-8C-4-21-1-32 7-42M7-42c10-8 21-8 31-2" stroke={vein} strokeOpacity=".62" strokeWidth="2" fill="none" />
        <circle cx="4" cy="1" r="9"/><circle cx="21" cy="3" r="9"/><circle cx="-5" cy="17" r="9"/><circle cx="12" cy="19" r="9"/><circle cx="29" cy="19" r="9"/><circle cx="3" cy="34" r="8"/><circle cx="20" cy="35" r="8"/><circle cx="11" cy="49" r="7"/>
      </g>
    </svg>
  );
}
