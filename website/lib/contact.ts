import { contactInfo } from "@/data/footer";

/** Digits only, with country code, as wa.me expects. First number in contactInfo is the primary line. */
export const whatsappNumber = contactInfo.phone[0].replace(/\D/g, "");

export const telHref = `tel:+${whatsappNumber}`;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productEnquiryMessage(productName: string): string {
  return `Hello Wine Friend, I would like to enquire about "${productName}".`;
}
