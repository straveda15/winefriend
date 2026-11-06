import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { JournalListing } from "@/components/sections/JournalListing";

export const metadata: Metadata = {
  title: "Wine Journal | WineFriend",
  description: "Stories about Nashik winery visits, grape harvesting, Indian wine experiences, and wine events from WineFriend.",
};

export default function JournalPage() {
  return (
    <PageFrame>
      <EditorialPageHero kicker="Wine Journal" title="Stories from the World of Wine" description="Stories from Manoj Jagtap and the Wine Friend team, including Nashik winery visits, grape harvesting, and wine events." image="/images/journal/indian-wine-experience.webp" imageAlt="An Indian wine experience" />
      <JournalListing />
    </PageFrame>
  );
}
