"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ContactPageMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const titleWords = gsap.utils.toArray<HTMLElement>(".wf-contact-title-word", root);
      const detailsCopy = root.querySelector<HTMLElement>(".wf-contact-details-copy");
      const detailItems = gsap.utils.toArray<HTMLElement>(".wf-contact-detail", root);
      const form = root.querySelector<HTMLElement>(".wf-contact-form");
      const formParts = form
        ? gsap.utils.toArray<HTMLElement>(
            ".wf-contact-form-heading, .wf-contact-form > label, .wf-contact-form-row > label, .wf-contact-submit",
            form,
          )
        : [];

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.fromTo(
        ".wf-contact-details > .wf-contact-kicker",
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45 },
      );
      if (titleWords.length) {
        intro.fromTo(
          titleWords,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
          "-=0.2",
        );
      }
      if (detailsCopy) {
        intro.fromTo(
          detailsCopy,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          "-=0.3",
        );
      }

      if (detailItems.length) {
        gsap.fromTo(
          detailItems,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: detailItems[0],
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      if (form) {
        const formIntro = gsap.timeline({
          scrollTrigger: {
            trigger: form,
            start: "top 84%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });
        formIntro.fromTo(
          form,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
        );
        if (formParts.length) {
          formIntro.fromTo(
            formParts,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07 },
            "-=0.35",
          );
        }
      }
    },
    { scope: rootRef, revertOnUpdate: true },
  );

  return <div ref={rootRef} className="wf-contact-motion-root">{children}</div>;
}
