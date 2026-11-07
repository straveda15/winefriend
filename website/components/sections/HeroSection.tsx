"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Button } from "@/components/ui/Button";

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
const TRANSITION_MS = 1400;
const HERO_IMAGE_REVEAL_MS = 3800;

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
  const transitioningRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [heroEntranceComplete, setHeroEntranceComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const goToSlide = useCallback((requestedIndex: number) => {
    const from = activeRef.current;
    const to = (requestedIndex + slides.length) % slides.length;
    if (from === to || transitioningRef.current) return;

    const outgoing = layerRefs.current[from];
    const incoming = layerRefs.current[to];
    const outgoingPhoto = photoRefs.current[from];
    const incomingPhoto = photoRefs.current[to];
    if (!outgoing || !incoming || !outgoingPhoto || !incomingPhoto) return;

    transitioningRef.current = true;
    setTransitioning(true);
    activeRef.current = to;
    setActiveIndex(to);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(outgoing, { autoAlpha: 0, clipPath: "inset(0 0 0 0)" });
      gsap.set(outgoingPhoto, { scale: 1, xPercent: 0, yPercent: 0 });
      gsap.set(incoming, { autoAlpha: 1, clipPath: "inset(0 0 0 0)" });
      gsap.set(incomingPhoto, { scale: 1, xPercent: 0, yPercent: 0 });
      transitioningRef.current = false;
      setTransitioning(false);
      return;
    }

    const forward = requestedIndex > from || (from === slides.length - 1 && to === 0);
    const hiddenEdge = forward ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
    const timeline = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      onComplete: () => {
        transitioningRef.current = false;
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
    if (!heroImageLoaded) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .fromTo(
        photoRefs.current[0],
        { xPercent: -100, scale: 1.08 },
        { xPercent: 0, scale: 1, duration: HERO_IMAGE_REVEAL_MS / 1000, ease: "power3.inOut", onComplete: () => setHeroEntranceComplete(true) },
        0,
      )
      .fromTo(
        ".wf-hero-story",
        { autoAlpha: 0, xPercent: 100 },
        { autoAlpha: 1, xPercent: 0, duration: 4.2, ease: "power4.out" },
        0.3,
      )
      .fromTo(".wf-hero-eyebrow", { autoAlpha: 0, y: 14, letterSpacing: ".34em" }, { autoAlpha: 1, y: 0, letterSpacing: ".2em", duration: .6 }, 1.05)
      .fromTo(".wf-hero-heading-line", { clipPath: "inset(0 0 100% 0)", y: 20 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: .72, stagger: .12 }, 1.45)
      .fromTo(".wf-hero-tagline", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .58 }, 2.55)
      .fromTo(".wf-hero-actions > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .58, stagger: .16 }, 3.15);

    const vinePaths = gsap.utils.toArray<SVGPathElement>(".wf-hero-vine-art path, .wf-hero-vine-art circle");
    vinePaths.forEach((path) => {
      const length = path.getTotalLength?.() ?? 0;
      if (length > 0) gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    if (vinePaths.length) {
      gsap.to(vinePaths, { strokeDashoffset: 0, duration: 1.9, stagger: .025, ease: "power1.out", delay: .2 });
    }

    const vineLeaves = gsap.utils.toArray<SVGGraphicsElement>(".wf-hero-vine-leaf", sectionRef.current);
    gsap.to(vineLeaves, {
      rotation: 2.2,
      duration: 7,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.55, from: "random" },
      transformOrigin: "50% 65%",
    });

    const grapeCluster = sectionRef.current?.querySelector<SVGGElement>(".wf-hero-grape-cluster");
    if (grapeCluster) {
      gsap.to(grapeCluster, {
        y: -5,
        rotation: 1.8,
        scale: 1.025,
        duration: 6.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }

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
  }, { scope: sectionRef, dependencies: [heroImageLoaded] });

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
    const preload = new window.Image();
    preload.src = slides[nextIndex].src;
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
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  ref={(element) => { photoRefs.current[index] = element; }}
                  fill
                  preload={index === 0}
                  sizes="(max-width: 767px) 100vw, 34vw"
                  className="wf-hero-photo"
                  draggable={false}
                  onLoad={index === 0 ? (event) => {
                    void event.currentTarget.decode().then(() => setHeroImageLoaded(true));
                  } : undefined}
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
                  disabled={transitioning}
                  onClick={() => goToSlide(index)}
                >
                  <span>{index === activeIndex ? <span ref={progressRef} className="wf-hero-progress" /> : null}</span>
                </button>
              ))}
            </div>
            <button type="button" className="wf-hero-arrow" aria-label="Previous slide" disabled={transitioning} onClick={() => goToSlide(activeRef.current - 1)}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="wf-hero-arrow" aria-label="Next slide" disabled={transitioning} onClick={() => goToSlide(activeRef.current + 1)}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="wf-hero-story">
        <div className="wf-hero-vine-art" aria-hidden="true">
          <svg viewBox="0 0 900 700" fill="none">
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-30 510C125 430 113 300 244 323c92 16 72 130 10 132-47 2-51-61-15-71 24-7 39 18 25 34M201 329c-60-72-53-133-8-166 36 39 38 91 8 166Zm8 4c-3-94 43-136 101-126 2 52-31 100-101 126Zm-14-3c-67-70-127-70-157-29 31 43 83 58 157 29Z" />
              <path d="M240 323c64-60 112-99 170-132m-182 131c-51 5-100 18-150 50m170-30c23 39 55 75 96 111" />
              <path className="wf-hero-vine-leaf" d="M423 188c-10 39-4 67 22 84 26-17 32-45 22-84-10-23-34-23-44 0Zm22 83v59m-1-33c-27-32-54-37-76-18 13 31 39 42 76 18Zm2-2c26-33 53-39 76-20-12 31-38 43-76 20Z" />
              <path className="wf-hero-vine-leaf" d="M285 473c37-15 67-14 91 5-17 32-45 43-83 32 20 29 23 57 6 82-31-18-43-46-35-84-28 21-56 25-82 7 15-32 42-46 81-40-24-25-32-52-17-80 34 12 52 37 48 78Zm-18 19 79-14m-67 26 32 52" />
              <g className="wf-hero-grape-cluster"><circle cx="558" cy="395" r="17"/><circle cx="585" cy="395" r="17"/><circle cx="572" cy="420" r="17"/><circle cx="599" cy="420" r="17"/><circle cx="586" cy="445" r="17"/><circle cx="572" cy="470" r="17"/><path className="wf-hero-vine-leaf" d="M572 378c-5-26 6-43 30-52 3 21-6 39-30 52Zm29-52c17-24 37-28 59-13-13 20-32 25-59 13Z"/></g>
              <path className="wf-hero-vine-leaf" d="M620 411c84-38 105-91 78-135-42 23-56 64-41 123 34-58 78-70 119-39-25 44-69 61-132 51Zm71-54 66-28m-57 44 65 16" />
              <path className="wf-hero-vine-leaf" d="M738 572c-61-24-78-65-50-105 43 21 59 57 45 107 31-47 69-56 106-29-21 39-59 54-111 42m9-32 70-13" />
            </g>
          </svg>
        </div>

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
