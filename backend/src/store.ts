import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config";
import { seedPosts, seedProducts } from "./seed";
import type { Enquiry, JournalArticle, Product } from "@winefriend/shared/types";

/**
 * Small JSON-file store: <DATA_DIR>/products.json, posts.json, enquiries.json and <DATA_DIR>/uploads/.
 * DATA_DIR must be on persistent storage (it must survive deploys).
 * Writes are serialised per collection and atomic (temp file + rename).
 */

export const DATA_DIR = config.dataDir;
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

type Collections = {
  products: Product;
  posts: JournalArticle;
  enquiries: Enquiry;
};
export type CollectionName = keyof Collections;

const seeds: { [K in CollectionName]: () => Collections[K][] } = {
  products: () => structuredClone(seedProducts),
  posts: () => structuredClone(seedPosts),
  enquiries: () => [],
};

const queues = new Map<string, Promise<unknown>>();

function filePath(name: CollectionName) {
  return path.join(DATA_DIR, `${name}.json`);
}

async function readRaw<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  try {
    const text = await fs.readFile(filePath(name), "utf8");
    return JSON.parse(text) as Collections[K][];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const initial = seeds[name]();
    await writeRaw(name, initial);
    return initial;
  }
}

async function writeRaw<K extends CollectionName>(name: K, items: Collections[K][]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = filePath(name);
  const temp = `${target}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(temp, JSON.stringify(items, null, 2), "utf8");
  await fs.rename(temp, target);
}

export async function readCollection<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  // Wait for any in-flight write so reads after a mutation see it.
  await queues.get(name)?.catch(() => undefined);
  return readRaw(name);
}

/** Read-modify-write under a per-collection lock. */
export async function mutateCollection<K extends CollectionName, R>(
  name: K,
  update: (items: Collections[K][]) => { items: Collections[K][]; result: R },
): Promise<R> {
  const previous = queues.get(name) ?? Promise.resolve();
  const run = previous
    .catch(() => undefined)
    .then(async () => {
      const current = await readRaw(name);
      const { items, result } = update(current);
      await writeRaw(name, items);
      return result;
    });
  queues.set(name, run);
  return run;
}

export function newId(): string {
  return randomBytes(8).toString("hex");
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item"
  );
}

export function uniqueSlug(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
