import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

/** Site-wide WhatsApp shortcut. */
export function WhatsAppFloat() {
  return (
    <a
      className="wf-whatsapp-float"
      href={whatsappLink("Hello Wine Friend, I would like to know more.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Wine Friend on WhatsApp"
    >
      <MessageCircle aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
