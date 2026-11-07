"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Img } from "@/components/ui/Img";

interface ProductGalleryProps {
  images: string[];
  name: string;
  imageFit?: "contain" | "cover";
  priority?: boolean;
  sizes?: string;
}

export function ProductGallery({ images, name, imageFit = "cover", priority = false, sizes = "(max-width: 1023px) 100vw, 50vw" }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = Math.min(index, count - 1);
  const go = (delta: number) => setIndex((current + delta + count) % count);

  return (
    <div className="wf-gallery" role="group" aria-roledescription="carousel" aria-label={`${name} images`}>
      <div className="wf-gallery-stage">
        {images.map((src, i) => (
          <Img
            key={src}
            src={src}
            alt={i === current ? `${name} — image ${i + 1} of ${count}` : ""}
            fill
            priority={priority && i === 0}
            sizes={sizes}

            className={`object-${imageFit} wf-gallery-slide ${i === current ? "is-active" : ""}`}

            className={`object-contain wf-gallery-slide ${i === current ? "is-active" : ""}`}

            aria-hidden={i === current ? undefined : true}
          />
        ))}
        {count > 1 && (
          <>
            <button type="button" className="wf-gallery-arrow wf-gallery-prev" onClick={() => go(-1)} aria-label="Previous image">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="wf-gallery-arrow wf-gallery-next" onClick={() => go(1)} aria-label="Next image">
              <ChevronRight aria-hidden="true" />
            </button>
            <span className="wf-gallery-count" aria-live="polite">{current + 1} / {count}</span>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="wf-gallery-thumbs">
          {images.map((src, i) => (
            <li key={src}>
              <button type="button" onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}`} aria-current={i === current}>
                <Img src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
