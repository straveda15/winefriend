import { config } from "./config";

/**
 * Tells the public website that content changed so it refreshes its cached pages.
 * A failure never blocks a save: the website also re-checks the backend every few minutes.
 */
export async function notifyWebsite(tags: Array<"products" | "posts">): Promise<void> {
  if (!config.websiteUrl || !config.revalidateSecret) {
    console.warn("[backend] WEBSITE_URL / REVALIDATE_SECRET not set - website will refresh on its own within minutes.");
    return;
  }
  try {
    const response = await fetch(new URL("/api/revalidate", config.websiteUrl), {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": config.revalidateSecret },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.warn(`[backend] Website revalidation returned ${response.status}.`);
  } catch (error) {
    console.warn("[backend] Could not reach the website to refresh its cache:", (error as Error).message);
  }
}
