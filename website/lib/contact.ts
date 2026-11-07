import { contactInfo } from "@/data/footer";

/** Digits only, with country code. First number in contactInfo is the primary WhatsApp line. */
export const whatsappNumber = contactInfo.phone[0].replace(/\D/g, "");

export const telHref = `tel:+${whatsappNumber}`;

/** Shared address search used by both the contact page and footer. */
export const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.location.replace(/\s+/g, " "))}`;

function query(message?: string): string {
  const params = new URLSearchParams({ phone: whatsappNumber });
  if (message) params.set("text", message);
  return params.toString();
}

/**
 * Link that works everywhere without JavaScript. api.whatsapp.com opens the app on phones and,
 * where the app is missing, offers WhatsApp Web instead of only the download page (as wa.me can).
 */
export function whatsappLink(message?: string): string {
  return `https://api.whatsapp.com/send?${query(message)}&type=phone_number&app_absent=0`;
}

/** Desktop browsers: open WhatsApp Web directly, so visitors are never sent to the download page. */
export function whatsappWebLink(message?: string): string {
  return `https://web.whatsapp.com/send?${query(message)}&type=phone_number&app_absent=0`;
}

export function productEnquiryMessage(productName: string): string {
  return `Hello Wine Friend, I would like to enquire about "${productName}".`;
}
