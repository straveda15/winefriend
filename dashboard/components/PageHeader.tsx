import type { ReactNode } from "react";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-light">{description}</p>}
      </div>
      {action}
    </header>
  );
}

const messages: Record<string, string> = {
  created: "Saved — it is now live on the website (if set to visible).",
  updated: "Changes saved.",
  deleted: "Deleted.",
};

export function SavedNotice({ code }: { code?: string }) {
  if (!code || !messages[code]) return null;
  return (
    <p role="status" className="mb-6 rounded-lg border border-[#1f8f4e]/30 bg-[#1f8f4e]/10 px-4 py-3 text-sm text-[#17703d]">
      {messages[code]}
    </p>
  );
}
