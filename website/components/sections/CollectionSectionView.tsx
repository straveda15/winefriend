"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { Wine } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductDialog } from "@/components/products/ProductDialog";
import { PRODUCT_CATEGORIES } from "@winefriend/shared/constants";
import type { Product } from "@winefriend/shared/types";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";

gsap.registerPlugin(ScrollTrigger, useGSAP);


type LoadState = "loading" | "error";

export function CollectionSectionView({
  products,
  preview = false,
  loadState,
  skeletonCount = 6,
}: {
  products: Product[];
  preview?: boolean;
  loadState?: LoadState;
  skeletonCount?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string>("all");
  const [active, setActive] = useState<Product | null>(null);

  const categories = PRODUCT_CATEGORIES.filter((item) => products.some((product) => product.category === item.id));
  const visibleProducts = preview || category === "all" ? products : products.filter((product) => product.category === category);

  // Header links such as /products#storage pre-select a category.
  useEffect(() => {
    if (preview) return;
    const sync = () => {
      const id = window.location.hash.slice(1);
      if (categories.some((item) => item.id === id)) setCategory(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const headingParts = headingRef.current?.querySelectorAll<HTMLElement>(
        ".wf-collection-kicker, .wf-collection-title, .wf-collection-description",
      );
      const cards = gsap.utils.toArray<HTMLElement>(".wf-product-card", section);
      const imageFrames = gsap.utils.toArray<HTMLElement>(".wf-product-image-frame", section);
      const images = gsap.utils.toArray<HTMLElement>(".wf-product-image", section);
      if (!cards.length && !headingParts?.length) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (headingParts?.length) {
        timeline.fromTo(
          headingParts,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.1 },
          0,
        );
      }

      if (cards.length) {
        timeline.fromTo(
          cards,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.1 },
          headingParts?.length ? "-=0.2" : 0,
        );
      }

      if (imageFrames.length) {
        timeline.fromTo(
          imageFrames,
          { clipPath: "inset(0 0 100% 0 round 2px)" },
          { clipPath: "inset(0 0 0% 0 round 2px)", duration: 0.78, stagger: 0.1 },
          "-=0.38",
        );
      }

      if (images.length) {
        timeline.fromTo(
          images,
          { scale: 1.055 },
          { scale: 1, duration: 0.9, stagger: 0.1, ease: "power2.out" },
          "<",
        );
      }

      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const hoverCleanups: Array<() => void> = [];
      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>(".wf-product-image");
        if (!image) return;

        let hoverTween: gsap.core.Tween | undefined;
        const animateImage = (scale: number) => {
          hoverTween?.kill();
          hoverTween = gsap.to(image, {
            scale,
            duration: scale > 1 ? 0.38 : 0.48,
            ease: scale > 1 ? "power2.out" : "power2.inOut",
            overwrite: "auto",
          });
        };
        const onEnter = () => animateImage(1.035);
        const onLeave = () => animateImage(1);

        if (canHover) {
          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointerleave", onLeave);
        }
        card.addEventListener("focusin", onEnter);
        card.addEventListener("focusout", onLeave);

        hoverCleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
          card.removeEventListener("focusin", onEnter);
          card.removeEventListener("focusout", onLeave);
          hoverTween?.kill();
        });
      });

      return () => hoverCleanups.forEach((cleanup) => cleanup());

    },
    { scope: sectionRef },
  );

  return (
    <section id="products" ref={sectionRef} className="wf-section wf-collection py-14 lg:py-22 bg-cream">
      {loadState !== "loading" && <GrapevineDecoration className="wf-vine wf-vine--bottom-left" />}
      <Container className="wf-botanical-content">
        <div ref={headingRef} className="wf-collection-header">
          <div>
            <p className="wf-collection-kicker">EXPLORE THE COLLECTION</p>
            <h2 className="wf-collection-title">Discover Our Wine Essentials</h2>
          </div>
          <p className="wf-collection-description">
            {preview
              ? "Wine openers and corks, glassware, decanters, preservation systems, wine racks, barrel furniture, and promotional materials."
              : "Browse the Wine Friend range of accessories, storage and bar furniture. Open any product to see its photographs, details and price, and enquire directly on WhatsApp."}
          </p>
        </div>
        {!preview && categories.length > 1 && (
          <nav className="wf-product-category-nav" aria-label="Product categories">
            <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>All Products</button>
            {categories.map((item) => (
              <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
        )}
        <div className="wf-collection-grid grid mt-10">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index + 1} onOpen={setActive} />
          ))}
          {loadState === "loading" && Array.from({ length: skeletonCount }, (_, index) => (
            <article key={`product-skeleton-${index}`} className="wf-product-card wf-product-skeleton" aria-hidden="true">
              <div className="wf-product-image-frame relative aspect-[4/3] overflow-hidden bg-card" />
              <div className="wf-product-card-copy">
                <span className="wf-skeleton-line wf-skeleton-title" />
                <span className="wf-skeleton-line wf-skeleton-description" />
                <span className="wf-skeleton-line wf-skeleton-description wf-skeleton-description-short" />
              </div>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 && (
          preview && loadState !== "error" ? (
            <p className="mt-10 text-center text-charcoal-light">Products will appear here soon.</p>
          ) : (
            <div
              role={loadState === "error" ? "alert" : "status"}
              aria-live={loadState === "error" ? "assertive" : "polite"}
              className="mt-6 flex min-h-40 items-center justify-center px-6 py-6 text-center"
            >
              <div className="flex max-w-3xl flex-col items-center gap-4 sm:flex-row">
                <Wine aria-hidden="true" className="h-14 w-14 flex-none text-gold sm:h-16 sm:w-16" strokeWidth={1.4} />
                <p className="font-sans text-base font-normal leading-relaxed text-charcoal-light sm:text-lg">
                  {loadState === "loading"
                    ? "Loading products…"
                    : loadState === "error"
                      ? "We couldn’t load the product catalogue. Please try again shortly."
                      : "No products are currently available. Please check back soon."}
                </p>
              </div>
            </div>
          )
        )}
        {active && <ProductDialog product={active} onClose={() => setActive(null)} />}
        {preview && (
          <div className="mt-8 text-center">
            <Link href="/products" className="wf-product-link">View all products <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </Container>
    </section>
  );
}
