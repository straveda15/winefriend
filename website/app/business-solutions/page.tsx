import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { BusinessSection } from "@/components/sections/BusinessSection";

export const metadata: Metadata = {
  title: "Business Solutions | WineFriend",
  description: "Wine products and customisation for wineries, wine producers, hotels, restaurants, hospitality, corporate gifting, and bulk supply enquiries.",
};

export default function BusinessSolutionsPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="Business Solutions" title="Wine solutions, made personal." description="Kamaltara Enterprises manufactures and imports wine-related products, with customisation tailored to client specifications and current market trends." image="/images/categories/business-wine-gifting.webp" imageAlt="Wine gifts and accessories for business" />
      <BusinessSection />
    </PageFrame>
  );
}
