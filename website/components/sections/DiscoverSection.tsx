"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { categories } from "@/data/categories";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function DiscoverSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const headingParts = gsap.utils.toArray<HTMLElement>(
        ".wf-discover-kicker, .wf-discover-heading h2, .wf-discover-description",
        section,
      );
      const imageFrames = gsap.utils.toArray<HTMLElement>(".wf-discover-image-reveal", section);
      const images = gsap.utils.toArray<HTMLElement>(".wf-discover-image", section);
      const numbers = gsap.utils.toArray<HTMLElement>(".wf-discover-item-number", section);
      const titles = gsap.utils.toArray<HTMLElement>(".wf-discover-item-title", section);
      const descriptions = gsap.utils.toArray<HTMLElement>(".wf-discover-item-description", section);
      const links = gsap.utils.toArray<HTMLElement>(".wf-discover-item-cta", section);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
        start: "top 82%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (headingParts.length) {
        timeline.fromTo(
          headingParts,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.08 },
        );
      }
      if (imageFrames.length) {
        timeline.fromTo(
          imageFrames,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.82, stagger: 0.12, ease: "power2.inOut" },
          ">-0.12",
        );
      }
      if (images.length) {
        timeline.fromTo(
          images,
          { scale: 1.035 },
          { scale: 1, duration: 1, stagger: 0.12, ease: "power2.out" },
          "<",
        );
      }
      if (numbers.length) {
        timeline.fromTo(
          numbers,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, stagger: 0.12 },
          ">-0.12",
        );
      }
      if (titles.length) {
        timeline.fromTo(
          titles,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.12 },
          "<0.06",
        );
      }
      if (descriptions.length) {
        timeline.fromTo(
          descriptions,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.12 },
          ">-0.2",
        );
      }
      if (links.length) {
        timeline.fromTo(
          links,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, stagger: 0.12 },
          ">-0.12",
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="wf-section wf-discover py-12 lg:py-18 bg-ivory">
      <GrapevineDecoration className="wf-vine wf-vine--top-right" />
      <Container className="wf-botanical-content">
        <div className="wf-discover-heading">
          <SectionHeading
            align="left"
            kicker="A world of wine, thoughtfully curated"
            heading="Discover the World of Wine Friend"
            description={<>Wine Friend is a registered trademark of Nashik-based Kamaltara Enterprises, owned and operated by Manoj Jagtap.<br className="hidden lg:block" /> The company makes and imports wine products and arranges curated Nashik Valley winery visits.</>}
          />
        </div>
        <div className="wf-discover-directory">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index + 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
