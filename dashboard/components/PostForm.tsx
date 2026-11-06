"use client";

import { startTransition, useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { savePostAction } from "@/app/actions";
import { ImageUploader } from "@/components/ImageUploader";
import { buttonGhost, buttonPrimary, card, hint, input, label } from "@/components/ui";
import { BLOG_CATEGORIES } from "@winefriend/shared/constants";
import { useHydrated } from "@winefriend/shared/use-hydrated";
import type { JournalArticle } from "@winefriend/shared/types";

export function PostForm({ post, today }: { post?: JournalArticle; today: string }) {
  const [state, action, pending] = useActionState(savePostAction, {});
  const [image, setImage] = useState<string[]>(post?.image ? [post.image] : []);
  const ready = useHydrated();

  return (
    <form
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="image" value={image[0] ?? ""} />

      <div className="grid gap-6">
        <section className={`${card} grid gap-5 p-5 sm:p-6`}>
          <h2 className="font-serif text-xl">Article</h2>
          <div>
            <label className={label} htmlFor="title">Title</label>
            <input id="title" name="title" required maxLength={150} defaultValue={post?.title} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="excerpt">Summary</label>
            <textarea id="excerpt" name="excerpt" required rows={3} maxLength={300} defaultValue={post?.excerpt} className={input} />
            <p className={hint}>Up to 300 characters. Shown on the blog listing and when the article is shared.</p>
          </div>
          <div>
            <label className={label} htmlFor="content">Content</label>
            <textarea id="content" name="content" required rows={16} maxLength={30000} defaultValue={post?.content} className={`${input} font-mono text-[13px] leading-relaxed`} />
            <p className={hint}>
              Leave a blank line between paragraphs. Use <code>## Heading</code> for a section heading, <code>- item</code> for bullet points,
              <code> **bold**</code>, <code>*italic*</code> and <code>[link text](https://…)</code>.
            </p>
          </div>
        </section>

        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="font-serif text-xl">Featured image</h2>
          <p className={`${hint} mb-4`}>Shown on the blog listing and at the top of the article.</p>
          <ImageUploader value={image} onChange={(next) => setImage(next.slice(-1))} max={1} firstLabel="Featured" />
        </section>
      </div>

      <aside className="grid content-start gap-6">
        <section className={`${card} grid gap-5 p-5 sm:p-6`}>
          <h2 className="font-serif text-xl">Publishing</h2>
          <div>
            <label className={label} htmlFor="category">Category</label>
            <select id="category" name="category" required defaultValue={post?.category ?? BLOG_CATEGORIES[0]} className={input}>
              {BLOG_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="date">Publication date</label>
            <input id="date" name="date" type="date" required defaultValue={post?.date ?? today} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="slug">Page address (optional)</label>
            <input id="slug" name="slug" defaultValue={post?.slug} className={input} placeholder="created from the title" />
            <p className={hint}>Appears as /journal/<em>address</em>.</p>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="mt-0.5 size-4 accent-[#c69a3a]" />
            <span><strong className="font-semibold">Published</strong><br /><span className="text-xs text-slate">Untick to save as a draft.</span></span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} className="mt-0.5 size-4 accent-[#c69a3a]" />
            <span><strong className="font-semibold">Feature on homepage</strong><br /><span className="text-xs text-slate">Only one article can be featured at a time.</span></span>
          </label>
        </section>

        {state.error && (
          <p role="alert" className="rounded-lg border border-[#a33a2e]/30 bg-[#a33a2e]/8 px-4 py-3 text-sm text-[#7d2b22]">{state.error}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={pending || !ready} className={buttonPrimary}>
            <Save /> {pending ? "Saving…" : post ? "Save changes" : "Publish article"}
          </button>
          <Link href="/blog" className={buttonGhost}>Cancel</Link>
        </div>
      </aside>
    </form>
  );
}
