import type { Category } from "@winefriend/shared/types";

export const categories: Category[] = [
  {
    id: "wine-products",
    title: "Wine Products & Accessories",
    description:
      "Wine and champagne corks, openers, glasses, decanters, preservation systems, bottle holders, wooden, acrylic and stainless-steel racks, wine-barrel furniture, and promotional materials.",
    image: "/images/categories/wine-accessories-display.webp",
    ctaText: "Explore Products",
    ctaHref: "/products",
  },
  {
    id: "business-solutions",
    title: "Business & Custom Solutions",
    description:
      "Kamaltara Enterprises manufactures and imports wine-related products, with customisation to client specifications and market trends.",
    image: "/images/categories/business-wine-gifting.webp",
    ctaText: "Partner With Us",
      ctaHref: "/business-solutions",
  },
  {
    id: "wine-tours",
    title: "Wine Tours & Experiences",
    description:
      "Curated winery visits and wine tours offer a way to explore the vineyards and wine country of Nashik Valley.",
    image: "/images/categories/nashik-countryside.webp",
    ctaText: "Explore Experiences",
    ctaHref: "/wine-tours",
  },
];
