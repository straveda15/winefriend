"use server";

import { headers } from "next/headers";
import { BACKEND_URL } from "@/lib/backend";
import type { FormState } from "@winefriend/shared/form-state";

const FIELDS = ["name", "email", "phone", "topic", "message", "product", "company_website", "website"] as const;

/** Forwards the contact form to the backend, which validates, rate-limits and stores it. */
export async function submitEnquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";

  const payload: Record<string, string> = {};
  for (const field of FIELDS) {
    const value = formData.get(field);
    payload[field] = typeof value === "string" ? value : "";
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/enquiries`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      saved?: boolean;
      duplicate?: boolean;
      message?: string;
      error?: string;
    };
    if (!response.ok || data.ok !== true) {
      return { error: data.error ?? "We could not send your enquiry. Please try again or use WhatsApp." };
    }
    if (data.saved === true) return { ok: true, message: data.message ?? "Thank you - your enquiry has been received." };
    if (data.duplicate === true) return { ok: true, message: "We have already received this enquiry and will be in touch." };
    return { error: "We could not verify that your enquiry was saved. Please try again or use WhatsApp." };
  } catch (error) {
    console.error("[website] Contact enquiry request failed:", error);
    return { error: "We could not send your enquiry right now. Please try again in a moment or use WhatsApp." };
  }
}
