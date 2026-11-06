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


export function CollectionSectionView({ products, preview = false }: { products: Product[]; preview?: boolean }) {
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
      if (!cards.length) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (headingParts?.length) {
        timeline.fromTo(
          headingParts,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12 },
          0,
        );
      }
      timeline.fromTo(
        cards,
        { autoAlpha: 0, y: 45 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.12 },
        "-=0.15",
      );
      imageFrames.forEach((frame, index) => {
        timeline.fromTo(
          frame,
          { clipPath: index % 2 === 0 ? "inset(100% 0 0 0)" : "inset(0 0 0 100%)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.85 },
          index === 0 ? "-=0.5" : "<0.12",
        );
      });
      timeline.fromTo(
        images,
        { scale: 1.08 },
        { scale: 1, duration: 1, stagger: 0.12 },
        "<",
      );

    },
    { scope: sectionRef },
  );

  return (
    <section id="products" ref={sectionRef} className="wf-section wf-collection py-16 lg:py-24 bg-cream">
      <GrapevineDecoration className="wf-vine wf-vine--bottom-left" />
      <Container className="wf-botanical-content">
        <div ref={headingRef} className="wf-collection-header">
          <div>
            <p className="wf-collection-kicker">The art of serving well</p>
            <h2 className="wf-collection-title">Objects for the Wine Ritual</h2>
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
        </div>
        {visibleProducts.length === 0 && (
          preview ? (
            <p className="mt-10 text-center text-charcoal-light">Products will appear here soon.</p>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 flex min-h-40 items-center justify-center px-6 py-6 text-center"
            >
              <div className="flex max-w-3xl flex-col items-center gap-4 sm:flex-row">
                <Wine aria-hidden="true" className="h-14 w-14 flex-none text-gold sm:h-16 sm:w-16" strokeWidth={1.4} />
                <p className="font-sans text-base font-normal leading-relaxed text-charcoal-light sm:text-lg">
                  Products will appear here soon.
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
