import { Binary } from "mongodb";
import { UPLOAD_PREFIX } from "@winefriend/shared/constants";
import { getDb } from "./db";
import { readCollection } from "./store";

export const UPLOAD_NAME = /^[a-z0-9][a-z0-9-]{3,80}\.(jpg|png|webp|gif)$/;

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/** Identify an image by its first bytes rather than trusting the client's MIME type. */
export function detectImageExt(bytes: Uint8Array): "jpg" | "png" | "webp" | "gif" | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "gif";
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "webp";
  return null;
}

type UploadDoc = { _id: string; contentType: string; data: Binary; createdAt: Date };

async function uploadsCollection() {
  return (await getDb()).collection<UploadDoc>("uploads");
}

/** Store an image in MongoDB (the file name is the document id). */
export async function saveUpload(name: string, bytes: Uint8Array, contentType: string) {
  await (await uploadsCollection()).insertOne({ _id: name, contentType, data: new Binary(bytes), createdAt: new Date() });
}

export async function readUpload(name: string): Promise<{ contentType: string; data: Buffer } | null> {
  const doc = await (await uploadsCollection()).findOne({ _id: name });
  return doc ? { contentType: doc.contentType, data: Buffer.from(doc.data.buffer) } : null;
}

/** Delete uploaded files that no product or post references any more. */
export async function deleteUnreferencedUploads(candidates: string[]) {
  const uploads = [...new Set(candidates)].filter((src) => src.startsWith(UPLOAD_PREFIX));
  if (!uploads.length) return;

  const [products, posts] = await Promise.all([readCollection("products"), readCollection("posts")]);
  const inUse = new Set<string>([
    ...products.flatMap((item) => item.images),
    ...posts.flatMap((item) => item.images?.length ? item.images : item.image ? [item.image] : []),
  ]);

  const names = uploads
    .filter((src) => !inUse.has(src))
    .map((src) => src.slice(UPLOAD_PREFIX.length))
    .filter((name) => UPLOAD_NAME.test(name));
  if (names.length) await (await uploadsCollection()).deleteMany({ _id: { $in: names } });
}
