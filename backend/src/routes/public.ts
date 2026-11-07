import { Router } from "express";
import { ENQUIRY_TOPICS } from "@winefriend/shared/constants";
import type { Enquiry } from "@winefriend/shared/types";
import { isValidContactName, isValidEmail, isValidEnquiryMessage, isValidIndianMobile } from "@winefriend/shared/validation";
import { clientKey } from "../auth";
import { asBody, str } from "../input";
import { mutateCollection, newId, readCollection } from "../store";
import { UPLOAD_NAME, readUpload } from "../uploads";

/** Read-only content for the website, the contact form, and uploaded images. */
export const publicRouter = Router();

publicRouter.get("/api/products", async (_request, response) => {
  const items = await readCollection("products");
  response.json(items.filter((item) => item.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

publicRouter.get("/api/posts", async (_request, response) => {
  const items = await readCollection("posts");
  response.json(items.filter((item) => item.published).sort((a, b) => b.date.localeCompare(a.date)));
});

/* ------------------------------------------------------------ enquiries */

const recent = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > LIMIT;
}

publicRouter.post("/api/enquiries", async (request, response) => {
  const body = asBody(request.body);

  // Honeypot: real visitors never see or fill this field.
  if (str(body, "company_website") || str(body, "website")) {
    response.json({ ok: true, saved: false, message: "We could not verify this enquiry." });
    return;
  }

  if (rateLimited(clientKey(request))) {
    response.status(429).json({ error: "You have sent several enquiries recently. Please try again in a few minutes or use WhatsApp." });
    return;
  }

  const name = str(body, "name");
  const email = str(body, "email");
  const phone = str(body, "phone");
  const topic = str(body, "topic");
  const message = str(body, "message");
  const product = str(body, "product");

  if (!isValidContactName(name)) {
    response.status(400).json({ error: "Enter at least 2 letters for your name. Use alphabets and spaces only." });
    return;
  }
  if (!isValidEmail(email)) {
    response.status(400).json({ error: "Please enter a valid email address." });
    return;
  }
  if (!isValidIndianMobile(phone)) {
    response.status(400).json({ error: "Enter a valid 10-digit Indian mobile number." });
    return;
  }
  if (!isValidEnquiryMessage(message)) {
    response.status(400).json({ error: "Please write a message (up to 3,000 characters)." });
    return;
  }

  const enquiry: Enquiry = {
    id: newId(),
    name,
    email,
    phone,
    topic: (ENQUIRY_TOPICS as readonly string[]).includes(topic) ? topic : "Other",
    message,
    product: product.slice(0, 120) || undefined,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const duplicate = await mutateCollection("enquiries", (items) => {
    const duplicateWindow = 60 * 1000;
    const isDuplicate = items.some((item) => {
      const age = Date.now() - Date.parse(item.createdAt);
      return (
        age >= 0 &&
        age <= duplicateWindow &&
        item.name.toLowerCase() === enquiry.name.toLowerCase() &&
        item.email.toLowerCase() === enquiry.email.toLowerCase() &&
        item.phone === enquiry.phone &&
        item.topic === enquiry.topic &&
        item.message === enquiry.message &&
        (item.product ?? "") === (enquiry.product ?? "")
      );
    });
    return isDuplicate
      ? { items, result: true }
      : { items: [enquiry, ...items].slice(0, 2000), result: false };
  });
  response.json({
    ok: true,
    saved: !duplicate,
    message: "Thank you - your enquiry has been received. We will get back to you shortly.",
    duplicate,
  });
});

/* -------------------------------------------------------------- uploads */

publicRouter.get("/uploads/:name", async (request, response) => {
  const name = String(request.params.name);
  if (!UPLOAD_NAME.test(name)) {
    response.status(404).send("Not found");
    return;
  }
  try {
    const file = await readUpload(name);
    if (!file) {
      response.status(404).send("Not found");
      return;
    }
    response
      .set({
        "Content-Type": file.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      })
      .send(file.data);
  } catch {
    response.status(404).send("Not found");
  }
});
