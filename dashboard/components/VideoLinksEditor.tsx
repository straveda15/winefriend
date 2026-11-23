"use client";

import { useState } from "react";
import { Check, Link2, Pencil, Plus, X } from "lucide-react";
import { buttonGhost, hint, input } from "@/components/ui";

export function VideoLinksEditor({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function update(index: number, nextValue: string) {
    onChange(value.map((video, current) => current === index ? nextValue : video));
  }

  function addVideo() {
    const index = value.length;
    onChange([...value, ""]);
    setEditingIndex(index);
  }

  function removeVideo(index: number) {
    onChange(value.filter((_, current) => current !== index));
    setEditingIndex((current) => current === index ? null : current !== null && current > index ? current - 1 : current);
  }

  return (
    <div>
      <input type="hidden" name="videos" value={JSON.stringify(value.map((video) => video.trim()).filter(Boolean))} />
      {value.length > 0 && (
        <ul className="mb-4 grid gap-3">
          {value.map((video, index) => (
            <li key={`video-link-${index}`} className="grid min-w-0 gap-2 rounded-lg border border-gold/25 bg-cream/40 p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
              {editingIndex === index ? (
                <input
                  type="url"
                  value={video}
                  onChange={(event) => update(index, event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  aria-label={`YouTube video link ${index + 1}`}
                  className={`${input} min-w-0`}
                  autoFocus
                />
              ) : (
                <a href={video} target="_blank" rel="noreferrer noopener" className="flex min-w-0 items-center gap-2 break-all text-sm text-charcoal underline decoration-gold/50 underline-offset-2">
                  <Link2 className="size-4 shrink-0 text-[#8a692b]" /> {video}
                </a>
              )}
              {editingIndex === index ? (
                <button type="button" onClick={() => setEditingIndex(null)} className={buttonGhost} aria-label={`Save video link ${index + 1}`}>
                  <Check /> Save
                </button>
              ) : (
                <button type="button" onClick={() => setEditingIndex(index)} className={buttonGhost} aria-label={`Edit video link ${index + 1}`}>
                  <Pencil /> Edit
                </button>
              )}
              <button type="button" onClick={() => removeVideo(index)} className={`${buttonGhost} text-[#8c2f25]`} aria-label={`Remove video link ${index + 1}`}>
                <X /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={addVideo} className={buttonGhost}>
        <Plus /> Add YouTube video
      </button>
      <p className={hint}>Add one or more YouTube watch, Shorts, or share links. Each video can be edited or removed.</p>
    </div>
  );
}
