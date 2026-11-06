import "server-only";

/** Base URL of the Wine Friend backend (API). Set BACKEND_URL in the website's environment. */
export const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

export async function backendGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, { headers: { accept: "application/json" } });
  } catch (error) {
    throw new Error(`Could not reach the Wine Friend backend at ${BACKEND_URL}`, { cause: error });
  }
  if (!response.ok) throw new Error(`Backend ${path} responded with ${response.status}`);
  return (await response.json()) as T;
}
