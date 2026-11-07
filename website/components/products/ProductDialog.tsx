"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductGallery } from "@/components/products/ProductGallery";
import type { Product } from "@winefriend/shared/types";

export function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // Lock the page behind the dialog. Both <html> and <body> are locked because the smooth-scroll
    // library scrolls <html>.
    const html = document.documentElement;
    const previous = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // Wheel / touch movement on the dimmed backdrop (which targets the <dialog> itself) must not reach the page.
    const blockBackdropScroll = (event: Event) => {
      if (event.target === dialog) event.preventDefault();
    };
    dialog.addEventListener("wheel", blockBackdropScroll, { passive: false });
    dialog.addEventListener("touchmove", blockBackdropScroll, { passive: false });
    return () => {
      // The element is removed on unmount, which also takes it out of the top layer.
      html.style.overflow = previous.html;
      document.body.style.overflow = previous.body;
    };
  }, []);

  const headingId = `product-dialog-${product.id}`;

  return (
    <dialog
      ref={ref}
      className="wf-dialog"
      aria-labelledby={headingId}
      data-lenis-prevent
      onClose={(event) => {
        // Esc closes the native dialog; ignore stray close events while it is open again.
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button type="button" className="wf-dialog-close" onClick={onClose} aria-label="Close product details">
        <X aria-hidden="true" />
      </button>
      <div className="wf-dialog-body" data-lenis-prevent>
        <ProductGallery images={product.images} name={product.name} imageFit="contain" priority sizes="(max-width: 767px) 100vw, 560px" />
        <div className="wf-dialog-copy" tabIndex={0} aria-label="Product details">
          <ProductDetails product={product} headingId={headingId} onNavigate={onClose} />
        </div>
      </div>
    </dialog>
  );
}
