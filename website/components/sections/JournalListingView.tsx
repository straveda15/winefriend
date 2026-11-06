"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/animations/FadeUp";
import { JournalCard } from "@/components/ui/JournalCard";
import { BLOG_CATEGORIES } from "@winefriend/shared/constants";
import type { JournalArticle } from "@winefriend/shared/types";

const ALL = "All stories";

export function JournalListingView({ articles }: { articles: JournalArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const categories = [ALL, ...BLOG_CATEGORIES.filter((category) => articles.some((article) => article.category === category))];
  const filteredArticles = activeCategory === ALL ? articles : articles.filter((article) => article.category === activeCategory);

  return (
    <section className="wf-section wf-journal py-14 lg:py-20 bg-cream">
      <Container>
        {articles.length === 0 && <p className="text-charcoal-light">New stories are on their way.</p>}
        <nav className="wf-journal-filters" aria-label="Filter journal stories">
          {categories.map((category) => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {filteredArticles.map((article, index) => (
            <FadeUp key={article.id} delay={Math.min(index * .06, .24)}>
              <JournalCard article={article} featured={article.featured && activeCategory === ALL} />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
