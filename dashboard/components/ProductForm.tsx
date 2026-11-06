"use client";

import { startTransition, useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { saveProductAction } from "@/app/actions";
import { ImageUploader } from "@/components/ImageUploader";
import { buttonGhost, buttonPrimary, card, hint, input, label } from "@/components/ui";
import { MAX_PRODUCT_IMAGES, PRODUCT_CATEGORIES } from "@winefriend/shared/constants";
import { useHydrated } from "@winefriend/shared/use-hydrated";
import type { Product } from "@winefriend/shared/types";

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProductAction, {});
  const [images, setImages] = useState<string[]>(product?.images ?? []);
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
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="grid gap-6">
        <section className={`${card} grid gap-5 p-5 sm:p-6`}>
          <h2 className="font-serif text-xl">Product details</h2>
          <div>
            <label className={label} htmlFor="name">Product name</label>
            <input id="name" name="name" required maxLength={120} defaultValue={product?.name} className={input} placeholder="e.g. Wooden Wine Rack" />
          </div>
          <div>
            <label className={label} htmlFor="shortDescription">Short description</label>
            <input id="shortDescription" name="shortDescription" required maxLength={200} defaultValue={product?.shortDescription} className={input} placeholder="One line shown on the product card" />
            <p className={hint}>Up to 200 characters. Shown on the card in the product grid.</p>
          </div>
          <div>
            <label className={label} htmlFor="description">Full description</label>
            <textarea id="description" name="description" rows={6} maxLength={4000} defaultValue={product?.description} className={input} placeholder="Shown in the product pop-up and on the product page" />
          </div>
          <div>
            <label className={label} htmlFor="features">Key details</label>
            <textarea id="features" name="features" rows={5} defaultValue={product?.features.join("\n")} className={input} placeholder={"Solid oak\nHolds 12 bottles\nCustom sizes available"} />
            <p className={hint}>One detail per line (up to 12). Shown as a bullet list.</p>
          </div>
        </section>

        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="font-serif text-xl">Images</h2>
          <p className={`${hint} mb-4`}>The first image is the cover shown on the product card. Use the arrows to reorder.</p>
          <ImageUploader value={images} onChange={setImages} max={MAX_PRODUCT_IMAGES} />
        </section>
      </div>

      <aside className="grid content-start gap-6">
        <section className={`${card} grid gap-5 p-5 sm:p-6`}>
          <h2 className="font-serif text-xl">Listing</h2>
          <div>
            <label className={label} htmlFor="category">Category</label>
            <select id="category" name="category" required defaultValue={product?.category ?? ""} className={input}>
              <option value="" disabled>Choose a category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="price">Price (₹)</label>
            <input id="price" name="price" inputMode="decimal" defaultValue={product?.price ?? ""} className={input} placeholder="Leave blank to hide" />
          </div>
          <div>
            <label className={label} htmlFor="priceNote">Price note</label>
            <input id="priceNote" name="priceNote" maxLength={60} defaultValue={product?.priceNote} className={input} placeholder="e.g. per piece, onwards" />
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="mt-0.5 size-4 accent-[#c69a3a]" />
            <span><strong className="font-semibold">Visible on website</strong><br /><span className="text-xs text-slate">Untick to keep it as a hidden draft.</span></span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="mt-0.5 size-4 accent-[#c69a3a]" />
            <span><strong className="font-semibold">Show on homepage</strong><br /><span className="text-xs text-slate">Featured products appear first in the homepage collection.</span></span>
          </label>
        </section>

        {state.error && (
          <p role="alert" className="rounded-lg border border-[#a33a2e]/30 bg-[#a33a2e]/8 px-4 py-3 text-sm text-[#7d2b22]">{state.error}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={pending || !ready} className={buttonPrimary}>
            <Save /> {pending ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
          <Link href="/products" className={buttonGhost}>Cancel</Link>
        </div>
      </aside>
    </form>
  );
}
