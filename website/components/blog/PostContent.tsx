import type { ReactNode } from "react";

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

export function PostContent({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="wf-prose">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.startsWith("### ")) return <h3 key={key}>{inline(block.slice(4), key)}</h3>;
        if (block.startsWith("## ")) return <h2 key={key}>{inline(block.slice(3), key)}</h2>;

        const rows = block.split("\n");
        if (rows.every((row) => row.startsWith("- "))) {
          return (
            <ul key={key}>
              {rows.map((row, i) => (
                <li key={`${key}-${i}`}>{inline(row.slice(2), `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={key}>
            {rows.map((row, i) => (
              <span key={`${key}-${i}`}>
                {i > 0 && <br />}
                {inline(row, `${key}-${i}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
