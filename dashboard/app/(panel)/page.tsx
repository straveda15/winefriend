import Link from "next/link";
import { ArrowRight, Newspaper, Package, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { badgeAmber, badgeGrey, buttonGhost, buttonPrimary, card } from "@/components/ui";
import { adminEnquiries, adminPosts, adminProducts } from "@/lib/admin-data";
import { PLANNED_PRODUCT_COUNT } from "@winefriend/shared/constants";

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-light">{label}</p>
      <p className="mt-2 font-serif text-4xl font-medium">{value}</p>
      <p className="mt-1 text-xs text-slate">{sub}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [products, posts, enquiries] = await Promise.all([adminProducts(), adminPosts(), adminEnquiries()]);

  const liveProducts = products.filter((item) => item.published).length;
  const livePosts = posts.filter((item) => item.published).length;
  const newEnquiries = enquiries.filter((item) => item.status === "new");
  const progress = Math.min(100, Math.round((products.length / PLANNED_PRODUCT_COUNT) * 100));

  return (
    <>
      <PageHeader title="Dashboard" description="Manage the products and blog articles that appear on the Wine Friend website, and follow up on customer enquiries." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={products.length} sub={`${liveProducts} visible on the website`} />
        <Stat label="Blog articles" value={posts.length} sub={`${livePosts} published · ${posts.length - livePosts} drafts`} />
        <Stat label="New enquiries" value={newEnquiries.length} sub="waiting for a reply" />
        <Stat label="All enquiries" value={enquiries.length} sub="received through the website" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Latest enquiries</h2>
            <Link href="/enquiries" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#805f23]">
              View all <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          {enquiries.length === 0 ? (
            <p className="mt-4 text-sm text-slate">No enquiries yet. They will appear here when customers use the contact form.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gold/20">
              {enquiries.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="truncate text-sm text-charcoal-light">{item.product ? `About: ${item.product}` : item.topic}</p>
                  </div>
                  <span className={item.status === "new" ? badgeAmber : badgeGrey}>{item.status === "new" ? "New" : "Handled"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid content-start gap-6">
          <section className={`${card} p-5 sm:p-6`}>
            <h2 className="font-serif text-xl">Catalogue</h2>
            <p className="mt-1 text-sm text-charcoal-light">{products.length} of about {PLANNED_PRODUCT_COUNT} planned products added.</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream-dark" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Catalogue progress">
              <div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className={`${card} grid gap-3 p-5 sm:p-6`}>
            <h2 className="font-serif text-xl">Quick actions</h2>
            <Link href="/products/new" className={buttonPrimary}><Plus /> Add a product</Link>
            <Link href="/blog/new" className={buttonGhost}><Newspaper /> Write a blog article</Link>
            <Link href="/products" className={buttonGhost}><Package /> Manage products</Link>
          </section>
        </div>
      </div>
    </>
  );
}
