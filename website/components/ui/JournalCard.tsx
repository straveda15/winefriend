"use client";

import { JournalImage } from "@/components/ui/JournalImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { JournalArticle } from "@winefriend/shared/types";

interface JournalCardProps {
  article: JournalArticle;
  featured?: boolean;
}

export function JournalCard({ article, featured = false }: JournalCardProps) {
  if (featured) {
    return (
      <Link
        href={`/journal/${article.slug}`}
        className="wf-journal-card group block relative overflow-hidden rounded-2xl aspect-[3/4]"
      >
        <div className="absolute inset-0 bg-white">
          <JournalImage
            src={article.image ?? article.images?.[0]}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <h3 className="wf-jcard-title wf-jcard-title--overlay mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-white/70 text-xs mb-3 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-gold font-sans font-semibold text-[10px] uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
            Explore the Wine Journal
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/journal/${article.slug}`}
      className="wf-journal-card group flex gap-4 items-start hover:bg-cream-dark/50 rounded-xl p-2 -m-2 transition-colors duration-300"
    >
      <div className="relative w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl bg-white">
        <JournalImage
          src={article.image ?? article.images?.[0]}
          alt={article.title}
          fill
          sizes="96px"
        />
      </div>
      <div className="flex-1 py-1">
        <h4 className="wf-jcard-title mb-1.5">
          {article.title}
        </h4>
          <span className="inline-flex items-center gap-1.5 text-burgundy font-sans text-[9px] font-semibold uppercase tracking-wider">
          Read More
          <ArrowRight className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
