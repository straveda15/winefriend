import { BACKEND_URL } from "@/lib/api";

/** Uploaded images live in the backend; this passes them through for the dashboard's previews. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const upstream = await fetch(`${BACKEND_URL}/uploads/${encodeURIComponent(name)}`);
    if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
