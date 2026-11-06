"use client";

import type { MouseEvent, ReactNode } from "react";
import { whatsappLink, whatsappWebLink } from "@/lib/contact";

interface WhatsAppLinkProps {
  message?: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** WhatsApp chat link: app on phones, WhatsApp Web on desktop. Falls back to a plain link without JavaScript. */
export function WhatsAppLink({ message, className, children, "aria-label": ariaLabel }: WhatsAppLinkProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isDesktop) return;
    event.preventDefault();
    window.open(whatsappWebLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <a className={className} href={whatsappLink(message)} target="_blank" rel="noreferrer" aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  );
}
