import { BACKEND_URL, backendFetchErrorMessage, sessionToken } from "@/lib/api";

const MAX_BYTES = 4 * 1024 * 1024;

/** Receives an image from the browser and hands it to the backend, which validates and stores it. */
export async function POST(request: Request) {
  const token = await sessionToken();
  if (!token) return Response.json({ error: "Please sign in again." }, { status: 401 });

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "No image received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image is larger than 4 MB." }, { status: 413 });
  }

  try {
    const upstream = await fetch(`${BACKEND_URL}/api/admin/uploads`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/octet-stream" },
      body: new Uint8Array(await file.arrayBuffer()),
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({ error: "Upload failed." }));
    return Response.json(data, { status: upstream.status });
  } catch (error) {
    return Response.json({ error: backendFetchErrorMessage("/api/admin/uploads", error) }, { status: 503 });
  }
}
