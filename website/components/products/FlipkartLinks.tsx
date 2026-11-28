import { ExternalLink } from "lucide-react";

export function FlipkartLinks({ links }: { links?: string[] }) {
  if (!links?.length) return null;

  return (
    <div className="wf-flipkart-links" aria-label="Buy this product on Flipkart">
      {links.map((link, index) => (
        <a key={`${link}-${index}`} className="wf-action wf-action-primary" href={link} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" /> Buy on Flipkart{links.length > 1 ? ` (${index + 1})` : ""}
        </a>
      ))}
    </div>
  );
}
