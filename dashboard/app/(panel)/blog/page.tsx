import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { deletePostAction, togglePostPublishedAction } from "@/app/actions";
import { ConfirmForm } from "@/components/ConfirmForm";
import { PageHeader, SavedNotice } from "@/components/PageHeader";
import { badgeAmber, badgeGreen, buttonDanger, buttonGhost, buttonPrimary, card } from "@/components/ui";
import { Img } from "@/components/Img";
import { adminPosts } from "@/lib/admin-data";
import { formatDate } from "@winefriend/shared/constants";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, posts] = await Promise.all([searchParams, adminPosts()]);

  return (
    <>
      <PageHeader
        title="Blog"
        description="Create, edit, publish and delete the articles shown in the Wine Journal."
        action={<Link href="/blog/new" className={buttonPrimary}><Plus /> New article</Link>}
      />
      <SavedNotice code={saved} />

      {posts.length === 0 ? (
        <div className={`${card} p-10 text-center`}>
          <p className="font-serif text-xl">No articles yet</p>
          <p className="mt-2 text-sm text-slate">Write your first article to publish it on the blog.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {posts.map((post) => (
            <li key={post.id} className={`${card} flex flex-wrap items-center gap-4 p-3 sm:p-4`}>
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-cream sm:h-24 sm:w-36">
                <Img src={post.image} alt="" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1 basis-56">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-lg leading-snug">{post.title}</p>
                  <span className={post.published ? badgeGreen : badgeAmber}>{post.published ? "Published" : "Draft"}</span>
                  {post.featured && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#805f23]"><Star className="size-3.5 fill-current" aria-hidden="true" /> Homepage</span>}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-charcoal-light">{post.excerpt}</p>
                <p className="mt-1 text-xs text-slate">{post.category} · {formatDate(post.date)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/blog/${post.id}`} className={buttonGhost}><Pencil /> Edit</Link>
                <form action={togglePostPublishedAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className={buttonGhost} aria-label={post.published ? `Unpublish ${post.title}` : `Publish ${post.title}`}>
                    {post.published ? <EyeOff /> : <Eye />}
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <ConfirmForm action={deletePostAction} id={post.id} message={`Delete “${post.title}”? This cannot be undone.`}>
                  <button type="submit" className={buttonDanger} aria-label={`Delete ${post.title}`}><Trash2 /> Delete</button>
                </ConfirmForm>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
