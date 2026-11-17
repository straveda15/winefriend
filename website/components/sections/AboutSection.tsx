"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Container } from "@/components/layout/Container";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { aboutPillars, aboutContent } from "@/data/about";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";
import { Img } from "@/components/ui/Img";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AboutSection({ preview = false }: { preview?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heading = section.querySelector<HTMLElement>(".wf-about-main-heading");
    const storyHeading = section.querySelector<HTMLElement>(".wf-about-story-heading");
    const divider = section.querySelector<HTMLElement>(".wf-about-divider");
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
    if (divider) {
      timeline.fromTo(divider,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.58, ease: "power2.out" },
        0.38,
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
        <div className="wf-about-grid grid grid-cols-1 lg:grid-cols-2 items-start">
          {/* Left – Pillars */}
          <div>
            <div>
              <h2 className="wf-about-main-heading wf-display-heading font-serif text-3xl sm:text-4xl lg:text-6xl font-normal text-charcoal leading-[1.05] mb-10">
                {aboutContent.heading}
              </h2>
            </div>
            <div className="wf-about-pillars grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutPillars.map((pillar) => (
                <FeatureIcon key={pillar.title} pillar={pillar} horizontalMobile={!preview} />
              ))}
            </div>
          </div>

          {/* Right – Story */}
          <div className="wf-about-story-column">
            <div>
              <div className="lg:pt-2">
                <h3 className="wf-about-story-heading font-serif text-2xl sm:text-3xl font-normal text-burgundy mb-5">
                  {aboutContent.storyHeading}
                </h3>
                <Divider className="wf-about-divider mb-4" />
                <p className={`wf-about-story-copy text-charcoal-light font-sans text-sm leading-relaxed mb-5 ${preview ? "line-clamp-4" : ""}`}>
                  {aboutContent.storyText}
                </p>
                <Button href={aboutContent.ctaHref} variant="ghost" className="wf-about-cta">
                  {aboutContent.ctaText}
                </Button>
              </div>
            </div>
            <figure className="wf-about-editorial-image">
              <Img
                src="/images/about/wine-cellar.webp"
                alt="A warmly lit wine cellar lined with wooden racks and bottles"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="wf-about-editorial-photo object-cover"
              />
              <figcaption>A World Built Around Wine</figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
