"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        backgroundRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.8, ease: "power2.out" },
        0,
      );

      tl.fromTo(
        ".cta-heading-line-inner",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 },
        0.25,
      );
      tl.fromTo(
        ".cta-heading-line",
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1.1, stagger: 0.12 },
        0.25,
      );

      tl.fromTo(
        ".cta-desc",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.75 },
        ">-0.5",
      );

      tl.fromTo(
        ".cta-btn",
        { autoAlpha: 0, y: 25 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.2 },
        ">-0.25",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="contact" ref={sectionRef} className="wf-cta relative py-14 lg:py-20 overflow-hidden">
      {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 img-fallback-wine" />
        <div ref={backgroundRef} className="absolute inset-0">
          <Image
            src="/images/about/wine-cellar.webp"
            alt="Warmly lit wine cellar lined with wooden bottle racks"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="cta-burgundy-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <GrapevineDecoration className="wf-vine wf-vine--bottom-right wf-vine--cta" variant="champagne" />
      <Container className="wf-botanical-content relative text-center">
        <div>
          <h2 aria-label="Whatever Your World of Wine Looks Like, We're Here to Help." className="cta-heading font-serif text-3xl sm:text-4xl lg:text-6xl font-normal text-white leading-[1.05] max-w-3xl mx-auto mb-6">
            <span aria-hidden="true" className="cta-heading-line"><span className="cta-heading-line-inner">Whatever Your World</span></span>
            <span aria-hidden="true" className="cta-heading-line"><span className="cta-heading-line-inner">of Wine Looks Like,</span></span>
            <span aria-hidden="true" className="cta-heading-line"><span className="cta-heading-line-inner">We&apos;re Here to Help.</span></span>
          </h2>
          <p className="cta-desc text-white/85 font-sans text-base leading-7 max-w-2xl mx-auto mb-9">
            Looking for wine accessories, customised products for your business,
            or a memorable wine experience?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="cta-btn">
              <Button
                href="/products"
                variant="secondary"
                className="wf-cta-button border-gold/50 text-white hover:bg-gold hover:text-charcoal"
              >
                Enquire About Products
              </Button>
            </div>
            <div className="cta-btn">
              <Button
                href="/wine-tours"
                variant="secondary"
                className="wf-cta-button border-gold/60 text-gold-muted hover:bg-gold hover:text-charcoal"
              >
                Plan Your Wine Experience
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
