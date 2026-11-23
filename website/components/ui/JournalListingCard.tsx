import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JournalCardMedia } from "@/components/ui/JournalCardMedia";
import { formatDate } from "@winefriend/shared/constants";
import type { JournalArticle } from "@winefriend/shared/types";

/** Card used on the Wine Journal page: a wide "featured" layout or a standard grid card. */
export function JournalListingCard({ article, featured = false }: { article: JournalArticle; featured?: boolean }) {
  return (
    <article className={`wf-jcard wf-journal-card group${featured ? " wf-jcard--featured" : ""}`}>
      <JournalCardMedia article={article} featured={featured} />
      <Link href={`/journal/${article.slug}`} className="wf-jcard-body">
        <p className="wf-jcard-meta">
          <span>{article.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
        <h3 className="wf-jcard-title">{article.title}</h3>
        {article.excerpt && <p className="wf-jcard-excerpt">{article.excerpt}</p>}
        <span className="wf-jcard-link">
          Read more <ArrowRight aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
