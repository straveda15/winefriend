import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/layout/PageFrame";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { CollectionSectionView } from "@/components/sections/CollectionSectionView";
import { TextReveal } from "@/components/animations/TextReveal";
import { Container } from "@/components/layout/Container";
import { BusinessServicesGrid } from "@/components/products/BusinessServicesGrid";

export const metadata: Metadata = {
  title: "Wine Products & Accessories | WineFriend",
  description: "Explore wine openers, wine and champagne corks, wine glasses, preservation systems, decanters, racks, barrel furniture, and promotional materials from WineFriend.",
};

export default function ProductsPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="The art of serving well" title="Objects for the Wine Ritual" description="Explore wine openers, wine and champagne corks, glasses, preservation systems, decanters, wooden, acrylic and stainless-steel racks, barrel furniture, and promotional materials." image="/images/categories/wine-accessories-display.webp" imageAlt="Wine accessories arranged for service" />
      <Suspense fallback={<CollectionSectionView products={[]} loadState="loading" />}>
        <CollectionSection />
      </Suspense>
      <section className="wf-section bg-ivory py-14 lg:py-20">
        <Container>
          <div className="mb-8">
            <TextReveal>
              <p className="wf-collection-kicker">For your business</p>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 className="wf-collection-title">Products and supply for wine-led occasions</h2>
            </TextReveal>
          </div>
          <BusinessServicesGrid />
        </Container>
      </section>
    </PageFrame>
  );
}
