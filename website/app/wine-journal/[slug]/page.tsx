import { Suspense } from "react";
import { redirect } from "next/navigation";

type LegacyJournalProps = { params: Promise<{ slug: string }> };

export default function LegacyJournalArticlePage({ params }: LegacyJournalProps) {
  return (
    <Suspense fallback={null}>
      <LegacyJournalRedirect params={params} />
    </Suspense>
  );
}

async function LegacyJournalRedirect({ params }: LegacyJournalProps) {
  const { slug } = await params;
  return redirect(`/journal/${slug}`);
}
