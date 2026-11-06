"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@winefriend/shared/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.ctaHref}
      className="wf-category-card group relative block overflow-hidden rounded-none aspect-[4/5] cursor-pointer"
    >
      {/* Background Image */}
      <div className="absolute inset-0 img-fallback-wine">
        <div className="wf-category-image-reveal absolute inset-0">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="wf-category-image object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="wf-category-overlay absolute inset-0 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Decorative border */}
      <div className="absolute inset-3 border border-white/20 opacity-0 scale-[0.985] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7 lg:p-8 transition-transform duration-700 group-hover:-translate-y-1">
        <h3 className="wf-category-title font-serif text-xl sm:text-2xl font-medium text-white mb-3 italic leading-[1.12]">
          {category.title}
        </h3>
        <p className="wf-category-description font-sans text-sm leading-6 mb-5 line-clamp-3">
          {category.description}
        </p>
        <span className="wf-category-cta inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] group-hover:gap-3 transition-all duration-300">
          {category.ctaText}
          <ArrowRight className="wf-category-arrow w-3 h-3 transition-transform duration-500 ease-out group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
