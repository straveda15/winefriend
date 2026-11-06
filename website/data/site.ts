import type { SiteConfig } from "@winefriend/shared/types";

export const siteConfig: SiteConfig = {
  name: "Kamaltara Enterprises",
  tagline: "Always in All Ways for Wine Lovers",
  description:
    "Wine Friend is a registered trademark of Nashik-based Kamaltara Enterprises, owned and operated by Manoj Jagtap. The company manufactures and imports wine-related products and arranges winery visits and curated tours in Nashik Valley.",
};

/**
 * Dedicated tour website. Set NEXT_PUBLIC_TOUR_SITE_URL (e.g. https://example.com) and the
 * Wine Tours page shows a link to it; leave it unset to hide the link.
 */
export const tourWebsiteUrl = process.env.NEXT_PUBLIC_TOUR_SITE_URL || undefined;
