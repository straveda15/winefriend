import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Called by the dashboard after products or blog posts change, so the public pages
 * pick the change up immediately. Protected by the shared REVALIDATE_SECRET.
 */
const ALLOWED_TAGS = new Set(["products", "posts"]);

function secretMatches(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tags: unknown;
  try {
    tags = ((await request.json()) as { tags?: unknown }).tags;
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const requested = Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string" && ALLOWED_TAGS.has(tag)) : [];
  if (!requested.length) return Response.json({ error: "No valid tags" }, { status: 400 });

  for (const tag of requested) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: requested });
}
