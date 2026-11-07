"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { MobileMenu } from "./MobileMenu";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  const activeHref = navigationItems.find((item) => {
    const [itemPath, itemHash] = item.href.split("#");
    const normalizedItemPath = itemPath || "/";
    const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

    if (normalizedItemPath !== normalizedPathname) return false;
    if (itemHash) return currentHash === `#${itemHash}`;
    return normalizedPathname !== "/" || currentHash === "";
  })?.href;

  const handleNavigationClick = useCallback((href: string) => {
    const destination = new URL(href, window.location.href);
    setCurrentHash(destination.hash);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.fromTo(
        ".wf-brand",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.75 },
      );
      intro.fromTo(
        ".wf-desktop-nav a",
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 },
        "-=0.4",
      );
    },
    { scope: headerRef },
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
          ? "wf-header wf-header-scrolled py-1"
            : "wf-header wf-header-top py-1 lg:py-2"
        }`}
      >
        <Container>
          <div className="wf-header-row flex items-center justify-between">
            <BrandLogo className="wf-brand shrink-0" />

            {/* Desktop Nav */}
            <nav className="wf-desktop-nav hidden xl:flex items-center gap-7 2xl:gap-9">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavigationClick(item.href)}
                  aria-current={activeHref === item.href ? "page" : undefined}
                  className={`wf-nav-link font-serif text-[13px] 2xl:text-sm tracking-[0.015em] transition-colors relative after:absolute after:bottom-[-7px] after:left-0 after:w-0 after:h-px after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap ${
                    scrolled
                      ? "text-charcoal hover:text-gold after:bg-gold"
                      : "text-charcoal hover:text-gold after:bg-gold"
                  } ${activeHref === item.href ? "wf-nav-link-active after:w-full" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Toggle */}
            <div className="wf-header-actions flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`wf-menu-toggle xl:hidden p-2 transition-colors ${
                  "text-charcoal"
                }`}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="wf-mobile-menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobile}
        activeHref={activeHref}
        onNavigate={handleNavigationClick}
      />
    </>
  );
}
