import type { JournalArticle } from "@winefriend/shared/types";

/** Bundled stories keep the homepage journal preview available if the API is empty. */
export const journalPreviewFallback: JournalArticle[] = [
  {
    id: "seed-sulafest",
    title: "The Wine Friend at SulaFest 2025",
    slug: "stories-from-the-world-of-wine",
    excerpt:
      "At SulaFest, Wine Friend presented wine accessories and met wine lovers at Sula Vineyards.",
    content:
      "At SulaFest, Wine Friend presented wine accessories and met wine lovers at Sula Vineyards.",
    image: "/images/journal/indian-wine-experience.webp",
    category: "Wine events",
    date: "2025-02-02",
    featured: true,
    published: true,
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "seed-wineout",
    title: "The Bandra WINEOUT 2025",
    slug: "the-bandra-wineout-2025",
    excerpt:
      "Manoj Jagtap attended the Wine Out festival in Bandra to meet wine enthusiasts and taste wines from Indian producers.",
    content:
      "Manoj Jagtap attended the Wine Out festival in Bandra to meet wine enthusiasts and taste wines from Indian producers.",
    image: "/images/journal/bandra-wineout-2025.svg",
    category: "Wine events",
    date: "2025-02-15",
    featured: false,
    published: true,
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "seed-grape-harvest",
    title: "A Grape Harvesting Adventure",
    slug: "a-grape-harvesting-adventure",
    excerpt:
      "A visit near Nashik brought a closer look at vineyards, winemaking, and the Cabernet Sauvignon harvest.",
    content:
      "A visit near Nashik brought a closer look at vineyards, winemaking, and the Cabernet Sauvignon harvest.",
    image: "/images/journal/grape-harvest.webp",
    category: "Tours & harvest",
    date: "2025-01-10",
    featured: false,
    published: true,
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
];
