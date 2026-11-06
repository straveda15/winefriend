"use client";

import { ArrowRight, Images, MessageCircle } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { formatPrice } from "@winefriend/shared/constants";
import { productEnquiryMessage } from "@/lib/contact";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import type { Product } from "@winefriend/shared/types";

interface ProductCardProps {
  product: Product;
  index: number;
  onOpen: (product: Product) => void;
}

export function ProductCard({ product, index, onOpen }: ProductCardProps) {
  return (
    <article className="wf-product-card group rounded-none overflow-hidden">
      <button type="button" className="wf-product-open" onClick={() => onOpen(product)} aria-haspopup="dialog">
        <div className="wf-product-image-frame relative aspect-[4/3] overflow-hidden bg-card">
          <Img
            src={product.images[0]}
            alt={product.name}
            fill
            className="wf-product-image object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
          <div className="wf-product-image-wash absolute inset-0" />
          <span className="wf-product-index">{String(index).padStart(2, "0")}</span>
          {product.images.length > 1 && (
            <span className="wf-product-photos">
              <Images aria-hidden="true" /> {product.images.length}
            </span>
          )}
        </div>
        <div className="wf-product-card-copy">
          <h3 className="wf-product-title">{product.name}</h3>
          {typeof product.price === "number" && (
            <p className="wf-product-price wf-product-price-card">
              {formatPrice(product.price)}
              {product.priceNote && <span>{product.priceNote}</span>}
            </p>
          )}
          <p className="wf-product-description">{product.shortDescription}</p>
          <span className="wf-product-link">
            View Details
            <ArrowRight aria-hidden="true" className="wf-product-arrow" />
          </span>
        </div>
      </button>
      <WhatsAppLink
        className="wf-product-cart-button"
        message={productEnquiryMessage(product.name)}
        aria-label={`Enquire about ${product.name} on WhatsApp`}
      >
        <MessageCircle aria-hidden="true" />
        Enquire on WhatsApp
      </WhatsAppLink>
    </article>
  );
}
