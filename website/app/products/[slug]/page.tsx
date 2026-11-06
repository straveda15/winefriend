import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { FadeUp } from "@/components/animations/FadeUp";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductGallery } from "@/components/products/ProductGallery";
import { getProduct, getProducts } from "@/lib/content";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product | WineFriend" };
  return {
    title: `${product.name} | WineFriend`,
    description: product.shortDescription,
    openGraph: { images: [{ url: product.images[0] }] },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="wf-section wf-detail-page bg-ivory py-16 lg:py-24" aria-busy="true" />}>
        <ProductDetailContent params={params} />
      </Suspense>
      <Footer />
    </>
  );
}

async function ProductDetailContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <main className="wf-section wf-detail-page bg-ivory py-16 lg:py-24">
      <Container className="max-w-[90rem]">
        <Link href="/products" className="wf-product-link">← Back to all products</Link>
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeUp>
            <ProductGallery images={product.images} name={product.name} priority />
          </FadeUp>
          <FadeUp delay={0.1}>
            <ProductDetails product={product} as="h1" />
          </FadeUp>
        </div>
      </Container>
    </main>
  );
}
