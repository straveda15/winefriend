import Link from "next/link";
import { Eye, EyeOff, ImageIcon, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { deleteProductAction, toggleProductPublishedAction } from "@/app/actions";
import { ConfirmForm } from "@/components/ConfirmForm";
import { PageHeader, SavedNotice } from "@/components/PageHeader";
import { badgeAmber, badgeGreen, buttonDanger, buttonGhost, buttonPrimary, card } from "@/components/ui";
import { Img } from "@/components/Img";
import { adminProducts } from "@/lib/admin-data";
import { PLANNED_PRODUCT_COUNT, categoryLabel, formatPrice } from "@winefriend/shared/constants";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, products] = await Promise.all([searchParams, adminProducts()]);

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} of about ${PLANNED_PRODUCT_COUNT} planned products. Changes appear on the website straight away.`}
        action={<Link href="/products/new" className={buttonPrimary}><Plus /> Add product</Link>}
      />
      <SavedNotice code={saved} />

      {products.length === 0 ? (
        <div className={`${card} p-10 text-center`}>
          <p className="font-serif text-xl">No products yet</p>
          <p className="mt-2 text-sm text-slate">Add your first product to show it on the website.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {products.map((product) => (
            <li key={product.id} className={`${card} flex flex-wrap items-center gap-4 p-3 sm:p-4`}>
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-cream sm:size-24">
                <Img src={product.images[0]} alt="" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1 basis-56">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-serif text-lg">{product.name}</p>
                  <span className={product.published ? badgeGreen : badgeAmber}>{product.published ? "Visible" : "Hidden"}</span>
                  {product.featured && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#805f23]"><Star className="size-3.5 fill-current" aria-hidden="true" /> Homepage</span>}
                </div>
                <p className="mt-1 truncate text-sm text-charcoal-light">{product.shortDescription}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate">
                  <span>{categoryLabel(product.category)}</span>
                  <span>{typeof product.price === "number" ? formatPrice(product.price) : "No price shown"}</span>
                  <span className="inline-flex items-center gap-1"><ImageIcon className="size-3.5" aria-hidden="true" /> {product.images.length}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/products/${product.id}`} className={buttonGhost}><Pencil /> Edit</Link>
                <form action={toggleProductPublishedAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className={buttonGhost} aria-label={product.published ? `Hide ${product.name}` : `Show ${product.name}`}>
                    {product.published ? <EyeOff /> : <Eye />}
                    {product.published ? "Hide" : "Show"}
                  </button>
                </form>
                <ConfirmForm action={deleteProductAction} id={product.id} message={`Delete “${product.name}”? This cannot be undone.`}>
                  <button type="submit" className={buttonDanger} aria-label={`Delete ${product.name}`}><Trash2 /> Delete</button>
                </ConfirmForm>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
