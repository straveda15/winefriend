import type { ReactNode } from "react";
import { ArticleImageFrame } from "@/components/blog/ArticleImageFrame";
import { toYouTubeEmbedUrl } from "@winefriend/shared/youtube";

/**
 * Renders the lightweight article format used by the admin editor:
 *   blank line   → new paragraph
 *   "## Heading" → section heading        "### Heading" → sub-heading
 *   "- item"     → bullet list            **bold**, *italic*, [text](https://link)
 * Output is built from React elements only, so article text can never inject HTML.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((?:https?:\/\/|mailto:|\/)[^)\s]*\))/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a key={key} href={link[2]} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function ArticleImageGroup({ images, title, startIndex }: { images: string[]; title: string; startIndex: number }) {
  const layout = images.length === 1 ? "single" : "pair";

  return (
    <div className={`wf-article-image-layout wf-article-image-layout--${layout}`}>
      {images.map((image, index) => (
        <ArticleImageFrame
          key={`${image}-${index}`}
          image={image}
          alt={`${title} photo ${startIndex + index + 2}`}
          sizes={layout === "pair" ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 1023px) 100vw, 80vw"}
          matchFrame={layout === "pair"}
        />
      ))}
    </div>
  );
}

function ArticleVideoGroup({ videos, title }: { videos: string[]; title: string }) {
  const validVideos = videos.map((video) => toYouTubeEmbedUrl(video)).filter((video): video is string => Boolean(video));
  if (validVideos.length === 0) return null;

  return (
    <div className="wf-article-video-layout">
      {validVideos.map((video, index) => (
        <div key={`${video}-${index}`} className="wf-article-video-frame">
          <iframe
            src={video}
            title={`${title} video ${index + 1}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}

export function PostContent({ content, images = [], videos = [], title = "Article" }: { content: string; images?: string[]; videos?: string[]; title?: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const imageGroups: string[][] = [];
  let imageIndex = 0;
  while (imageIndex < images.length) {
    const group = images.slice(imageIndex, imageIndex + 2);
    imageGroups.push(group);
    imageIndex += group.length;
  }
  const contentWithImages: ReactNode[] = [];
  let previousImageGroupCount = 0;
  let imageOffset = 0;
  const imageSlots = blocks.reduce<number[]>((slots, block, index) => {
    if (!block.startsWith("## ") && !block.startsWith("### ")) slots.push(index);
    return slots;
  }, []);

  blocks.forEach((block, index) => {
    const key = `block-${index}`;
    let element: ReactNode;
    if (block.startsWith("### ")) element = <h3 key={key}>{inline(block.slice(4), key)}</h3>;
    else if (block.startsWith("## ")) element = <h2 key={key}>{inline(block.slice(3), key)}</h2>;
    else {
      const rows = block.split("\n");
      if (rows.every((row) => row.startsWith("- "))) {
        element = (
          <ul key={key}>
            {rows.map((row, i) => (
              <li key={`${key}-${i}`}>{inline(row.slice(2), `${key}-${i}`)}</li>
            ))}
          </ul>
        );
      } else {
        element = (
          <p key={key}>
            {rows.map((row, i) => (
              <span key={`${key}-${i}`}>
                {i > 0 && <br />}
                {inline(row, `${key}-${i}`)}
              </span>
            ))}
          </p>
        );
      }
    }

    contentWithImages.push(element);
    const slot = imageSlots.indexOf(index);
    const imageGroupCount = slot < 0
      ? previousImageGroupCount
      : Math.ceil(((slot + 1) * imageGroups.length) / imageSlots.length);
    for (let group = previousImageGroupCount; group < imageGroupCount; group += 1) {
      const groupImages = imageGroups[group];
      contentWithImages.push(<ArticleImageGroup key={`article-images-${group}`} images={groupImages} title={title} startIndex={imageOffset} />);
      imageOffset += groupImages.length;
    }
    previousImageGroupCount = imageGroupCount;
  });

  for (let group = previousImageGroupCount; group < imageGroups.length; group += 1) {
    const groupImages = imageGroups[group];
    contentWithImages.push(<ArticleImageGroup key={`article-images-${group}`} images={groupImages} title={title} startIndex={imageOffset} />);
    imageOffset += groupImages.length;
  }

  return (
    <div className="wf-prose">
      {contentWithImages}
      <ArticleVideoGroup videos={videos} title={title} />
    </div>
  );
}
