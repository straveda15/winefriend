import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Business Solutions | WineFriend",
  description: "Wine products and customisation for wineries, wine producers, hotels, restaurants, hospitality, corporate gifting, and bulk supply enquiries.",
};

const services = ["Wineries and wine producers", "Hotels and restaurants", "Hospitality businesses", "Corporate gifting", "Customised products", "Bulk supply enquiries"];

export default function BusinessSolutionsPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="Business Solutions" title="Wine solutions, made personal." description="Kamaltara Enterprises manufactures and imports wine-related products, with customisation tailored to client specifications and current market trends." image="/images/categories/business-wine-gifting.webp" imageAlt="Wine gifts and accessories for business" />
      <BusinessSection />
      <section className="wf-section py-14 lg:py-20 bg-cream">
        <Container>
          <FadeUp><p className="wf-collection-kicker">For your business</p><h2 className="wf-collection-title mb-8">Products and supply for wine-led occasions</h2></FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => <FadeUp key={service} delay={index * .06}><div className="wf-about-pillar p-6"><h3 className="wf-product-title">{service}</h3></div></FadeUp>)}
          </div>
          <div className="mt-8"><Button href="/contact">Enquire About Business Solutions</Button></div>
        </Container>
      </section>
    </PageFrame>
  );
}
