"use client";

import { useState } from "react";
import type { ImageProps } from "next/image";
import { Img } from "@/components/ui/Img";

const FALLBACK_IMAGE = "/images/journal/indian-wine-experience.webp";

export function JournalImage({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  onError,
  ...props
}: Omit<ImageProps, "src"> & { src?: string; fallbackSrc?: string }) {
  const fallback = fallbackSrc ?? FALLBACK_IMAGE;
  const sourceKey = `${src ?? ""}|${fallback}`;
  const [failure, setFailure] = useState<{ sourceKey: string; fallbackFailed: boolean } | null>(null);
  const sourceFailure = failure?.sourceKey === sourceKey ? failure : null;
  const showFallback = !src || sourceFailure !== null;

  if (sourceFailure?.fallbackFailed) return null;

  return (
    <Img
      // Remount when switching from a failed CMS URL to its fallback. Next/Image can otherwise
      // deliver the first request's late error to the updated handler and hide the valid fallback.
      key={`${sourceKey}:${showFallback ? "fallback" : "primary"}`}
      {...props}
      src={showFallback ? fallback : src!}
      style={{
        ...props.style,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "center",
        backgroundColor: "#fff",
        transform: "none",
      }}
      onError={(event) => {
        onError?.(event);
        setFailure({ sourceKey, fallbackFailed: showFallback });
      }}
    />
  );
}
