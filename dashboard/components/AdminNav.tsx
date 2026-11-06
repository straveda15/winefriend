"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutDashboard, Newspaper, Package } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/products", label: "Products", icon: Package },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/enquiries", label: "Enquiries", icon: Inbox },
];

export function AdminNav({ newEnquiries }: { newEnquiries: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-gold text-charcoal font-semibold" : "text-[#f5efe3]/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="size-[1.1rem]" aria-hidden="true" />
            {label}
            {label === "Enquiries" && newEnquiries > 0 && (
              <span className="ml-auto rounded-full bg-[#a33a2e] px-2 py-0.5 text-[11px] font-semibold text-white">{newEnquiries}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
