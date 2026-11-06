import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const inter = localFont({
  src: "../public/fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dashboard | Wine Friend",
  robots: { index: false, follow: false },
  icons: { icon: "/kamaltara-favicon.png", shortcut: "/kamaltara-favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <div className="min-h-screen bg-cream text-charcoal">{children}</div>
      </body>
    </html>
  );
}
