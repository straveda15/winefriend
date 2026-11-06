import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="wf-page-main">{children}</main>
      <Footer />
    </>
  );
}
