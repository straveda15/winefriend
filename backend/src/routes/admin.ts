import express, { Router } from "express";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { BLOG_CATEGORIES, MAX_PRODUCT_IMAGES, PRODUCT_CATEGORIES, UPLOAD_PREFIX } from "@winefriend/shared/constants";
import type { JournalArticle, Product } from "@winefriend/shared/types";
import { isAllowedImagePath, lines } from "@winefriend/shared/validation";
import {
  adminConfigured,
  clearFailures,
  clientKey,
  credentialsValid,
  isThrottled,
  recordFailure,
  requireAdmin,
} from "../auth";
import { asBody, bool, str } from "../input";
import { notifyWebsite } from "../notify";
import { SESSION_MAX_AGE_SECONDS, createSessionToken } from "../session";
import { UPLOAD_DIR, mutateCollection, newId, readCollection, slugify, uniqueSlug } from "../store";
import { deleteUnreferencedUploads, detectImageExt } from "../uploads";

/** Everything the dashboard needs. All routes except login/status require an admin session token. */
export const adminRouter = Router();

type SaveResult = { error: string } | { saved: Product | JournalArticle; removed: string[] };

/* ----------------------------------------------------------------- auth */

adminRouter.get("/api/admin/status", (_request, response) => {
  response.json({ configured: adminConfigured() });
});

adminRouter.post("/api/admin/login", (request, response) => {
  if (!adminConfigured()) {
    response.status(503).json({ error: "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and SESSION_SECRET in the backend." });
    return;
  }

  const key = clientKey(request);
  if (isThrottled(key)) {
    response.status(429).json({ error: "Too many failed attempts. Please wait 15 minutes and try again." });
    return;
  }

  const body = asBody(request.body);
  const email = str(body, "email");
  const password = typeof body.password === "string" ? body.password : "";

  if (!credentialsValid(email, password)) {
    recordFailure(key);
    response.status(401).json({ error: "Incorrect email or password." });
    return;
  }

  clearFailures(key);
  const token = createSessionToken(email);
  if (!token) {
    response.status(500).json({ error: "SESSION_SECRET is missing or shorter than 32 characters." });
    return;
  }
  response.json({ token, email, maxAge: SESSION_MAX_AGE_SECONDS });
});

adminRouter.use("/api/admin", requireAdmin);

adminRouter.get("/api/admin/me", (_request, response) => {
  response.json({ sub: response.locals.admin.sub });
});

/* ------------------------------------------------------------- products */

