/** Client-safe constants shared by the public site and the admin panel. */

export const PRODUCT_CATEGORIES = [
  { id: "accessories", label: "Wine Accessories" },
  { id: "storage", label: "Wine Storage" },
  { id: "furniture", label: "Bar Furniture" },
  { id: "glassware", label: "Glassware" },
  { id: "gifting", label: "Gifting & Promotional" },
] as const;

export const BLOG_CATEGORIES = [
  "People & company",
  "Tours & harvest",
  "Wine events",
  "Updates",
] as const;

export const ENQUIRY_TOPICS = [
  "Products and customisation",
  "Business enquiry",
  "Nashik winery tours",
  "Other",
] as const;

export const MAX_PRODUCT_IMAGES = 8;
/** Number of products the catalogue is planned around. Shown as guidance in the admin, not enforced. */
export const PLANNED_PRODUCT_COUNT = 30;

export function categoryLabel(id: string): string {
  return PRODUCT_CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

export function formatPrice(price: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(price)}`;
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

/** Same-origin path for an image that an admin uploaded (as opposed to a file bundled in /public). */
export const UPLOAD_PREFIX = "/uploads/";
