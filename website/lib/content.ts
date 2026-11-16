import { cacheLife, cacheTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { backendGet } from "@/lib/backend";
import type { JournalArticle, Product } from "@winefriend/shared/types";

/**
 * Public, cached reads from the backend API. After every save the backend calls
 * POST /api/revalidate on this site, which invalidates the "products" / "posts" tags.
 * The short revalidate window is a safety net in case that call ever fails.
 */
const CONTENT_LIFE = { stale: 60, revalidate: 300, expire: 86400 };

/** Fetch content from the backend; cached callers provide a safe empty fallback on outages. */
async function getContent<T>(path: string): Promise<T[]> {
  return backendGet<T[]>(path);
}

async function getProductsCached(): Promise<Product[] | null> {
  "use cache";
  cacheTag("products");
  try {
    const products = await getContent<Product>("/api/products");
    cacheLife(CONTENT_LIFE);
    // Never keep an empty catalogue cached: a temporary backend/database mismatch
    // should not hide products after the source is corrected.
    return products.length > 0 ? products : null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("[website] Could not load /api/products; rendering without backend content.", error);
    cacheLife(CONTENT_LIFE);
    return [];
  }
}

export async function getProductsOrThrow(): Promise<Product[]> {
  const cached = await getProductsCached();
  return cached ?? getContent<Product>("/api/products");
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await getProductsOrThrow();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[website] Could not load /api/products; rendering without backend content.", error);
    return [];
  }
}

export async function getProductsForHome(limit = 3): Promise<Product[]> {
  const items = await getProductsOrThrow();
  return items.filter((item) => item.featured).slice(0, limit);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const items = await getProducts();
  return items.find((item) => item.slug === slug);
}

async function getPostsCached(): Promise<JournalArticle[]> {
  "use cache";
  cacheTag("posts");
  try {
    const posts = await getContent<JournalArticle>("/api/posts");
    cacheLife(CONTENT_LIFE);
    return posts;
  } catch (error) {
    unstable_rethrow(error);
    console.error("[website] Could not load /api/posts; rendering without backend content.", error);
    cacheLife(CONTENT_LIFE);
    return [];
  }
}

export async function getPosts(): Promise<JournalArticle[]> {
  try {
    return await getPostsCached();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[website] Could not load /api/posts; rendering without backend content.", error);
    return [];
  }
}

export async function getPost(slug: string): Promise<JournalArticle | undefined> {
  const items = await getPosts();
  return items.find((item) => item.slug === slug);
}
