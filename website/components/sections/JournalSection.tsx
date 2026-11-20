import { JournalSectionView } from "@/components/sections/JournalSectionView";
import { getPosts } from "@/lib/content";
import { journalPreviewFallback } from "@/data/journal";

export async function JournalSection({ preview = false }: { preview?: boolean }) {
  const articles = await getPosts();
  return <JournalSectionView articles={articles.length > 0 ? articles : journalPreviewFallback} preview={preview} />;
}
