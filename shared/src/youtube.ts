const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

    const parts = url.pathname.split("/").filter(Boolean);
    const id = url.hostname.toLowerCase() === "youtu.be"
      ? parts[0]
      : url.pathname === "/watch"
        ? url.searchParams.get("v")
        : ["embed", "shorts", "live"].includes(parts[0] ?? "")
          ? parts[1]
          : null;
    return id && VIDEO_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function toYouTubeEmbedUrl(value: string): string | null {
  const id = getYouTubeVideoId(value);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
