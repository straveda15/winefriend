"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MarqueeProps {
  text: string;
  repeat?: number;
  className?: string;
  speed?: number;
}

export function Marquee({ text, repeat = 8, className = "", speed = 35 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [speed]);

  const items = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="flex items-center gap-6 px-6 whitespace-nowrap">
      <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold italic opacity-[0.06] select-none">
        {text}
      </span>
      <span className="w-1.5 h-1.5 rotate-45 bg-gold/25 shrink-0" />
    </span>
  ));

  return (
    <div className={`overflow-hidden py-5 ${className}`}>
      <div ref={trackRef} className="flex w-max">
        {items}
        {items}
      </div>
    </div>
  );
}
