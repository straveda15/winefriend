"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/animations/FadeUp";
import { JournalListingCard } from "@/components/ui/JournalListingCard";
import { BLOG_CATEGORIES } from "@winefriend/shared/constants";
import type { JournalArticle } from "@winefriend/shared/types";

const ALL = "All stories";

export function JournalListingView({ articles }: { articles: JournalArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const categories = [ALL, ...BLOG_CATEGORIES.filter((category) => articles.some((article) => article.category === category))];
  const filteredArticles =
    activeCategory === ALL
      ? [...articles.filter((article) => article.featured), ...articles.filter((article) => !article.featured)]
      : articles.filter((article) => article.category === activeCategory);

  return (
    <section className="wf-section wf-journal py-12 lg:py-18 bg-cream">
      <Container>
        {articles.length === 0 && <p className="text-charcoal-light">New stories are on their way.</p>}
        <nav className="wf-journal-filters" aria-label="Filter journal stories">
          {categories.map((category) => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </nav>
        {filteredArticles.length > 0 && (
          <div className="wf-jgrid">
            {filteredArticles.map((article, index) => (
              <FadeUp key={article.id} delay={Math.min(index * .06, .24)} className={article.featured && activeCategory === ALL ? "wf-jgrid-featured" : undefined}>
                <JournalListingCard article={article} featured={article.featured && activeCategory === ALL} />
              </FadeUp>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
