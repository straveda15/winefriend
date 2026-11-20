"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { Building2, Grape, Handshake, Heart, Sparkles, X, type LucideIcon } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Container } from "@/components/layout/Container";
import { Img } from "@/components/ui/Img";
import { ProductGallery } from "@/components/products/ProductGallery";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const workAreas = [
  {
    title: "Wine Accessories",
    description: "Corkscrews, stoppers, glassware and serving essentials.",
    image: "/images/categories/wine-accessories-display.webp",
    alt: "Wine bottles and glassware arranged for serving",
    href: "/products",
    icon: Grape,
  },
  {
    title: "Wine Furniture & Custom Products",
    description: "Barrel furniture, racks and products customised to your needs.",
    image: "/images/serving/Rustic Barrel Wine Tasting Table.png",
    alt: "Rustic wine barrel tasting table with stools and glasses",
    href: undefined,
    icon: Building2,
  },
  {
    title: "Business Solutions",
    description: "Wine gifting and product solutions for business requirements.",
    image: "/images/categories/business-wine-gifting.webp",
    alt: "Wine bottles prepared in a presentation gift box",
    href: "/business-solutions",
    icon: Handshake,
  },
  {
    title: "Wine Tourism",
    description: "Curated winery visits and wine experiences in Nashik Valley.",
    image: "/images/experiences/vineyard-landscape.webp",
    alt: "Vineyard rows in Nashik Valley",
    href: "/wine-tours",
    icon: Grape,
  },
];

const philosophy: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Passion for Wine", description: "Celebrating wine culture and the people behind it.", icon: Heart },
  { title: "Quality & Craft", description: "Thoughtful accessories and customised solutions.", icon: Sparkles },
  { title: "Customer Relationships", description: "Listening closely to wine lovers and businesses.", icon: Handshake },
  { title: "Meaningful Experiences", description: "Sharing Nashik through curated winery visits.", icon: Grape },
];

const connectionImages = [
  { src: "/images/about/aboutimg1.jpg", alt: "Wine Friend at an industry event" },
  { src: "/images/about/aboutimg2.jpg", alt: "Wine accessories and glassware display" },
  { src: "/images/about/aboutimg3.jpg", alt: "Wine Friend team and products at an event" },
  { src: "/images/about/aboutimg4.jpg", alt: "Wine Friend exhibition display" },
  { src: "/images/about/aboutimg5.jpg", alt: "Wine Friend team showcasing wine products at an exhibition" },
];

const CONNECTION_SCROLL_SPEED = 48;

