"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@winefriend/shared/types";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Link
      href={category.ctaHref}
      className="wf-discover-item group block"
    >
      <div className="wf-discover-image-reveal">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="wf-discover-image object-cover transition-transform duration-700 group-hover:scale-[1.025]"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
      </div>
      <div className="wf-discover-item-copy">
        <div className="wf-discover-item-meta" aria-hidden="true">
          <span className="wf-discover-item-number">{String(index).padStart(2, "0")}</span>
          <span className="wf-discover-item-rule" />
        </div>
        <h3 className="wf-discover-item-title">
          {category.title}
        </h3>
        <p className="wf-discover-item-description">
          {category.description}
        </p>
        <span className="wf-discover-item-cta">
          {category.ctaText}
          <ArrowRight aria-hidden="true" className="wf-discover-item-arrow" />
        </span>
      </div>
    </Link>
  );
}
