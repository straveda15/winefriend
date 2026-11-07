import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { formatDate } from "@winefriend/shared/constants";
import type { JournalArticle } from "@winefriend/shared/types";

/** Card used on the Wine Journal page: a wide "featured" layout or a standard grid card. */
export function JournalListingCard({ article, featured = false }: { article: JournalArticle; featured?: boolean }) {
  return (
    <Link href={`/journal/${article.slug}`} className={`wf-jcard group${featured ? " wf-jcard--featured" : ""}`}>
      <div className="wf-jcard-media img-fallback-wine">
        <Img
          src={article.image}
          alt={article.title}
          fill
          className="object-contain"
          sizes={featured ? "(max-width: 1023px) 100vw, 60vw" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"}
        />
      </div>
      <div className="wf-jcard-body">
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
      </div>
    </Link>
  );
}