export function AboutWorkAndConnections() {
  const [furnitureDialogOpen, setFurnitureDialogOpen] = useState(false);

  return (
    <>
      <section className="wf-section wf-about-work">
        <Container className="wf-about-work-content">
          <h2 className="wf-about-work-title">What We Do</h2>
          <div className="wf-about-work-grid">
            {workAreas.map(({ title, description, image, alt, href, icon: Icon }) => {
              const cardContent = (
                <>
                  <div className="wf-about-work-image">
                    <Img src={image} alt={alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="wf-about-work-card-copy">
                    <Icon className="wf-about-work-icon" aria-hidden="true" />
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                </>
              );

              return href ? (
                <Link className="wf-about-work-card wf-about-work-link" href={href} key={title}>
                  {cardContent}
                </Link>
              ) : (
                <button
                  type="button"
                  className="wf-about-work-card wf-about-work-button"
                  key={title}
                  aria-haspopup="dialog"
                  onClick={() => setFurnitureDialogOpen(true)}
                >
                  {cardContent}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {furnitureDialogOpen && <FurnitureDialog onClose={() => setFurnitureDialogOpen(false)} />}

      <section className="wf-section wf-about-philosophy">
        <Container className="wf-about-philosophy-content">
          <h2>Our Philosophy</h2>
          <div className="wf-about-philosophy-grid">
            {philosophy.map(({ title, description, icon: Icon }) => (
              <article className="wf-about-philosophy-item" key={title}>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="wf-section wf-about-connections">
        <Container className="wf-about-connections-content">
          <div className="wf-about-connections-copy">
            <h2>Our Industry Connections</h2>
            <p>Meeting wine lovers, businesses and partners through events, exhibitions and industry collaborations.</p>
          </div>
          <AboutConnectionsGallery />
        </Container>
      </section>
    </>
  );
}

function AboutConnectionsGallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const dragRef = useRef({ active: false, pointerId: -1, startX: 0, trackX: 0 });
  const hoverRef = useRef(false);

  useGSAP(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!viewport || !track || !group) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let distance = 0;

    const measure = () => {
      const columns = window.matchMedia("(max-width: 639px)").matches ? 2 : 4;
      const gap = Number.parseFloat(getComputedStyle(group).columnGap) || 0;
      const photoWidth = (viewport.clientWidth - gap * (columns - 1)) / columns;
      track.querySelectorAll<HTMLElement>(".wf-about-connection-photo").forEach((photo) => {
        photo.style.flexBasis = `${photoWidth}px`;
      });
    };

    const startLoop = (from = 0) => {
      tweenRef.current?.kill();
      measure();
      distance = group.getBoundingClientRect().width;
      if (!distance) return;
      const normalized = ((from % distance) + distance) % distance;
      gsap.set(track, { x: -normalized });
      if (reducedMotion.matches) return;
      tweenRef.current = gsap.to(track, {
        x: -normalized - distance,
        duration: distance / CONNECTION_SCROLL_SPEED,
        ease: "none",
        repeat: -1,
      });
      if (hoverRef.current) tweenRef.current.pause();
    };

    if (!reducedMotion.matches) {
      const photos = gsap.utils.toArray<HTMLElement>(".wf-about-connection-photo", viewport);
      gsap.fromTo(photos,
        { autoAlpha: 0, y: 22, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: { trigger: viewport, start: "top 82%", once: true },
        },
      );
    }

    startLoop();
    const observer = new ResizeObserver(() => {
      const currentX = Number(gsap.getProperty(track, "x")) || 0;
      const progress = distance ? Math.abs(currentX) / distance : 0;
      startLoop(progress * group.getBoundingClientRect().width);
    });
    observer.observe(viewport);

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
  }, { scope: viewportRef });

  const pause = () => {
    hoverRef.current = true;
    tweenRef.current?.pause();
  };

  const resume = () => {
    hoverRef.current = false;
    if (!dragRef.current.active && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) tweenRef.current?.play();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
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

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || !track || !group) return;
    const distance = group.getBoundingClientRect().width;
    if (!distance) return;
    const moved = drag.trackX + event.clientX - drag.startX;
    const wrappedDistance = ((moved % distance) + distance) % distance;
    gsap.set(track, { x: wrappedDistance === 0 ? 0 : wrappedDistance - distance });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.active = false;
    if (!hoverRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const track = trackRef.current;
      const group = groupRef.current;
      if (track && group) {
        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        const distance = group.getBoundingClientRect().width;
        if (distance) {
          tweenRef.current?.kill();
          tweenRef.current = gsap.to(track, { x: currentX - distance, duration: distance / CONNECTION_SCROLL_SPEED, ease: "none", repeat: -1 });
        }
      }
    }
  };

  const renderPhotos = (duplicate = false) => connectionImages.map(({ src, alt }) => (
    <figure className="wf-about-connection-photo" key={`${duplicate ? "copy-" : ""}${src}`}>
      <Img src={src} alt={duplicate ? "" : alt} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 18vw" className="object-cover" />
    </figure>
  ));

  return (
    <div
      ref={viewportRef}
      className="wf-about-connections-grid"
      role="region"
      aria-label="Wine Friend industry photos"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") pause(); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") resume(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={trackRef} className="wf-about-connections-track">
        <div ref={groupRef} className="wf-about-connections-group">{renderPhotos()}</div>
        <div className="wf-about-connections-group" aria-hidden="true">{renderPhotos(true)}</div>
      </div>
    </div>
  );
}

function FurnitureDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    const html = document.documentElement;
    const previous = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previous.html;
      document.body.style.overflow = previous.body;
    };
  }, []);

  const title = "Wine Furniture & Custom Products";
  const image = "/images/serving/Rustic Barrel Wine Tasting Table.png";
  const headingId = "wine-furniture-dialog-title";

  return (
    <dialog
      ref={dialogRef}
      className="wf-dialog"
      aria-labelledby={headingId}
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button type="button" className="wf-dialog-close" onClick={onClose} aria-label="Close wine furniture details">
        <X aria-hidden="true" />
      </button>
      <div className="wf-dialog-body" data-lenis-prevent>
        <ProductGallery images={[image]} name={title} imageFit="contain" sizes="(max-width: 767px) 100vw, 560px" />
        <div className="wf-dialog-copy" tabIndex={0} aria-label="Wine furniture details">
          <div className="wf-product-details">
            <p className="wf-collection-kicker">Wine Furniture</p>
            <h2 id={headingId} className="wf-product-details-title">{title}</h2>
            <p className="wf-product-details-copy">
              Barrel furniture, wine racks and custom pieces made to suit your space and requirements.
            </p>
            <h3 className="wf-product-details-subtitle">Made for your space</h3>
            <ul className="wf-product-features">
              <li>Wine barrel tables and furniture</li>
              <li>Custom wine racks and storage</li>
              <li>Made to your preferred specifications</li>
            </ul>
          </div>
        </div>
      </div>
    </dialog>
  );
}
