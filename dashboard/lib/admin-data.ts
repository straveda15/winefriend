import "server-only";
import { ApiError, api } from "@/lib/api";
import type { Enquiry, JournalArticle, Product } from "@winefriend/shared/types";

/** Dashboard reads. Each call goes to the backend with the admin's session token. */

export const adminProducts = () => api<Product[]>("/api/admin/products");
export const adminPosts = () => api<JournalArticle[]>("/api/admin/posts");
export const adminEnquiries = () => api<Enquiry[]>("/api/admin/enquiries");

async function orUndefined<T>(request: Promise<T>): Promise<T | undefined> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

export const adminProduct = (id: string) => orUndefined(api<Product>(`/api/admin/products/${encodeURIComponent(id)}`));
export const adminPost = (id: string) => orUndefined(api<JournalArticle>(`/api/admin/posts/${encodeURIComponent(id)}`));
