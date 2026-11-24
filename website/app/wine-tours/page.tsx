import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { ToursSection } from "@/components/sections/ToursSection";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Nashik Wine Tours & Experiences | WineFriend",
  description: "Explore curated Nashik Valley winery visits and personalised small-group wine tourism experiences.",
};

export default function WineToursPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="Wine Tours & Experiences" title="Discover Nashik Through Wine" description="Curated winery visits and personalised wine tours invite guests to explore the vineyards and wine culture of Nashik Valley." image="/images/experiences/winetours1.jpg" imageAlt="A curated wine tour experience in Nashik" />
      <ToursSection />
      <section className="wf-section bg-ivory py-12 lg:py-18" aria-labelledby="wine-tour-video-title">
        <Container>
          <div className="mx-auto max-w-7xl">
            <h2 id="wine-tour-video-title" className="wf-display-heading mb-7 text-center font-serif text-3xl font-normal leading-[1.05] text-charcoal sm:text-4xl lg:text-6xl">
              Experience Nashik Through Wine
            </h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gold/20 bg-charcoal shadow-xl">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/82xNrct6-cI?si=uTc0A8e1LwHnM_66"
                title="Wine tours and experiences in Nashik"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>
    </PageFrame>
  );
}
