import { Suspense, type ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { AdminNav } from "@/components/AdminNav";
import { BrandLogo } from "@/components/BrandLogo";
import { adminEnquiries } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

/** Signed-in gate: nothing below renders unless the session cookie verifies. */
async function AdminShell({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  const enquiries = await adminEnquiries();
  const newEnquiries = enquiries.filter((item) => item.status === "new").length;

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="bg-[#24211d] p-4 text-[#f5efe3] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 lg:mb-8 lg:block">
          <BrandLogo inverse />
          <form action={logoutAction} className="lg:hidden">
            <button type="submit" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#f5efe3]/80 hover:bg-white/10">
              <LogOut className="size-4" aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
        <AdminNav newEnquiries={newEnquiries} />
        <div className="mt-auto hidden border-t border-white/10 pt-4 lg:block">
          <a href={process.env.WEBSITE_URL ?? "/"} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#f5efe3]/80 hover:bg-white/10 hover:text-white">
            <ExternalLink className="size-[1.1rem]" aria-hidden="true" /> View website
          </a>
          <p className="mt-3 truncate px-3 text-xs text-[#f5efe3]/50" title={session.sub}>{session.sub}</p>
          <form action={logoutAction}>
            <button type="submit" className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#f5efe3]/80 hover:bg-white/10 hover:text-white">
              <LogOut className="size-[1.1rem]" aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-10 lg:px-12">{children}</main>
    </div>
  );
}
