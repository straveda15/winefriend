import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ENQUIRY_TOPICS } from "@winefriend/shared/constants";
import type { Enquiry } from "@winefriend/shared/types";
import { isValidEmail } from "@winefriend/shared/validation";
import { clientKey } from "../auth";
import { asBody, str } from "../input";
import { mutateCollection, newId, readCollection, UPLOAD_DIR } from "../store";
import { MIME_BY_EXT, UPLOAD_NAME } from "../uploads";

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
  if (str(body, "website")) {
    response.json({ ok: true, message: "Thank you - we will be in touch shortly." });
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

  if (!name || name.length > 100) {
    response.status(400).json({ error: "Please enter your name." });
    return;
  }
  if (!isValidEmail(email)) {
    response.status(400).json({ error: "Please enter a valid email address." });
    return;
  }
  if (phone.length > 30) {
    response.status(400).json({ error: "That phone number looks too long." });
    return;
  }
  if (!message || message.length > 3000) {
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

  await mutateCollection("enquiries", (items) => ({ items: [enquiry, ...items].slice(0, 2000), result: null }));
  response.json({ ok: true, message: "Thank you - your enquiry has been received. We will get back to you shortly." });
});

/* -------------------------------------------------------------- uploads */

publicRouter.get("/uploads/:name", async (request, response) => {
  const name = String(request.params.name);
  if (!UPLOAD_NAME.test(name)) {
    response.status(404).send("Not found");
    return;
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    const ext = name.split(".").pop() ?? "";
    response
      .set({
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      })
      .send(data);
  } catch {
    response.status(404).send("Not found");
  }
});
