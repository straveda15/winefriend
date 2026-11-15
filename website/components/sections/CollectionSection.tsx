import { CollectionSectionView } from "@/components/sections/CollectionSectionView";
import { getProductsForHome, getProductsOrThrow } from "@/lib/content";

export async function CollectionSection({ preview = false }: { preview?: boolean }) {
  if (preview) {
    try {
      const products = await getProductsForHome(3);
      return <CollectionSectionView products={products} preview />;
    } catch (error) {
      console.error("[website] Could not load featured products for the home page.", error);
      return <CollectionSectionView products={[]} preview loadState="error" />;
    }
  }

  try {
    const products = await getProductsOrThrow();
    return <CollectionSectionView products={products} />;
  } catch (error) {
    console.error("[website] Could not load /api/products for the catalogue.", error);
    return <CollectionSectionView products={[]} loadState="error" />;
  }
}
