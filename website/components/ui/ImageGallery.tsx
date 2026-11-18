"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const AUTO_SCROLL_SPEED = 48;

const photos = [
  { src: "/images/experiences/vineyard-landscape.webp", alt: "Sunlit vineyard rows across the countryside" },
  { src: "/images/journal/grape-harvest.webp", alt: "Grapes growing on the vine" },
  { src: "/images/business/wine-service-business.webp", alt: "Wine being poured into a decanter" },
  { src: "/images/journal/indian-wine-experience.webp", alt: "Wine and glasses arranged for a tasting" },
  { src: "/images/categories/wine-accessories-display.webp", alt: "Wine accessories on display" },
  { src: "/images/categories/nashik-countryside.webp", alt: "Green countryside near Nashik" },
  { src: "/images/about/wine-cellar.webp", alt: "Wine bottles in a cellar" },
  { src: "/images/categories/business-wine-gifting.webp", alt: "Wine bottles arranged as a gift" },
];

export function ImageGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const dragRef = useRef({ active: false, pointerId: -1, startX: 0, trackX: 0 });
  const hoverRef = useRef(false);

  useGSAP(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!root || !track || !group) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let distance = 0;

    const startLoop = (from = 0) => {
      tweenRef.current?.kill();
      distance = group.getBoundingClientRect().width;
      if (!distance) return;
      const normalized = ((from % distance) + distance) % distance;
      const x = -normalized;
      gsap.set(track, { x });
      if (reducedMotion.matches) return;
      tweenRef.current = gsap.to(track, {
        x: x - distance,
        duration: distance / AUTO_SCROLL_SPEED,
        ease: "none",
        repeat: -1,
      });
      if (hoverRef.current) tweenRef.current.pause();
    };

    if (!reducedMotion.matches) {
      const slides = gsap.utils.toArray<HTMLElement>(".wf-gallery-item", root);
      gsap.fromTo(slides,
        { autoAlpha: 0, y: 22, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        },
      );
    }

    startLoop();
    const observer = new ResizeObserver(() => {
      const currentX = Number(gsap.getProperty(track, "x")) || 0;
      const progress = distance ? Math.abs(currentX) / distance : 0;
      startLoop(progress * group.getBoundingClientRect().width);
    });
    observer.observe(group);

    const onVisibilityChange = () => {
      if (document.hidden) tweenRef.current?.pause();
      else if (!hoverRef.current && !dragRef.current.active && !reducedMotion.matches) tweenRef.current?.play();
    };
    const onMotionChange = () => {
      const currentX = Number(gsap.getProperty(track, "x")) || 0;
      startLoop(Math.abs(currentX));
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, { scope: rootRef });

  const pause = () => {
    hoverRef.current = true;
    tweenRef.current?.pause();
  };

  const resume = () => {
    hoverRef.current = false;
    if (!dragRef.current.active && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) tweenRef.current?.play();
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      trackX: Number(gsap.getProperty(track, "x")) || 0,
    };
    tweenRef.current?.pause();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || !track || !group) return;
    const distance = group.getBoundingClientRect().width;
    if (!distance) return;
    const moved = drag.trackX + event.clientX - drag.startX;
    const wrappedDistance = ((moved % distance) + distance) % distance;
    const wrapped = wrappedDistance === 0 ? 0 : wrappedDistance - distance;
    gsap.set(track, { x: wrapped });
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.active = false;
    if (!hoverRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const track = trackRef.current;
      if (track) {
        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        const distance = groupRef.current?.getBoundingClientRect().width ?? 0;
        if (distance) {
          tweenRef.current?.kill();
          tweenRef.current = gsap.to(track, { x: currentX - distance, duration: distance / AUTO_SCROLL_SPEED, ease: "none", repeat: -1 });
        }
      }
    }
  };

  const renderPhotos = (duplicate = false) => photos.map((photo, index) => (
    <div className="wf-gallery-item" key={`${duplicate ? "copy-" : ""}${photo.src}`}>
      <Image
        src={photo.src}
        alt={duplicate ? "" : photo.alt}
          width={1200}
          height={800}
        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 38vw, 25vw"
        loading="lazy"
        draggable={false}
      />
    </div>
  ));

  return (
    <section
      ref={rootRef}
      className="wf-image-gallery"
      aria-label="WineFriend vineyard, wine and tasting photography"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") pause(); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") resume(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="wf-gallery-viewport">
        <div ref={trackRef} className="wf-gallery-track">
          <div ref={groupRef} className="wf-gallery-group">{renderPhotos()}</div>
          <div className="wf-gallery-group" aria-hidden="true">{renderPhotos(true)}</div>
        </div>
      </div>
    </section>
  );
}
