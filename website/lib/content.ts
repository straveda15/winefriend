import { cacheLife, cacheTag } from "next/cache";
import { backendGet } from "@/lib/backend";
import type { JournalArticle, Product } from "@winefriend/shared/types";

/**
 * Public, cached reads from the backend API. After every save the backend calls
 * POST /api/revalidate on this site, which invalidates the "products" / "posts" tags.
 * The short revalidate window is a safety net in case that call ever fails.
 */
const CONTENT_LIFE = { stale: 60, revalidate: 300, expire: 86400 };


async function getProductsCached(): Promise<Product[]> {

async function getContent<T>(path: string): Promise<T[]> {
  try {
    return await backendGet<T[]>(path);
  } catch (error) {
    if (process.env.NODE_ENV !== "development") throw error;
    console.warn(`[website] Could not load ${path}; rendering without backend content in development.`);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
>>>>>>> 12049ec9fcceedb5dba026c7dd934f2117dfbaf2
  "use cache";
  cacheTag("products");
  cacheLife(CONTENT_LIFE);
  return getContent<Product>("/api/products");
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await getProductsCached();
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
