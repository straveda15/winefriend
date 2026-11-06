import type { Metadata } from "next";
import { PageFrame } from "@/components/layout/PageFrame";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { CollectionSection } from "@/components/sections/CollectionSection";

export const metadata: Metadata = {
  title: "Wine Products & Accessories | WineFriend",
  description: "Explore wine openers, wine and champagne corks, wine glasses, preservation systems, decanters, racks, barrel furniture, and promotional materials from WineFriend.",
};

export default function ProductsPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="The art of serving well" title="Objects for the Wine Ritual" description="Explore wine openers, wine and champagne corks, glasses, preservation systems, decanters, wooden, acrylic and stainless-steel racks, barrel furniture, and promotional materials." image="/images/categories/wine-accessories-display.webp" imageAlt="Wine accessories arranged for service" />
      <CollectionSection />
    </PageFrame>
  );
}
