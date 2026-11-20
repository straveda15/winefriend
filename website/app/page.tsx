import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { ToursSection } from "@/components/sections/ToursSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { HomeIntro } from "@/components/sections/HomeIntro";
import { ImageGallery } from "@/components/ui/ImageGallery";

export default function Home() {
  return (
    <>
      <HomeIntro />
      <Suspense fallback={<Header />}>
        <Header />
      </Suspense>
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <CollectionSection preview />
        </Suspense>
        <BusinessSection preview />
        <ToursSection preview />
        <ImageGallery />
        <Suspense fallback={null}>
          <JournalSection preview />
        </Suspense>
        <AboutSection preview />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
import { Suspense } from "react";
