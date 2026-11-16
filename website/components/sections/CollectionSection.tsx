import { CollectionSectionView } from "@/components/sections/CollectionSectionView";
import { getProductsForHome, getProductsOrThrow } from "@/lib/content";
import { unstable_rethrow } from "next/navigation";
import type { Product } from "@winefriend/shared/types";

// Keep the home page useful when the catalogue API is temporarily unavailable.
// These evergreen entries use the product photography already bundled with the site.
const HOME_PRODUCT_FALLBACKS: Product[] = [
  {
    id: "home-fallback-wine-opener",
    name: "Wine Opener",
    slug: "wine-opener",
    category: "accessories",
    shortDescription: "A considered essential for opening and serving wine.",
    description: "Explore wine openers and serving essentials from Kamaltara Enterprises.",
    images: ["/images/serving/corkscrew.png"],
    features: [],
    featured: true,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "home-fallback-decanter",
    name: "Wine Decanter",
    slug: "wine-decanter",
    category: "accessories",
    shortDescription: "Serve wine with glassware made for the table.",
    description: "Explore decanters and wine serving pieces from Kamaltara Enterprises.",
    images: ["/images/serving/Decane.png"],
    features: [],
    featured: true,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "home-fallback-wine-rack",
    name: "Wine Bottle Rack",
    slug: "wine-bottle-rack",
    category: "storage",
    shortDescription: "Thoughtful storage for a well-appointed wine space.",
    description: "Explore wine storage and display options from Kamaltara Enterprises.",
    images: ["/images/serving/bottlerack.png"],
    features: [],
    featured: true,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
];

export async function CollectionSection({ preview = false }: { preview?: boolean }) {
  if (preview) {
    try {
      const products = await getProductsForHome(3);
      const homeProducts = products.length >= 3 ? products : [...products, ...HOME_PRODUCT_FALLBACKS]
        .filter((product, index, all) => all.findIndex((candidate) => candidate.id === product.id) === index)
        .slice(0, 3);
      return <CollectionSectionView products={homeProducts} preview />;
    } catch (error) {
      unstable_rethrow(error);
      console.error("[website] Could not load featured products for the home page.", error);
      return <CollectionSectionView products={HOME_PRODUCT_FALLBACKS} preview />;
    }
  }

  try {
    const products = await getProductsOrThrow();
    return <CollectionSectionView products={products} />;
  } catch (error) {
    unstable_rethrow(error);
    console.error("[website] Could not load /api/products for the catalogue.", error);
    return <CollectionSectionView products={[]} loadState="error" />;
  }
}
