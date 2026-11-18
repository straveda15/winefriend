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
  const enquiryCounts = { total: enquiries.length, new: newEnquiries, handled: enquiries.length - newEnquiries };

  return (
    <div className="min-h-screen xl:grid xl:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="min-w-0 bg-[#24211d] p-3 text-[#f5efe3] sm:p-4 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:p-5">
        <div className="mb-4 flex min-w-0 items-center justify-between gap-2 sm:gap-3 xl:mb-8 xl:block">
          <BrandLogo compact />
          <form action={logoutAction} className="shrink-0 xl:hidden">
            <button type="submit" className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-[#f5efe3]/80 hover:bg-white/10 sm:gap-2 sm:px-3 sm:text-sm">
              <LogOut className="size-4" aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
        <AdminNav newEnquiries={newEnquiries} />
        <div className="mt-auto hidden border-t border-white/10 pt-4 xl:block">
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
      <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 xl:py-10">
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}
