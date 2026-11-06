import { CollectionSectionView } from "@/components/sections/CollectionSectionView";
import { getProducts, getProductsForHome } from "@/lib/content";

export async function CollectionSection({ preview = false }: { preview?: boolean }) {
  const products = preview ? await getProductsForHome(3) : await getProducts();
  return <CollectionSectionView products={products} preview={preview} />;
}
