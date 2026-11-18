"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { GrapevineAnimation } from "@/components/ui/GrapevineAnimation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const slides = [
  {
    src: "/images/hero/lucia-yarushkina-2wEYI23jWn8-unsplash.jpg",
    alt: "Wine bottles displayed in an atmospheric cellar",
    label: "The wine cellar",
  },
  {
    src: "/images/hero/racha-debbech-_EN2OnJb9Ao-unsplash.jpg",
    alt: "Wine being poured at an elegant dining table",
    label: "The wine ritual",
  },
  {
    src: "/images/hero/rafael-padeiro-eC_31j8rSBg-unsplash.jpg",
    alt: "Wine accessories arranged on a table",
    label: "For the table",
  },
  {
    src: "/images/hero/udit-chandra-ctKH9oC1AhU-unsplash.jpg",
    alt: "Wine bottle, glass, and grapes outdoors",
    label: "A moment to savour",
  },
  {
    src: "/images/hero/hero-slide-03.webp",
    alt: "Wine bottle and glasses beside grapes in a cellar",
    label: "A considered pour",
  },
] as const;

const AUTOPLAY_MS = 5500;
const TRANSITION_MS = 420;
const HERO_IMAGE_REVEAL_MS = 1500;

const slideMotion = [
  { x: -1.2, y: 0.8 },
  { x: 1.1, y: -0.7 },
  { x: -0.8, y: -0.9 },
  { x: 0.9, y: 0.7 },
  { x: -0.6, y: 0.5 },
] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const photoMotionRef = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(0);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [heroEntranceComplete, setHeroEntranceComplete] = useState(false);
  const [heroImageReady, setHeroImageReady] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const handleIntroExit = () => setIntroComplete(true);
    window.addEventListener("wf-home-intro-exit", handleIntroExit);
    return () => window.removeEventListener("wf-home-intro-exit", handleIntroExit);
  }, []);

  const goToSlide = useCallback((requestedIndex: number) => {
    const from = activeRef.current;
    const to = (requestedIndex + slides.length) % slides.length;
    if (from === to) return;

    const outgoing = layerRefs.current[from];
    const incoming = layerRefs.current[to];
    const outgoingPhoto = photoRefs.current[from];
    const incomingPhoto = photoRefs.current[to];
    if (!outgoing || !incoming || !outgoingPhoto || !incomingPhoto) return;

    setTransitioning(true);
    activeRef.current = to;
    setActiveIndex(to);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(outgoing, { autoAlpha: 0, clipPath: "inset(0 0 0 0)" });
      gsap.set(outgoingPhoto, { scale: 1, xPercent: 0, yPercent: 0 });
      gsap.set(incoming, { autoAlpha: 1, clipPath: "inset(0 0 0 0)" });
      gsap.set(incomingPhoto, { scale: 1, xPercent: 0, yPercent: 0 });
      setTransitioning(false);
      return;
    }

    const forward = requestedIndex > from || (from === slides.length - 1 && to === 0);
    const hiddenEdge = forward ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
    const timeline = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      onComplete: () => {
        setTransitioning(false);
        gsap.set(outgoing, { autoAlpha: 0, clipPath: "inset(0 0 0 0)" });
      },
    });
    transitionRef.current?.kill();
    transitionRef.current = timeline;

    const movement = slideMotion[to];
    gsap.set(incoming, { autoAlpha: 1, clipPath: hiddenEdge });
    gsap.set(incomingPhoto, { scale: 1.12, xPercent: movement.x, yPercent: movement.y });
    timeline
      .to(outgoingPhoto, { scale: 0.985, duration: TRANSITION_MS / 1000 }, 0)
      .to(outgoing, { autoAlpha: 0.82, duration: TRANSITION_MS / 1000 }, 0)
      .to(incoming, { clipPath: "inset(0 0 0 0)", duration: TRANSITION_MS / 1000 }, 0);

    photoMotionRef.current?.kill();
    photoMotionRef.current = gsap.to(incomingPhoto, {
      scale: 1,
      xPercent: 0,
      yPercent: 0,
      duration: AUTOPLAY_MS / 1000,
      ease: "power1.inOut",
      overwrite: "auto",
    });
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!introComplete) return;
      gsap.set(layerRefs.current, { autoAlpha: 1, clipPath: "inset(0 0 0 0)" });
      gsap.set(layerRefs.current.slice(1), { autoAlpha: 0 });
      gsap.set(photoRefs.current, { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0 });
      setHeroEntranceComplete(true);
      return;
    }

    gsap.set(layerRefs.current, { autoAlpha: 0, clipPath: "inset(0 0 0 0)" });
    gsap.set(photoRefs.current, { scale: 1.12, xPercent: 0, yPercent: 0 });
    gsap.set(layerRefs.current[0], { autoAlpha: 1, clipPath: "inset(0 0 0 0)" });
    gsap.set(photoRefs.current[0], { autoAlpha: 1, scale: 1.08, xPercent: -100, yPercent: 0 });

    const story = sectionRef.current?.querySelector(".wf-hero-story");
    const eyebrow = sectionRef.current?.querySelector(".wf-hero-eyebrow");
    const headingLines = sectionRef.current?.querySelectorAll(".wf-hero-heading-line");
    const tagline = sectionRef.current?.querySelector(".wf-hero-tagline");
    const actions = sectionRef.current?.querySelectorAll(".wf-hero-actions > *");

    if (story) gsap.set(story, { autoAlpha: 0, xPercent: 100 });
    if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 14, letterSpacing: ".34em" });
    if (headingLines?.length) gsap.set(headingLines, { clipPath: "inset(0 0 calc(100% + .08em) 0)", y: 20 });
    if (tagline) gsap.set(tagline, { autoAlpha: 0, y: 16 });
    if (actions?.length) gsap.set(actions, { autoAlpha: 0, y: 14 });

    // Prepare the hidden entrance state while the Intro is still covering the Hero.
    // The visible timeline starts only after the Intro exit event.
    if (!introComplete || !heroImageReady) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .fromTo(
        photoRefs.current[0],
        { xPercent: -100, scale: 1.08 },
        { xPercent: 0, scale: 1, duration: HERO_IMAGE_REVEAL_MS / 1000, ease: "power3.inOut", onComplete: () => setHeroEntranceComplete(true) },
        0,
      )
      .fromTo(
        story ?? sectionRef.current,
        { autoAlpha: 0, xPercent: 100 },
        { autoAlpha: 1, xPercent: 0, duration: 1.1, ease: "power4.out" },
        0.1,
      )
      .fromTo(eyebrow ?? sectionRef.current, { autoAlpha: 0, y: 14, letterSpacing: ".34em" }, { autoAlpha: 1, y: 0, letterSpacing: ".2em", duration: .4 }, .2)
      .fromTo(headingLines?.length ? headingLines : sectionRef.current, { clipPath: "inset(0 0 calc(100% + .08em) 0)", y: 20 }, { clipPath: "inset(0 0 -.08em 0)", y: 0, duration: .48, stagger: .07 }, .4)
      .fromTo(tagline ?? sectionRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .4 }, .8)
      .fromTo(actions?.length ? actions : sectionRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .1 }, 1.05);

    const scrollMotion = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: .7,
      },
    });
    scrollMotion
      .to(".wf-hero-image-stack", { yPercent: 4, ease: "none" }, 0)
      .to(".wf-hero-vine-art", { y: 42, ease: "none" }, 0);

    return () => {
      transitionRef.current?.kill();
      photoMotionRef.current?.kill();
      scrollMotion.scrollTrigger?.kill();
    };
  }, { scope: sectionRef, dependencies: [introComplete, heroImageReady], revertOnUpdate: true });

  useEffect(() => {
    if (!heroEntranceComplete) return;
    if (paused) {
      progressTweenRef.current?.pause();
      return;
    }

    const progress = progressRef.current;
    if (progress) {
      gsap.killTweensOf(progress);
      gsap.set(progress, { scaleX: 0 });
      progressTweenRef.current = gsap.to(progress, { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: "none" });
    }

    const timer = window.setTimeout(() => goToSlide(activeRef.current + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, goToSlide, heroEntranceComplete]);

  useEffect(() => {
    const nextIndex = (activeIndex + 1) % slides.length;
    if (nextIndex === 0) return;
    const image = new window.Image();
    image.fetchPriority = "low";
    image.src = slides[nextIndex].src;
    return () => { image.onload = null; };
  }, [activeIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(activeRef.current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(activeRef.current + 1);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current;
    if (Math.abs(delta) > 48) goToSlide(activeRef.current + (delta < 0 ? 1 : -1));
    touchStartXRef.current = null;
  };

  return (
    <section id="home" ref={sectionRef} className="wf-hero" aria-labelledby="wf-hero-title" onKeyDown={handleKeyDown}>
      <div
        className="wf-hero-visual"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-roledescription="carousel"
        aria-label="Wine Friend featured experiences"
      >
        <div className="wf-hero-visual-art">
          <div className="wf-hero-image-stack">
            {slides.map((slide, index) => (
              <div
                key={slide.src}
                ref={(element) => { layerRefs.current[index] = element; }}
                className="wf-hero-image-layer"
                aria-hidden={activeIndex !== index}
              >
                <Img
                  src={slide.src}
                  alt={slide.alt}
                  ref={(element) => { photoRefs.current[index] = element; }}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  sizes="(max-width: 767px) 100vw, 34vw"
                  className="wf-hero-photo"
                  draggable={false}
                  onLoad={() => { if (index === 0) setHeroImageReady(true); }}
                  onError={() => { if (index === 0) setHeroImageReady(true); }}
                />
              </div>
            ))}
          </div>
          <div className="wf-hero-visual-shade" />
          <div className="wf-hero-controls">
            <div className="wf-hero-indicators" aria-label="Choose a featured image">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  className={`wf-hero-indicator ${activeIndex === index ? "is-active" : ""}`}
                  aria-label={`Show slide ${index + 1}: ${slide.label}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  onClick={() => goToSlide(index)}
                >
                  <span>{index === activeIndex ? <span ref={progressRef} className="wf-hero-progress" /> : null}</span>
                </button>
              ))}
            </div>
            <button type="button" className="wf-hero-arrow" aria-label="Previous slide" onClick={() => goToSlide(activeRef.current - 1)}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="wf-hero-arrow" aria-label="Next slide" onClick={() => goToSlide(activeRef.current + 1)}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="wf-hero-story">
        <GrapevineAnimation mode="home" className="wf-hero-vine-art" />

        <div className="wf-hero-copy">
          <p className="wf-hero-eyebrow">A world of wine, thoughtfully curated</p>
          <h1 id="wf-hero-title">
            <span className="wf-hero-heading-line">Everything</span>
            <span className="wf-hero-heading-line wf-hero-heading-accent">wine.</span>
            <span className="wf-hero-heading-line">One trusted</span>
            <span className="wf-hero-heading-line wf-hero-heading-accent">friend.</span>
          </h1>
          <p className="wf-hero-tagline">Always in All Ways for the Wine Lovers</p>
          <div className="wf-hero-actions">
            <Button href="/products">Explore Our Products</Button>
            <Button href="/wine-tours" variant="secondary" className="wf-hero-outline">Discover Wine Experiences</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
