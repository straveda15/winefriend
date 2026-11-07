export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  /** Price in INR. Omit when the price is not published. */
  price?: number;
  priceNote?: string;
  /** First image is the cover. */
  images: string[];
  /** Key details shown as a bullet list. */
  features: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Plain text with light formatting: blank line = paragraph, "## " = heading, "- " = list item. */
  content: string;
  /** Optional primary/cover image retained for older article records. */
  image?: string;
  /** Additional article images; images[0] is the cover when present. */
  images?: string[];
  category: string;
  /** ISO date (yyyy-mm-dd) shown as the publication date. */
  date: string;
  featured: boolean;
  published: boolean;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  product?: string;
  status: "new" | "handled";
  createdAt: string;
}

export interface AboutPillar {
  icon: string;
  title: string;
  description?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface ContactInfo {
  location: string;
  phone: string[];
  email: string;
  contactPerson?: string;
  hours?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url?: string;
}
