"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductGallery } from "@/components/products/ProductGallery";
import type { Product } from "@winefriend/shared/types";

export function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      // The element is removed on unmount, which also takes it out of the top layer.
      document.body.style.overflow = previousOverflow;
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
        <ProductGallery images={product.images} name={product.name} priority sizes="(max-width: 767px) 100vw, 560px" />
        <div className="wf-dialog-copy">
          <ProductDetails product={product} headingId={headingId} onNavigate={onClose} />
          <Link href={`/products/${product.slug}`} className="wf-dialog-fullpage">
            Open full page <ExternalLink aria-hidden="true" />
          </Link>
        </div>
      </div>
    </dialog>
  );
}
