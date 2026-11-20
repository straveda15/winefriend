import type { Metadata } from "next";
import { AboutHero } from "@/components/layout/AboutHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { AboutFounderJourney } from "@/components/sections/AboutFounderJourney";
import { AboutWorkAndConnections } from "@/components/sections/AboutWorkAndConnections";

export const metadata: Metadata = {
  title: "About WineFriend | Kamaltara Enterprises",
  description: "Learn about WineFriend, a registered trademark of Nashik-based Kamaltara Enterprises, owned and operated by Manoj Jagtap.",
};

export default function AboutPage() {
  return (
    <PageFrame>
      <AboutHero />
      <AboutFounderJourney />
      <AboutWorkAndConnections />
    </PageFrame>
  );
}
