"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { endSession, startSession } from "@/lib/auth";
import type { FormState } from "@winefriend/shared/form-state";
import { checked, text } from "@winefriend/shared/validation";
import { adminEnquiries } from "@/lib/admin-data";

/**
 * Thin layer between the dashboard forms and the backend API. All validation, storage and
 * website refreshing happens in the backend; these actions just pass the form along and
 * turn a backend error into a message for the form.
 */

async function attempt(run: () => Promise<unknown>): Promise<FormState | null> {
  try {
    await run();
    return null;
  } catch (error) {
    // redirect() throws a special error that must keep travelling.
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }
}

/* ------------------------------------------------------------------ auth */

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";

  const out: { session?: { token: string; maxAge: number } } = {};
  const failed = await attempt(async () => {
    out.session = await api<{ token: string; maxAge: number }>("/api/admin/login", {
      method: "POST",
      auth: false,
      headers: { "x-forwarded-for": ip },
      body: { email: text(formData, "email"), password: String(formData.get("password") ?? "") },
    });
  });
  if (failed) return failed;
  if (!out.session) return { error: "Sign in failed. Please try again." };

  await startSession(out.session.token, out.session.maxAge);
  redirect("/");
}

export async function logoutAction() {
  await endSession();
  redirect("/login");
}

/* -------------------------------------------------------------- products */

export async function saveProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = text(formData, "id");

  let images: unknown;
  try {
    images = JSON.parse(text(formData, "images") || "[]");
  } catch {
    images = [];
  }

  const body = {
    name: text(formData, "name"),
    category: text(formData, "category"),
    shortDescription: text(formData, "shortDescription"),
    description: text(formData, "description"),
    price: text(formData, "price"),
    priceNote: text(formData, "priceNote"),
    features: String(formData.get("features") ?? ""),
    images,
    featured: checked(formData, "featured"),
    published: checked(formData, "published"),
  };

  const failed = await attempt(() =>
    api(id ? `/api/admin/products/${encodeURIComponent(id)}` : "/api/admin/products", { method: id ? "PUT" : "POST", body }),
  );
  if (failed) return failed;
  redirect(`/products?saved=${id ? "updated" : "created"}`);
}

export async function deleteProductAction(formData: FormData) {
  await api(`/api/admin/products/${encodeURIComponent(text(formData, "id"))}`, { method: "DELETE" });
  redirect("/products?saved=deleted");
}

export async function toggleProductPublishedAction(formData: FormData) {
  await api(`/api/admin/products/${encodeURIComponent(text(formData, "id"))}/toggle-published`, { method: "POST" });
  redirect("/products");
}

/* ----------------------------------------------------------------- posts */

export async function savePostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = text(formData, "id");

  let images: unknown;
  try {
    images = JSON.parse(text(formData, "images") || "[]");
  } catch {
    images = [];
  }

  const body = {
    title: text(formData, "title"),
    excerpt: text(formData, "excerpt"),
    content: String(formData.get("content") ?? ""),
    images,
    category: text(formData, "category"),
    date: text(formData, "date"),
    slug: text(formData, "slug"),
    published: checked(formData, "published"),
    featured: checked(formData, "featured"),
  };

  const failed = await attempt(() =>
    api(id ? `/api/admin/posts/${encodeURIComponent(id)}` : "/api/admin/posts", { method: id ? "PUT" : "POST", body }),
  );
  if (failed) return failed;
  redirect(`/blog?saved=${id ? "updated" : "created"}`);
}

export async function deletePostAction(formData: FormData) {
  await api(`/api/admin/posts/${encodeURIComponent(text(formData, "id"))}`, { method: "DELETE" });
  redirect("/blog?saved=deleted");
}

export async function togglePostPublishedAction(formData: FormData) {
  await api(`/api/admin/posts/${encodeURIComponent(text(formData, "id"))}/toggle-published`, { method: "POST" });
  redirect("/blog");
}

/* ------------------------------------------------------------- enquiries */

export async function getEnquiryCountsAction() {
  const enquiries = await adminEnquiries();
  const newCount = enquiries.filter((item) => item.status === "new").length;
  return { total: enquiries.length, new: newCount, handled: enquiries.length - newCount };
}

export async function toggleEnquiryHandledAction(formData: FormData) {
  await api(`/api/admin/enquiries/${encodeURIComponent(text(formData, "id"))}/toggle-handled`, { method: "POST" });
  redirect("/enquiries");
}

export async function deleteEnquiryAction(formData: FormData) {
  await api(`/api/admin/enquiries/${encodeURIComponent(text(formData, "id"))}`, { method: "DELETE" });
  redirect("/enquiries");
}
