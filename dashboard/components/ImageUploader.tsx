"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, RefreshCcw, X } from "lucide-react";
import { Img } from "@/components/Img";
import { buttonGhost } from "@/components/ui";

interface ImageUploaderProps {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  /** Label for the first image, e.g. "Cover". */
  firstLabel?: string;
}

const MAX_SIDE = 1800;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Shrink large photos in the browser so uploads are fast and pages stay light. */
async function prepare(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    let smallest: Blob | null = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) break;
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const quality = Math.max(0.5, 0.86 - Math.floor(attempt / 2) * 0.1);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (!blob) break;
      if (!smallest || blob.size < smallest.size) smallest = blob;
      if (blob.size <= MAX_UPLOAD_BYTES) return file.size <= MAX_UPLOAD_BYTES && blob.size >= file.size ? file : blob;
      scale *= 0.82;
    }

    return smallest && smallest.size < file.size ? smallest : file;
  } catch {
    return file;
  }
}

export function ImageUploader({ value, onChange, max, firstLabel = "Cover" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const room = max === undefined ? files.length : Math.max(max - value.length, 0);
    const chosen = [...files].slice(0, room);
    if (max !== undefined && files.length > chosen.length) setError(`Only ${max} images are allowed — extra files were skipped.`);

    setBusy(chosen.length);
    const added: string[] = [];
    for (const file of chosen) {
      try {
        const body = new FormData();
        const prepared = await prepare(file);
        if (prepared.size > MAX_UPLOAD_BYTES) throw new Error("Image must be 4 MB or smaller after compression.");
        body.append("file", prepared, file.name);
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
        added.push(data.url);
      } catch (cause) {
        setError(cause instanceof Error ? `${file.name}: ${cause.message}` : "Upload failed.");
      } finally {
        setBusy((count) => count - 1);
      }
    }
    if (added.length) onChange([...value, ...added]);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function restoreVisibleImage(src: string, index: number, button: HTMLButtonElement) {
    const image = button.closest("li")?.querySelector("img");
    if (!image?.complete || image.naturalWidth === 0) {
      setError("This preview is no longer available in the browser. Upload the image file again.");
      return;
    }

    setError("");
    setRestoring(src);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not read this image preview.");
      context.drawImage(image, 0, 0);

      const preview = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.92));
      if (!preview) throw new Error("Could not prepare this image preview.");
      const file = new File([preview], `restored-${Date.now()}.webp`, { type: "image/webp" });
      const prepared = await prepare(file);
      if (prepared.size > MAX_UPLOAD_BYTES) throw new Error("Image must be 4 MB or smaller after compression.");

      const body = new FormData();
      body.append("file", prepared, file.name);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Image restore failed.");

      const next = [...value];
      next[index] = data.url;
      onChange(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image restore failed.");
    } finally {
      setRestoring(null);
    }
  }

  function move(index: number, delta: number) {
    const next = [...value];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((src, index) => (
          <li key={src} className="group relative overflow-hidden rounded-lg border border-gold/30 bg-cream">
            <div className="relative aspect-[4/3] bg-white">
              <Img src={src} alt={`Image ${index + 1}`} className="object-contain" />
            </div>
            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-charcoal/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                {firstLabel}
              </span>
            )}
            <div className="flex items-center justify-between gap-1 border-t border-gold/20 bg-white p-1.5">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move image earlier" className="rounded p-1 text-charcoal hover:bg-cream disabled:opacity-30">
                  <ArrowLeft className="size-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} aria-label="Move image later" className="rounded p-1 text-charcoal hover:bg-cream disabled:opacity-30">
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <button type="button" onClick={() => onChange(value.filter((item) => item !== src))} aria-label="Remove image" className="rounded p-1 text-[#8c2f25] hover:bg-[#a33a2e]/10">
                <X className="size-4" />
              </button>
            </div>
            {src.startsWith("/uploads/") && (
              <button
                type="button"
                onClick={(event) => void restoreVisibleImage(src, index, event.currentTarget)}
                disabled={restoring !== null}
                className="flex w-full items-center justify-center gap-1.5 border-t border-gold/20 bg-white px-2 py-2 text-[11px] font-medium text-charcoal-light hover:text-charcoal disabled:opacity-60"
              >
                {restoring === src ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCcw className="size-3.5" />}
                Restore from preview
              </button>
            )}
          </li>
        ))}
        {Array.from({ length: busy }).map((_, index) => (
          <li key={`busy-${index}`} className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-gold/50 bg-cream/60 text-slate">
            <Loader2 className="size-5 animate-spin" aria-label="Uploading" />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={max === undefined || max > 1} className="sr-only" id="image-upload" onChange={(event) => void upload(event.target.files)} />
        <label htmlFor="image-upload" className={`${buttonGhost} cursor-pointer ${max !== undefined && value.length >= max ? "pointer-events-none opacity-50" : ""}`}>
          <ImagePlus /> {value.length ? "Add more images" : "Upload images"}
        </label>
        <span className="text-xs text-slate">{value.length}{max === undefined ? " photos" : ` / ${max}`} · JPG, PNG, WebP or GIF, up to 4 MB each</span>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-[#8c2f25]">{error}</p>}
    </div>
  );
}
