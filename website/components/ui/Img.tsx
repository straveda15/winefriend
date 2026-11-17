"use client";

import { forwardRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { UPLOAD_PREFIX } from "@winefriend/shared/constants";

/**
 * next/image wrapper. Images uploaded through the admin panel are already resized and
 * compressed in the browser, so they are served as-is instead of through the optimizer.
 */
export const Img = forwardRef<HTMLImageElement, ImageProps>(function Img(props, ref) {
  const isUpload = typeof props.src === "string" && props.src.startsWith(UPLOAD_PREFIX);
  const sourceKey = typeof props.src === "string"
    ? props.src
    : "src" in props.src
      ? props.src.src
      : props.src.default.src;
  const [result, setResult] = useState<{ source: string; state: "loaded" | "error" } | null>(null);
  const state = result?.source === sourceKey ? result.state : "loading";
  const { onLoad, onError, className, ...imageProps } = props;

  return (
    <span
      className={`wf-image-shell ${props.fill ? "wf-image-shell-fill" : "wf-image-shell-intrinsic"}`}
      data-image-state={state}
      aria-busy={state === "loading"}
    >
      <Image
        {...imageProps}
        ref={ref}
        alt={props.alt}
        className={`wf-lazy-image${className ? ` ${className}` : ""}`}
        unoptimized={isUpload || props.unoptimized}
        onLoad={(event) => {
          setResult({ source: sourceKey, state: "loaded" });
          onLoad?.(event);
        }}
        onError={(event) => {
          setResult({ source: sourceKey, state: "error" });
          onError?.(event);
        }}
      />
    </span>
  );
});
