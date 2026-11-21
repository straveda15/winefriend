"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Container } from "@/components/layout/Container";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Button } from "@/components/ui/Button";
import { aboutPillars, aboutContent } from "@/data/about";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";
import { Img } from "@/components/ui/Img";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AboutSection({ preview = false }: { preview?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const storyPillars = [
    {
      ...aboutPillars[0],
      description: "Founded by Manoj Jagtap, with experience in wine products and winery tours.",
    },
    {
      ...aboutPillars[1],
      description: "Wine accessories, made or customised to client needs.",
    },
    {
      ...aboutPillars[3],
      description: "Wine products for businesses and enthusiasts, plus tours in Nashik Valley.",
    },
  ];
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heading = section.querySelector<HTMLElement>(".wf-about-main-heading");
    const storyHeading = section.querySelector<HTMLElement>(".wf-about-story-heading");
    const cards = gsap.utils.toArray<HTMLElement>(".wf-about-pillar", section);
    const icons = gsap.utils.toArray<HTMLElement>(".wf-about-pillar-icon", section);
    const paragraphs = gsap.utils.toArray<HTMLElement>(".wf-about-story-copy", section);
    const cta = section.querySelector<HTMLElement>(".wf-about-cta");
    const frame = section.querySelector<HTMLElement>(".wf-about-editorial-image");
    const image = section.querySelector<HTMLElement>(".wf-about-editorial-photo");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    if (heading) {
      timeline.fromTo(heading,
        { autoAlpha: 0, y: 14, clipPath: "inset(0 0 100% 0)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.68 },
        0,
      );
    }

    if (storyHeading) {
      timeline.fromTo(storyHeading,
        { autoAlpha: 0, x: 18 },
        { autoAlpha: 1, x: 0, duration: 0.62 },
        0.14,
      );
    }
    if (cards.length) {
      timeline.fromTo(cards,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.11 },
        0.22,
      );
    }
    if (icons.length) {
      timeline.fromTo(icons,
        { scale: 0.88, transformOrigin: "center center" },
        { scale: 1, duration: 0.45, stagger: 0.11, ease: "power2.out" },
        0.32,
      );
    }
    if (paragraphs.length) {
      timeline.fromTo(paragraphs,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.62 },
        0.46,
      );
    }
    if (cta) {
      timeline.fromTo(cta,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        0.62,
      );
    }
    if (frame) {
      timeline.fromTo(frame,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.95, ease: "power2.inOut" },
        0.2,
      );
    }
    if (image) {
      timeline.fromTo(image,
        { scale: 1.045 },
        { scale: 1, duration: 1.25, ease: "power2.out" },
        0.2,
      );
    }
  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className="wf-section wf-about py-12 lg:py-18 bg-ivory">
      <GrapevineDecoration className="wf-vine wf-vine--top-right wf-vine--about" variant="champagne" />
      <Container className="wf-botanical-content">
        <div className="wf-about-grid">
          <div className="wf-about-story-content">
            <span className="wf-about-eyebrow">Our Story</span>
            <h2 className="wf-about-main-heading wf-display-heading font-serif font-normal text-charcoal leading-[1.05]">
              Wine, from Accessories to<br />Experiences
            </h2>
            <h3 className="wf-about-story-heading font-serif text-xl sm:text-2xl font-normal text-burgundy">
              {aboutContent.storyHeading}
            </h3>
            <p className="wf-about-story-copy text-charcoal-light font-sans text-sm leading-relaxed">
              {preview ? aboutContent.storyPreviewText : aboutContent.storyText}
            </p>
          </div>
          <div className="wf-about-pillars grid grid-cols-3">
            {storyPillars.map((pillar) => (
              <FeatureIcon key={pillar.title} pillar={pillar} />
            ))}
          </div>
          <figure className="wf-about-editorial-image">
            <Img
              src="/images/about/homewinetours.jpg"
              alt="WineFriend guests enjoying a winery visit in Nashik"
              fill
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="wf-about-editorial-photo object-cover object-[44%_center]"
            />
            <figcaption>Wine, Shared in Nashik</figcaption>
          </figure>
          <Button href={aboutContent.ctaHref} variant="primary" className="wf-about-cta">
            {aboutContent.ctaText}
          </Button>
        </div>
      </Container>
    </section>
  );
}
