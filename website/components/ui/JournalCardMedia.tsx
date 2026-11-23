import Link from "next/link";
import { JournalImage } from "@/components/ui/JournalImage";
import { ProductShareButton } from "@/components/ui/ProductShareButton";

export function JournalCardMedia({
  article,
  featured,
}: {
  article: { title: string; slug: string; image?: string; images?: string[] };
  featured: boolean;
}) {
  return (
    <div className="wf-jcard-media bg-white">
      <Link href={`/journal/${article.slug}`} aria-label={`Read ${article.title}`}>
        <JournalImage
          src={article.image ?? article.images?.[0]}
          fallbackSrc={article.slug === "the-bandra-wineout-2025" ? "/images/journal/bandra-wineout-2025.svg" : undefined}
          alt={article.title}
          fill
          className="object-contain"
          sizes={featured ? "(max-width: 1023px) 100vw, 60vw" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"}
          style={{ objectFit: "contain" }}
        />
      </Link>
      <ProductShareButton name={article.title} slug={article.slug} path="journal" itemType="article" className="wf-product-share-card" />
    </div>
  );
}
