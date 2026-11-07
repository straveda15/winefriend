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

      const heading = section.querySelector<HTMLElement>(".wf-discover-heading");
      const kicker = heading?.querySelector<HTMLElement>(".wf-discover-kicker");
      const title = heading?.querySelector<HTMLElement>("h2");
      const description = heading?.querySelector<HTMLElement>(".wf-discover-description");
      const cards = gsap.utils.toArray<HTMLElement>(".wf-category-card", section);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (heading) timeline.fromTo(heading, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1 });
      if (kicker) timeline.fromTo(kicker, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.75 }, "-=0.8");
      if (title) timeline.fromTo(title, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1 }, "-=0.65");
      if (description) timeline.fromTo(description, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.85 }, "-=0.7");
      if (cards.length) {
        timeline.fromTo(
          cards,
          { autoAlpha: 0, y: 80 },
          { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.25 },
          "-=0.35"
        );
        cards.forEach((card, index) => {
          const imageReveal = card.querySelector<HTMLElement>(".wf-category-image-reveal");
          const image = card.querySelector<HTMLElement>(".wf-category-image");
          if (imageReveal) {
            timeline.fromTo(imageReveal, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1 }, `-=${index === 0 ? 0.85 : 0.65}`);
          }
          if (image) {
            timeline.fromTo(image, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: "power3.out" }, "<");
          }
        });
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
            kicker="A world of wine, thoughtfully curated"
            heading="Discover the World of Wine Friend"
            description="Wine Friend is a registered trademark of Nashik-based Kamaltara Enterprises, owned and operated by Manoj Jagtap. The company makes and imports wine products and arranges curated Nashik Valley winery visits."
          />
        </div>
        <div className="wf-category-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
