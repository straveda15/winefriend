"use client";

import { ArrowRight, Images, MessageCircle } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { formatPrice } from "@winefriend/shared/constants";
import { productEnquiryMessage } from "@/lib/contact";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ProductShareButton } from "@/components/ui/ProductShareButton";
import type { Product } from "@winefriend/shared/types";

interface ProductCardProps {
  product: Product;
  index: number;
  onOpen: (product: Product) => void;
  rotateImages?: boolean;
}

export function ProductCard({ product, index, onOpen, rotateImages = false }: ProductCardProps) {
  return (
    <article className="wf-product-card group rounded-none overflow-hidden">
      <button type="button" className="wf-product-open" onClick={() => onOpen(product)} aria-haspopup="dialog">
        <div className="wf-product-image-frame relative aspect-[4/3] overflow-hidden bg-card">
          {rotateImages && product.images.length > 1 ? (
            <div
              className="wf-product-image-track"
              aria-hidden="true"
              style={{
                width: `${product.images.length * 200}%`,
                animationDuration: `${product.images.length * 8}s`,
              }}
            >
              {[...product.images, ...product.images].map((src, imageIndex) => (
                <div
                  key={`${imageIndex}-${src}`}
                  className="wf-product-image-slide"
                  style={{ flexBasis: `${100 / (product.images.length * 2)}%` }}
                >
                  <Img
                    src={src}
                    alt=""
                    fill
                    className="wf-product-image object-cover"
                    sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    priority={index <= 2 && imageIndex === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Img
              src={product.images[0]}
              alt={product.name}
              fill
              className="wf-product-image object-cover"
              sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
              priority={index <= 2}
            />
          )}
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
      <ProductShareButton name={product.name} slug={product.slug} className="wf-product-share-card" />
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
