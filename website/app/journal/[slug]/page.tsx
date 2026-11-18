import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/animations/FadeUp";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { PostContent } from "@/components/blog/PostContent";
import { Button } from "@/components/ui/Button";
import { JournalImage } from "@/components/ui/JournalImage";
import { formatDate } from "@winefriend/shared/constants";
import { getPost, getPosts } from "@/lib/content";

type ArticlePageProps = { params: Promise<{ slug: string }> };
const BUILD_PLACEHOLDER_SLUG = "__build_placeholder__";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length > 0
    ? posts.map(({ slug }) => ({ slug }))
    : [{ slug: BUILD_PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === BUILD_PLACEHOLDER_SLUG) return { title: "Wine Journal | WineFriend" };
  const article = await getPost(slug);
  if (!article) return { title: "Wine Journal | WineFriend" };
  return {
    title: `${article.title} | WineFriend Journal`,
    description: article.excerpt,
    openGraph: { images: [{ url: article.image ?? article.images?.[0] ?? "/images/journal/indian-wine-experience.webp" }] },
  };
}

export default function JournalArticlePage({ params }: ArticlePageProps) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="wf-section wf-detail-page bg-ivory py-14 lg:py-22" aria-busy="true" />}>
        <JournalArticleContent params={params} />
      </Suspense>
      <Footer />
    </>
  );
}

async function JournalArticleContent({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (slug === BUILD_PLACEHOLDER_SLUG) notFound();
  const article = await getPost(slug);
  if (!article) notFound();
  const articleImages = article.images?.length ? article.images : article.image ? [article.image] : [];
  const coverImage = articleImages[0];
  const additionalImages = articleImages.slice(1);
  const articleContent = article.content.trim() !== article.excerpt.trim() ? article.content : "";

  return (
    <main className="wf-section wf-detail-page wf-journal-detail-page bg-ivory">
      <Container className="wf-journal-article-shell max-w-6xl">
        <Link href="/journal" className="wf-product-link">&larr; Back to the Wine Journal</Link>

        <header className="wf-journal-article-heading">
          <FadeUp>
            <p className="wf-journal-article-meta">
              <span>{article.category}</span>
              <span aria-hidden="true">&bull;</span>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </p>
            <h1 className="wf-journal-article-title">{article.title}</h1>
            {article.excerpt && <p className="wf-journal-article-subtitle">{article.excerpt}</p>}
          </FadeUp>
        </header>

        {coverImage && (
          <ImageReveal direction="left" className="wf-journal-cover-frame">
            <JournalImage
              src={coverImage}
              alt={article.title}
              fill
              preload
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 92vw, 1152px"
              className="object-cover"
            />
          </ImageReveal>
        )}

        <FadeUp>
          {(articleContent || additionalImages.length > 0) && (
            <PostContent content={articleContent} images={additionalImages} title={article.title} />
          )}
        </FadeUp>

        <div className="wf-journal-article-actions">
          <Button href="/contact">Get in touch</Button>
          <Link href="/journal" className="wf-product-link">More stories</Link>
        </div>
      </Container>
    </main>
  );
}
