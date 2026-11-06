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
import { Img } from "@/components/ui/Img";
import { formatDate } from "@winefriend/shared/constants";
import { getPost, getPosts } from "@/lib/content";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPost(slug);
  if (!article) return { title: "Wine Journal | WineFriend" };
  return {
    title: `${article.title} | WineFriend Journal`,
    description: article.excerpt,
    openGraph: { images: [{ url: article.image }] },
  };
}

export default function JournalArticlePage({ params }: ArticlePageProps) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="wf-section wf-detail-page bg-ivory py-16 lg:py-24" aria-busy="true" />}>
        <JournalArticleContent params={params} />
      </Suspense>
      <Footer />
    </>
  );
}

async function JournalArticleContent({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPost(slug);
  if (!article) notFound();

  return (
    <main className="wf-section wf-detail-page bg-ivory py-16 lg:py-24">
      <Container className="max-w-5xl">
        <Link href="/journal" className="wf-product-link">← Back to the Wine Journal</Link>
        <FadeUp>
          <p className="wf-collection-kicker mt-8">{article.category} · {formatDate(article.date)}</p>
          <h1 className="wf-page-title max-w-4xl">{article.title}</h1>
        </FadeUp>
        <ImageReveal direction="left" className="relative mt-8 mb-10 aspect-[16/9] overflow-hidden">
          <Img src={article.image} alt={article.title} fill priority sizes="(max-width: 1023px) 100vw, 80vw" className="object-cover" />
        </ImageReveal>
        <FadeUp>
          <p className="wf-page-lede max-w-3xl font-medium">{article.excerpt}</p>
          {article.content.trim() !== article.excerpt.trim() && <PostContent content={article.content} />}
        </FadeUp>
        <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-gold/30 pt-8">
          <Button href="/contact">Get in touch</Button>
          <Link href="/journal" className="wf-product-link">More stories</Link>
        </div>
      </Container>
    </main>
  );
}
