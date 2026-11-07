"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { MapPin, Phone, Clock3 } from "lucide-react";
import { Container } from "./Container";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { exploreLinks, serviceLinks, contactInfo, socialLinks, legalLinks } from "@/data/footer";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { mapHref } from "@/lib/contact";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  // Use a static year to avoid Next.js prerendering issues with dynamic values
  const currentYear = 2026;

  useGSAP(() => {
    const footer = footerRef.current;
    if (!footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const columns = footer.querySelectorAll<HTMLElement>(".wf-footer-main > *");
    const bottomBar = footer.querySelector<HTMLElement>(".wf-footer-bottom");
    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 92%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });
    reveal.fromTo(columns, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .65, stagger: .1 });
    if (bottomBar) reveal.fromTo(bottomBar, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45 }, "-=.25");
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="wf-footer bg-[#24211D] text-white pt-5 lg:pt-6 pb-2">
      <GrapevineDecoration className="wf-vine wf-vine--bottom-left wf-vine--footer" variant="champagne" />
      <Container className="wf-botanical-content">
        <div className="wf-footer-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.35fr_.85fr_.7fr_1.6fr] gap-5 lg:gap-6 mb-5">
          {/* Brand */}
          <div>
            <BrandLogo inverse />
            <SocialIcons links={socialLinks} email={contactInfo.email} className="mt-4" />
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-sm text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Services
            </h4>
            <nav className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-sm text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Contact Us
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open The WineFriend location in Google Maps"
                  className="wf-footer-contact-copy whitespace-pre-line text-sm text-white/50 transition-colors hover:text-white"
                >
                  {contactInfo.location}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div className="wf-footer-contact-copy flex flex-col gap-1">
                  {contactInfo.contactPerson && <span className="text-xs text-white/70">{contactInfo.contactPerson}</span>}
                  {contactInfo.phone.map((num) => (
                    <a key={num} href={`tel:${num.replace(/\s/g, "")}`} className="text-sm text-white/50 hover:text-white transition-colors">
                      {num}
                    </a>
                  ))}
                </div>
              </div>
              {contactInfo.hours && (
                <div className="flex items-start gap-3">
                  <Clock3 className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span className="wf-footer-contact-copy text-xs text-white/50">{contactInfo.hours}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="wf-footer-bottom border-t border-white/10 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30 font-sans">
            &copy; {currentYear} WineFriend<sup className="wf-trademark-inline" aria-hidden="true">™</sup>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <span
                key={link.label}
                className="text-xs text-white/30 font-sans"
                aria-disabled="true"
              >
                {link.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
