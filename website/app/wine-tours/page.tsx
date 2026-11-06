import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { ToursSection } from "@/components/sections/ToursSection";

export const metadata: Metadata = {
  title: "Nashik Wine Tours & Experiences | WineFriend",
  description: "Explore curated Nashik Valley winery visits and personalised small-group wine tourism experiences.",
};

export default function WineToursPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="Wine Tours & Experiences" title="Discover Nashik Through Wine" description="Curated winery visits and personalised wine tours invite guests to explore the vineyards and wine culture of Nashik Valley." image="/images/experiences/vineyard-landscape.webp" imageAlt="Vineyard rows in the Nashik landscape" />
      <ToursSection />
    </PageFrame>
  );
}
