import type { FooterLink, ContactInfo, SocialLink } from "@winefriend/shared/types";

export const exploreLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const serviceLinks: FooterLink[] = [
  { label: "Business Solutions", href: "/business-solutions" },
  { label: "Wine Tours", href: "/wine-tours" },
  { label: "Wine Journal", href: "/journal" },
];

export const contactInfo: ContactInfo = {
  location: "The WineFriend, A-130, 4th Floor, Business Index\nMakhmalabad Road, near Dream Castle Road\nPanchavati, Nashik, Maharashtra 422003, India",
  phone: ["+91 98224 39051", "+91 75075 55595"],
  email: "winefriend907@gmail.com",
  contactPerson: "Manoj Jagtap",
  hours: "Monday–Saturday, 9:00–21:00",
};

export const socialLinks: SocialLink[] = [
  { platform: "Facebook", href: "https://www.facebook.com/nashikwinetours/", icon: "facebook" },
  { platform: "Instagram", href: "https://www.instagram.com/nashikwinetours/", icon: "instagram" },
  { platform: "YouTube", href: "https://www.youtube.com/@nashikwinetours", icon: "youtube" },
];

export const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
