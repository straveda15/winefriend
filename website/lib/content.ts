import { cacheLife, cacheTag } from "next/cache";
import { backendGet } from "@/lib/backend";
import type { JournalArticle, Product } from "@winefriend/shared/types";

/**
 * Public, cached reads from the backend API. After every save the backend calls
 * POST /api/revalidate on this site, which invalidates the "products" / "posts" tags.
 * The short revalidate window is a safety net in case that call ever fails.
 */
const CONTENT_LIFE = { stale: 60, revalidate: 300, expire: 86400 };

/** Throws on failure so "use cache" never stores an empty list; the public getters below catch it. */
async function getContent<T>(path: string): Promise<T[]> {
  return backendGet<T[]>(path);
}

async function getProductsCached(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife(CONTENT_LIFE);
  return getContent<Product>("/api/products");
}

export async function getProductsOrThrow(): Promise<Product[]> {
  return getProductsCached();
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await getProductsOrThrow();
  } catch (error) {
    console.error("[website] Could not load /api/products; rendering without backend content.", error);
    return [];
  }
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

async function getPostsCached(): Promise<JournalArticle[]> {
  "use cache";
  cacheTag("posts");
  cacheLife(CONTENT_LIFE);
  return getContent<JournalArticle>("/api/posts");
}

export async function getPosts(): Promise<JournalArticle[]> {
  try {
    return await getPostsCached();
  } catch (error) {
    console.error("[website] Could not load /api/posts; rendering without backend content.", error);
    return [];
  }
}

export async function getPost(slug: string): Promise<JournalArticle | undefined> {
  const items = await getPosts();
  return items.find((item) => item.slug === slug);
}