adminRouter.get("/api/admin/products", async (_request, response) => {
  const items = await readCollection("products");
  response.json(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

adminRouter.get("/api/admin/products/:id", async (request, response) => {
  const items = await readCollection("products");
  const item = items.find((entry) => entry.id === request.params.id);
  if (!item) {
    response.status(404).json({ error: "Not found." });
    return;
  }
  response.json(item);
});

type ProductInput = Pick<
  Product,
  "name" | "category" | "shortDescription" | "description" | "price" | "priceNote" | "images" | "features" | "featured" | "published"
>;

function parseProduct(body: ReturnType<typeof asBody>): ProductInput | { error: string } {
  const name = str(body, "name");
  const category = str(body, "category");
  const shortDescription = str(body, "shortDescription");
  const description = str(body, "description");
  const priceNote = str(body, "priceNote");
  const priceRaw = String(body.price ?? "").replace(/[,₹\s]/g, "");
  const features = lines(typeof body.features === "string" ? body.features : "", 12, 120);
  const images = body.images;

  if (!name) return { error: "Product name is required." };
  if (name.length > 120) return { error: "Product name must be 120 characters or fewer." };
  if (!PRODUCT_CATEGORIES.some((item) => item.id === category)) return { error: "Choose a category." };
  if (!shortDescription) return { error: "Add a short description for the product card." };
  if (shortDescription.length > 200) return { error: "Short description must be 200 characters or fewer." };
  if (description.length > 4000) return { error: "Description must be 4,000 characters or fewer." };
  if (priceNote.length > 60) return { error: "Price note must be 60 characters or fewer." };

  let price: number | undefined;
  if (priceRaw) {
    price = Number(priceRaw);
    if (!Number.isFinite(price) || price < 0 || price > 10_000_000) return { error: "Enter the price as a number, e.g. 1250." };
  }

  if (!Array.isArray(images) || !images.every(isAllowedImagePath)) return { error: "One of the images is invalid. Please re-upload it." };
  if (images.length === 0) return { error: "Add at least one product image." };
  if (images.length > MAX_PRODUCT_IMAGES) return { error: `A product can have up to ${MAX_PRODUCT_IMAGES} images.` };

  return {
    name,
    category,
    shortDescription,
    description,
    price,
    priceNote: priceNote || undefined,
    images: images as string[],
    features,
    featured: bool(body, "featured"),
    published: bool(body, "published"),
  };
}

async function saveProduct(id: string | undefined, body: ReturnType<typeof asBody>): Promise<SaveResult> {
  const input = parseProduct(body);
  if ("error" in input) return input;
  const now = new Date().toISOString();

  return mutateCollection<"products", SaveResult>("products", (items) => {
    if (id) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return { items, result: { error: "That product no longer exists." } };
      const previous = items[index];
      const updated: Product = { ...previous, ...input, updatedAt: now };
      const next = [...items];
      next[index] = updated;
      return { items: next, result: { saved: updated, removed: previous.images.filter((src) => !input.images.includes(src)) } };
    }

    const created: Product = {
      id: newId(),
      slug: uniqueSlug(slugify(input.name), items.map((item) => item.slug)),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    return { items: [created, ...items], result: { saved: created, removed: [] } };
  });
}

async function finishSave(result: SaveResult, tag: "products" | "posts", status: number, response: express.Response) {
  if ("error" in result) {
    response.status(400).json({ error: result.error });
    return;
  }
  await deleteUnreferencedUploads(result.removed);
  await notifyWebsite([tag]);
  response.status(status).json(result.saved);
}

adminRouter.post("/api/admin/products", async (request, response) => {
  await finishSave(await saveProduct(undefined, asBody(request.body)), "products", 201, response);
});

adminRouter.put("/api/admin/products/:id", async (request, response) => {
  await finishSave(await saveProduct(String(request.params.id), asBody(request.body)), "products", 200, response);
});

adminRouter.delete("/api/admin/products/:id", async (request, response) => {
  const id = String(request.params.id);
  const removed = await mutateCollection("products", (items) => {
    const target = items.find((item) => item.id === id);
    return { items: items.filter((item) => item.id !== id), result: target?.images ?? [] };
  });
  await deleteUnreferencedUploads(removed);
  await notifyWebsite(["products"]);
  response.json({ ok: true });
});

adminRouter.post("/api/admin/products/:id/toggle-published", async (request, response) => {
  const id = String(request.params.id);
  await mutateCollection("products", (items) => ({
    items: items.map((item) => (item.id === id ? { ...item, published: !item.published, updatedAt: new Date().toISOString() } : item)),
    result: null,
  }));
  await notifyWebsite(["products"]);
  response.json({ ok: true });
});

/* ---------------------------------------------------------------- posts */

adminRouter.get("/api/admin/posts", async (_request, response) => {
  const items = await readCollection("posts");
  response.json(items.sort((a, b) => b.date.localeCompare(a.date)));
});

adminRouter.get("/api/admin/posts/:id", async (request, response) => {
  const items = await readCollection("posts");
  const item = items.find((entry) => entry.id === request.params.id);
  if (!item) {
    response.status(404).json({ error: "Not found." });
    return;
  }
  response.json(item);
});

async function savePost(id: string | undefined, body: ReturnType<typeof asBody>): Promise<SaveResult> {
  const title = str(body, "title");
  const excerpt = str(body, "excerpt");
  const content = (typeof body.content === "string" ? body.content : "").replace(/\r\n/g, "\n").trim();
  const image = str(body, "image");
  const category = str(body, "category");
  const date = str(body, "date");
  const customSlug = str(body, "slug");
  const published = bool(body, "published");
  const featured = bool(body, "featured");

  if (!title) return { error: "Title is required." };
  if (title.length > 150) return { error: "Title must be 150 characters or fewer." };
  if (!excerpt) return { error: "Add a short summary for the blog listing." };
  if (excerpt.length > 300) return { error: "Summary must be 300 characters or fewer." };
  if (!content) return { error: "Write the article content." };
  if (content.length > 30000) return { error: "Article is too long (30,000 character limit)." };
  if (!isAllowedImagePath(image)) return { error: "Add a featured image." };
  if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) return { error: "Choose a category." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Choose a publication date." };

  const now = new Date().toISOString();

  return mutateCollection<"posts", SaveResult>("posts", (items) => {
    const others = items.filter((item) => item.id !== id);
    const slug = uniqueSlug(slugify(customSlug || title), others.map((item) => item.slug));
    // Only one post can be featured on the homepage.
    const cleared = featured ? others.map((item) => ({ ...item, featured: false })) : others;

    if (id) {
      const previous = items.find((item) => item.id === id);
      if (!previous) return { items, result: { error: "That post no longer exists." } };
      const updated: JournalArticle = { ...previous, title, slug, excerpt, content, image, category, date, featured, published, updatedAt: now };
      return {
        items: items.map((item) => (item.id === id ? updated : (cleared.find((other) => other.id === item.id) ?? item))),
        result: { saved: updated, removed: previous.image !== image ? [previous.image] : [] },
      };
    }

    const created: JournalArticle = { id: newId(), title, slug, excerpt, content, image, category, date, featured, published, updatedAt: now };
    return { items: [created, ...cleared], result: { saved: created, removed: [] } };
  });
}

adminRouter.post("/api/admin/posts", async (request, response) => {
  await finishSave(await savePost(undefined, asBody(request.body)), "posts", 201, response);
});

adminRouter.put("/api/admin/posts/:id", async (request, response) => {
  await finishSave(await savePost(String(request.params.id), asBody(request.body)), "posts", 200, response);
});

adminRouter.delete("/api/admin/posts/:id", async (request, response) => {
  const id = String(request.params.id);
  const removed = await mutateCollection("posts", (items) => {
    const target = items.find((item) => item.id === id);
    return { items: items.filter((item) => item.id !== id), result: target ? [target.image] : [] };
  });
  await deleteUnreferencedUploads(removed);
  await notifyWebsite(["posts"]);
  response.json({ ok: true });
});

adminRouter.post("/api/admin/posts/:id/toggle-published", async (request, response) => {
  const id = String(request.params.id);
  await mutateCollection("posts", (items) => ({
    items: items.map((item) => (item.id === id ? { ...item, published: !item.published, updatedAt: new Date().toISOString() } : item)),
    result: null,
  }));
  await notifyWebsite(["posts"]);
  response.json({ ok: true });
});

/* ------------------------------------------------------------ enquiries */

adminRouter.get("/api/admin/enquiries", async (_request, response) => {
  const items = await readCollection("enquiries");
  response.json(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

adminRouter.post("/api/admin/enquiries/:id/toggle-handled", async (request, response) => {
  const id = String(request.params.id);
  await mutateCollection("enquiries", (items) => ({
    items: items.map((item) => (item.id === id ? { ...item, status: item.status === "new" ? ("handled" as const) : ("new" as const) } : item)),
    result: null,
  }));
  response.json({ ok: true });
});

adminRouter.delete("/api/admin/enquiries/:id", async (request, response) => {
  const id = String(request.params.id);
  await mutateCollection("enquiries", (items) => ({ items: items.filter((item) => item.id !== id), result: null }));
  response.json({ ok: true });
});

/* -------------------------------------------------------------- uploads */

const MAX_BYTES = 6 * 1024 * 1024;

// The dashboard forwards the image bytes as-is (application/octet-stream).
adminRouter.post("/api/admin/uploads", express.raw({ type: "*/*", limit: MAX_BYTES }), async (request, response) => {
  const bytes = Buffer.isBuffer(request.body) ? request.body : Buffer.alloc(0);
  if (bytes.length === 0) {
    response.status(400).json({ error: "No image received." });
    return;
  }

  const ext = detectImageExt(new Uint8Array(bytes));
  if (!ext) {
    response.status(415).json({ error: "Only JPG, PNG, WebP or GIF images are allowed." });
    return;
  }

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  response.json({ url: `${UPLOAD_PREFIX}${name}` });
});
