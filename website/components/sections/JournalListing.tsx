import { JournalListingView } from "@/components/sections/JournalListingView";
import { getPosts } from "@/lib/content";

export async function JournalListing() {
  const articles = await getPosts();
  return <JournalListingView articles={articles} />;
}
