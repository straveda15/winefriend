import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Site-wide WhatsApp shortcut, using the WhatsApp logo. */
export function WhatsAppFloat() {
  return (
    <WhatsAppLink
      className="wf-whatsapp-float"
      message="Hello Wine Friend, I would like to know more."
      aria-label="Chat with Wine Friend on WhatsApp"
    >
      <WhatsAppIcon />
    </WhatsAppLink>
  );
}
