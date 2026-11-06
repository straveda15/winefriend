import { randomBytes } from "node:crypto";
import type { AnyBulkWriteOperation, Document } from "mongodb";
import { getDb } from "./db";
import { seedPosts, seedProducts } from "./seed";
import type { Enquiry, JournalArticle, Product } from "@winefriend/shared/types";

/**
 * MongoDB store. Each collection (products, posts, enquiries) keeps one document per item, with the
 * item's own `id` used as the document `_id`. The starter products and posts are inserted once, the
 * first time a collection is read (a marker in the `meta` collection stops them coming back after
 * you delete everything). Writes are serialised per collection.
 */

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

type Item = { id: string };
const toDoc = (item: Item): Document => ({ _id: item.id as unknown, ...item });
function fromDoc<T>(doc: Document): T {
  const { _id, ...rest } = doc;
  void _id;
  return rest as T;
}

async function readRaw<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  const db = await getDb();
  const collection = db.collection(name);
  const meta = db.collection<{ _id: string }>("meta");

  if (!(await meta.findOne({ _id: name }))) {
    const claim = await meta.updateOne({ _id: name }, { $setOnInsert: { seededAt: new Date() } }, { upsert: true });
    const initial = seeds[name]();
    if (claim.upsertedCount && initial.length) await collection.insertMany(initial.map(toDoc));
  }

  const docs = await collection.find().toArray();
  return docs.map((doc) => fromDoc<Collections[K]>(doc));
}

export async function readCollection<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  // Wait for any in-flight write so reads after a mutation see it.
  await queues.get(name)?.catch(() => undefined);
  return readRaw(name);
}

/** Read, change, then save only what changed (added / edited / removed items). */
export async function mutateCollection<K extends CollectionName, R>(
  name: K,
  update: (items: Collections[K][]) => { items: Collections[K][]; result: R },
): Promise<R> {
  const previous = queues.get(name) ?? Promise.resolve();
  const run = previous
    .catch(() => undefined)
    .then(async () => {
      const current = await readRaw(name);
      const before = new Map(current.map((item) => [item.id, JSON.stringify(item)]));
      const { items, result } = update(current);

      const operations: AnyBulkWriteOperation<Document>[] = [];
      const keep = new Set<string>();
      for (const item of items) {
        keep.add(item.id);
        if (before.get(item.id) !== JSON.stringify(item)) {
          operations.push({ replaceOne: { filter: { _id: item.id as never }, replacement: toDoc(item), upsert: true } });
        }
      }
      for (const id of before.keys()) {
        if (!keep.has(id)) operations.push({ deleteOne: { filter: { _id: id as never } } });
      }
      if (operations.length) await (await getDb()).collection(name).bulkWrite(operations, { ordered: true });
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
