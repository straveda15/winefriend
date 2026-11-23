"use client";

import { useState } from "react";
import { JournalImage } from "@/components/ui/JournalImage";

export function ArticleImageFrame({ image, alt, sizes, matchFrame = false }: { image: string; alt: string; sizes: string; matchFrame?: boolean }) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [imageFit, setImageFit] = useState<"contain" | "cover">("contain");

  return (
    <figure className="wf-article-image-frame" style={aspectRatio ? { aspectRatio } : undefined}>
      <JournalImage
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        style={{ objectFit: imageFit }}
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (naturalWidth > 0 && naturalHeight > 0) {
            const ratio = naturalWidth / naturalHeight;
            if (matchFrame) setImageFit(ratio >= 1.2 ? "cover" : "contain");
            else setAspectRatio(ratio);
          }
        }}
      />
    </figure>
  );
}
