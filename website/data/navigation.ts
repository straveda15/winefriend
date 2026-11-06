import type { NavItem } from "@winefriend/shared/types";

export const navigationItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Wine Accessories", href: "/products#accessories" },
      { label: "Wine Storage", href: "/products#storage" },
      { label: "Bar Furniture", href: "/products#furniture" },
    ],
  },
  { label: "Business Solutions", href: "/business-solutions" },
  { label: "Wine Tours & Experiences", href: "/wine-tours" },
  { label: "Wine Journal", href: "/journal" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];
