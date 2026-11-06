import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { AboutSection } from "@/components/sections/AboutSection";
import { aboutContent } from "@/data/about";

export const metadata: Metadata = {
  title: "About WineFriend | Kamaltara Enterprises",
  description: "Learn about WineFriend, a registered trademark of Nashik-based Kamaltara Enterprises, owned and operated by Manoj Jagtap.",
};

export default function AboutPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="About WineFriend" title={aboutContent.heading} description="Wine Friend is a registered trademark of Kamaltara Enterprises, based in Nashik, Maharashtra, and owned and operated by Manoj Jagtap." image="/images/about/wine-cellar.webp" imageAlt="Wine cellar lined with bottles" />
      <AboutSection />
    </PageFrame>
  );
}
