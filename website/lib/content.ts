import { cacheLife, cacheTag } from "next/cache";
import { backendGet } from "@/lib/backend";
import type { JournalArticle, Product } from "@winefriend/shared/types";

/**
 * Public, cached reads from the backend API. After every save the backend calls
 * POST /api/revalidate on this site, which invalidates the "products" / "posts" tags.
 * The short revalidate window is a safety net in case that call ever fails.
 */
const CONTENT_LIFE = { stale: 60, revalidate: 300, expire: 86400 };

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife(CONTENT_LIFE);
  return backendGet<Product[]>("/api/products");
}

export async function getProductsForHome(limit = 3): Promise<Product[]> {
  const items = await getProducts();
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const items = await getProducts();
  return items.find((item) => item.slug === slug);
}

export async function getPosts(): Promise<JournalArticle[]> {
  "use cache";
  cacheTag("posts");
  cacheLife(CONTENT_LIFE);
  return backendGet<JournalArticle[]>("/api/posts");
}

export async function getPost(slug: string): Promise<JournalArticle | undefined> {
  const items = await getPosts();
  return items.find((item) => item.slug === slug);
}
