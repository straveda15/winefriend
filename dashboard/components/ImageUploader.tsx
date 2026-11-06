"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { Img } from "@/components/Img";
import { buttonGhost } from "@/components/ui";

interface ImageUploaderProps {
  value: string[];
  onChange: (next: string[]) => void;
  max: number;
  /** Label for the first image, e.g. "Cover". */
  firstLabel?: string;
}

const MAX_SIDE = 1800;

/** Shrink large photos in the browser so uploads are fast and pages stay light. */
async function prepare(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function ImageUploader({ value, onChange, max, firstLabel = "Cover" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const room = max - value.length;
    const chosen = [...files].slice(0, Math.max(room, 0));
    if (files.length > chosen.length) setError(`Only ${max} images are allowed — extra files were skipped.`);

    setBusy(chosen.length);
    const added: string[] = [];
    for (const file of chosen) {
      try {
        const body = new FormData();
        body.append("file", await prepare(file), file.name);
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
            <div className="relative aspect-[4/3]">
              <Img src={src} alt={`Image ${index + 1}`} className="object-cover" />
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
          </li>
        ))}
        {Array.from({ length: busy }).map((_, index) => (
          <li key={`busy-${index}`} className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-gold/50 bg-cream/60 text-slate">
            <Loader2 className="size-5 animate-spin" aria-label="Uploading" />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={max > 1} className="sr-only" id="image-upload" onChange={(event) => void upload(event.target.files)} />
        <label htmlFor="image-upload" className={`${buttonGhost} cursor-pointer ${value.length >= max ? "pointer-events-none opacity-50" : ""}`}>
          <ImagePlus /> {value.length ? "Add more images" : "Upload images"}
        </label>
        <span className="text-xs text-slate">{value.length} / {max} · JPG, PNG, WebP or GIF, up to 6 MB each</span>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-[#8c2f25]">{error}</p>}
    </div>
  );
}
