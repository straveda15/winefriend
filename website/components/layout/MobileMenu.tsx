"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { navigationItems } from "@/data/navigation";
import { gsap } from "gsap";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeHref?: string;
  onNavigate: (href: string) => void;
}

export function MobileMenu({ isOpen, onClose, activeHref, onNavigate }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const context = gsap.context(() => {
        gsap.fromTo(
          ".mobile-nav-link",
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.055,
            ease: "power2.out",
            delay: 0.12,
          }
        );
      }, menuRef);
      return () => context.revert();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      id="wf-mobile-menu"
      ref={menuRef}
      className={`wf-mobile-menu fixed inset-0 z-40 transition-all duration-500 xl:hidden ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div className="wf-mobile-menu-inner flex flex-col items-center justify-center h-full gap-5 px-8 pt-20">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            scroll={item.href !== "/contact"}
            onClick={() => {
              onNavigate(item.href);
              onClose();
            }}
            aria-current={activeHref === item.href ? "page" : undefined}
            className={`mobile-nav-link wf-mobile-nav-link wf-mobile-nav-tours font-serif font-normal text-charcoal hover:text-gold transition-colors ${
              activeHref === item.href ? "wf-mobile-nav-link-active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
