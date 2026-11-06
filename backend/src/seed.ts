import type { JournalArticle, Product } from "@winefriend/shared/types";

/**
 * Initial content, written to the data store the first time it is read.
 * After that, products and blog posts are managed from the admin panel.
 */

const seededAt = "2025-01-01T00:00:00.000Z";

export const seedProducts: Product[] = [
  {
    id: "seed-wine-bottle-holder",
    name: "Wine Bottle Holder",
    slug: "wine-bottle-holder",
    category: "accessories",
    shortDescription: "Bottle holders in the Credle and Banana Stand designs.",
    description:
      "Display and serve wine with a bottle holder that doubles as a table centrepiece. The range includes the Credle and Banana Stand designs.",
    images: ["/images/serving/bottleholder.png"],
    features: ["Credle design", "Banana Stand design", "Customisation available"],
    featured: true,
    published: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "seed-wine-decanter",
    name: "Wine Decanter",
    slug: "wine-decanter",
    category: "accessories",
    shortDescription: "Decanters from the Kamaltara Enterprises wine accessory range.",
    description:
      "Decanters are part of Kamaltara Enterprises' wine accessory range, made to let a wine open up before it is poured.",
    images: ["/images/serving/Decane.png"],
    features: ["Part of the Wine Friend accessory range", "Customisation available"],
    featured: true,
    published: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "seed-wine-rack",
    name: "Wine Rack",
    slug: "wine-rack",
    category: "storage",
    shortDescription: "Iron racks and wooden, acrylic and stainless-steel stands.",
    description:
      "Store and display bottles with iron racks and wooden, acrylic and stainless-steel wine stands and racks.",
    images: ["/images/serving/bottlerack.png"],
    features: ["Iron racks", "Wooden, acrylic and stainless-steel stands", "Customisation available"],
    featured: true,
    published: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "seed-corkscrew",
    name: "Corkscrew",
    slug: "corkscrew",
    category: "accessories",
    shortDescription: "Kamaltara's plastic T-type corkscrew.",
    description: "Wine openers include Kamaltara's plastic T-type corkscrew, a simple everyday opener.",
    images: ["/images/serving/corkscrew.png"],
    features: ["Plastic T-type design", "Customisation available"],
    featured: false,
    published: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "seed-wine-stopper",
    name: "Wine Stopper",
    slug: "wine-stopper",
    category: "accessories",
    shortDescription: "Cork, wooden, tapered-cork and plastic PVC bottle stoppers.",
    description: "Keep an opened bottle fresh with cork, wooden, tapered-cork and plastic PVC bottle stoppers.",
    images: ["/images/serving/stopper.png"],
    features: ["Cork", "Wooden", "Tapered cork", "Plastic PVC"],
    featured: false,
    published: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "seed-barrel-furniture",
    name: "Barrel Furniture",
    slug: "barrel-furniture",
    category: "furniture",
    shortDescription: "Furniture crafted from used oak wine barrels.",
    description:
      "Wine-barrel furniture is made from used oak barrels, including tasting tables. Oak wine barrels are also offered.",
    images: ["/images/serving/Rustic Barrel Wine Tasting Table.png"],
    features: ["Made from used oak barrels", "Tasting tables", "Oak wine barrels also available"],
    featured: false,
    published: true,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
];

export const seedPosts: JournalArticle[] = [
  {
    id: "seed-sulafest",
    title: "The Wine Friend at SulaFest 2025",
    slug: "stories-from-the-world-of-wine",
    excerpt:
      "At SulaFest on 1–2 February 2025, Wine Friend presented corks, corkscrews, bottle holders, barrel furniture, glassware, decanters, and preservation tools at Sula Vineyards.",
    content:
      "At SulaFest on 1–2 February 2025, Wine Friend presented corks, corkscrews, bottle holders, barrel furniture, glassware, decanters, and preservation tools at Sula Vineyards.",
    image: "/images/journal/indian-wine-experience.webp",
    category: "Wine events",
    date: "2025-02-02",
    featured: true,
    published: true,
    updatedAt: seededAt,
  },
  {
    id: "seed-indian-wine-experience",
    title: "Behind the Indian Wine Experience",
    slug: "behind-the-indian-wine-experience",
    excerpt:
      "A conversation with founder Manoj Jagtap about his journey from beverage sales and wine accessories to organising winery visits and wine tours.",
    content:
      "A conversation with founder Manoj Jagtap about his journey from beverage sales and wine accessories to organising winery visits and wine tours.",
    image: "/images/experiences/vineyard-landscape.webp",
    category: "People & company",
    date: "2025-01-20",
    featured: false,
    published: true,
    updatedAt: seededAt,
  },
  {
    id: "seed-conversation",
    title: "A Conversation That Needed to Happen",
    slug: "a-conversation-that-needed-to-happen",
    excerpt:
      "A WineFriend journal feature about the story of wine tourism in India, framed by a conversation between Hansraj Ahuja and Manoj Jagtap.",
    content:
      "A WineFriend journal feature about the story of wine tourism in India, framed by a conversation between Hansraj Ahuja and Manoj Jagtap.",
    image: "/images/journal/indian-wine-experience.webp",
    category: "People & company",
    date: "2025-01-15",
    featured: false,
    published: true,
    updatedAt: seededAt,
  },
  {
    id: "seed-grape-harvest",
    title: "A Grape Harvesting Adventure",
    slug: "a-grape-harvesting-adventure",
    excerpt:
      "Manoj Jagtap joined architect Chirag Mody and family near Nashik to visit vineyards, learn about winemaking, and take part in a Cabernet Sauvignon grape harvest.",
    content:
      "Manoj Jagtap joined architect Chirag Mody and family near Nashik to visit vineyards, learn about winemaking, and take part in a Cabernet Sauvignon grape harvest.",
    image: "/images/journal/grape-harvest.webp",
    category: "Tours & harvest",
    date: "2025-01-10",
    featured: false,
    published: true,
    updatedAt: seededAt,
  },
  {
    id: "seed-brian-singh",
    title: "Exploring Nashik Wine Country with YouTuber Brian Singh",
    slug: "nashik-the-wine-capital-of-india",
    excerpt:
      "Nashik Wine Tours arranged a personalised winery visit for Brian Singh, with tastings and a look at the region’s wine industry.",
    content:
      "Nashik Wine Tours arranged a personalised winery visit for Brian Singh, with tastings and a look at the region’s wine industry.",
    image: "/images/categories/nashik-countryside.webp",
    category: "Tours & harvest",
    date: "2025-01-05",
    featured: false,
    published: true,
    updatedAt: seededAt,
  },
  {
    id: "seed-wineout",
    title: "The Bandra WINEOUT 2025",
    slug: "the-bandra-wineout-2025",
    excerpt:
      "Manoj Jagtap attended the Wine Out festival in Bandra on 15 February 2025 to meet wine enthusiasts and taste wines from Indian producers.",
    content:
      "Manoj Jagtap attended the Wine Out festival in Bandra on 15 February 2025 to meet wine enthusiasts and taste wines from Indian producers.",
    image: "/images/journal/indian-wine-experience.webp",
    category: "Wine events",
    date: "2025-02-15",
    featured: false,
    published: true,
    updatedAt: seededAt,
  },
];
