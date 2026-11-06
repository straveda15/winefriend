import { JournalSectionView } from "@/components/sections/JournalSectionView";
import { getPosts } from "@/lib/content";

export async function JournalSection({ preview = false }: { preview?: boolean }) {
  const articles = await getPosts();
  if (articles.length === 0) return null;
  return <JournalSectionView articles={articles} preview={preview} />;
}
