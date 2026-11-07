"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Container } from "@/components/layout/Container";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { FadeUp } from "@/components/animations/FadeUp";
import { TextReveal } from "@/components/animations/TextReveal";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import { aboutPillars, aboutContent } from "@/data/about";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AboutSection({ preview = false }: { preview?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const frame = imageFrameRef.current;
    const image = imageRef.current;
    if (!frame || !image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: frame,
        start: "top 82%",
        toggleActions: "play none none none",
      },
      defaults: { ease: "power2.out" },
    });
    reveal
      .fromTo(frame, { clipPath: "inset(12% 0 0 0)" }, { clipPath: "inset(0 0 0 0)", duration: 1.1 })
      .fromTo(image, { scale: 1.06 }, { scale: 1, duration: 1.5 }, "<");
  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className="wf-section wf-about py-12 lg:py-18 bg-ivory">
      <GrapevineDecoration className="wf-vine wf-vine--top-right wf-vine--about" variant="champagne" />
      <Container className="wf-botanical-content">
        <div className="wf-about-grid grid grid-cols-1 lg:grid-cols-2 items-start">
          {/* Left – Pillars */}
          <div>
            <TextReveal>
              <h2 className="wf-display-heading font-serif text-3xl sm:text-4xl lg:text-6xl font-normal text-charcoal leading-[1.05] mb-10">
                {aboutContent.heading}
              </h2>
            </TextReveal>
            <StaggerChildren
              className="wf-about-pillars grid grid-cols-1 sm:grid-cols-2 gap-4"
              stagger={0.15}
            >
              {(preview ? aboutPillars.slice(0, 2) : aboutPillars).map((pillar) => (
                <FeatureIcon key={pillar.title} pillar={pillar} horizontalMobile={!preview} />
              ))}
            </StaggerChildren>
          </div>

          {/* Right – Story */}
          <div className="wf-about-story-column">
            <FadeUp delay={0.2}>
              <div className="lg:pt-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-burgundy mb-5">
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
            </FadeUp>
            <figure ref={imageFrameRef} className="wf-about-editorial-image">
              <Image
                ref={imageRef}
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
