"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ProductShareButton({ name, slug, className = "" }: { name: string; slug: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function shareProduct() {
    const url = new URL(`/products/${encodeURIComponent(slug)}`, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: name, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access may be blocked by the browser or page permissions.
    }
  }

  return (
    <button
      type="button"
      className={`wf-product-share ${className}`}
      onClick={shareProduct}
      aria-label={`Share ${name}`}
      title={copied ? "Link copied" : "Share product"}
      aria-live="polite"
    >
      <Share2 aria-hidden="true" />
      {copied && <span className="wf-product-share-confirmation">Link copied</span>}
    </button>
  );
}
