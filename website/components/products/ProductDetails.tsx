import Link from "next/link";
import { MessageCircle, Phone, Send } from "lucide-react";
import { categoryLabel, formatPrice } from "@winefriend/shared/constants";
import { productEnquiryMessage, telHref } from "@/lib/contact";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import type { Product } from "@winefriend/shared/types";

interface ProductDetailsProps {
  product: Product;
  /** Heading level differs between the dialog (h2) and the full page (h1). */
  as?: "h1" | "h2";
  headingId?: string;
  onNavigate?: () => void;
}

/** Text side of a product: name, price, description, key details and enquiry actions. */
export function ProductDetails({ product, as: Heading = "h2", headingId, onNavigate }: ProductDetailsProps) {
  return (
    <div className="wf-product-details">
      <p className="wf-collection-kicker">{categoryLabel(product.category)}</p>
      <Heading id={headingId} className="wf-product-details-title">{product.name}</Heading>

      {typeof product.price === "number" && (
        <p className="wf-product-price">
          {formatPrice(product.price)}
          {product.priceNote && <span>{product.priceNote}</span>}
        </p>
      )}

      <p className="wf-product-details-copy">{product.description || product.shortDescription}</p>

      {product.features.length > 0 && (
        <>
          <h3 className="wf-product-details-subtitle">Key details</h3>
          <ul className="wf-product-features">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </>
      )}

      <div className="wf-product-actions">
        <WhatsAppLink className="wf-action wf-action-primary" message={productEnquiryMessage(product.name)}>
          <MessageCircle aria-hidden="true" /> Enquire on WhatsApp
        </WhatsAppLink>
        <Link className="wf-action" href={`/contact?product=${encodeURIComponent(product.name)}`} onClick={onNavigate}>
          <Send aria-hidden="true" /> Send an enquiry
        </Link>
        <a className="wf-action" href={telHref}>
          <Phone aria-hidden="true" /> Call us
        </a>
      </div>
    </div>
  );
}
