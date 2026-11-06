import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const ANIMATION_DEFAULTS = {
  fadeUp: {
    duration: 0.8,
    ease: "power2.out",
    y: 40,
  },
  stagger: {
    each: 0.15,
    from: "start" as const,
  },
  scrollTrigger: {
    start: "top 85%",
    toggleActions: "play none none none" as const,
  },
};
