import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { BrandLogo } from "@/components/BrandLogo";
import { backendStatus, getAdminSession } from "@/lib/auth";
import { card } from "@/components/ui";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <div className={`${card} p-7 sm:p-9`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#805f23]">Admin panel</p>
          <h1 className="mb-6 mt-2 font-serif text-3xl font-medium tracking-tight">Sign in</h1>
          <Suspense fallback={<div className="h-56" aria-busy="true" />}>
            <LoginGate />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-slate">Authorised users only.</p>
      </div>
    </main>
  );
}

async function LoginGate() {
  if (await getAdminSession()) redirect("/");
  const status = await backendStatus();

  return (
    <>
      {status === "offline" && (
        <p role="alert" className="mb-5 rounded-lg border border-[#a33a2e]/30 bg-[#a33a2e]/8 px-4 py-3 text-sm text-[#7d2b22]">
          Cannot reach the backend. Start it with <code>npm run dev:backend</code> (or check <code>BACKEND_URL</code>), then reload this page.
        </p>
      )}
      {status === "unconfigured" && (
        <p role="alert" className="mb-5 rounded-lg border border-gold/50 bg-gold/15 px-4 py-3 text-sm text-[#5d4513]">
          Login is not configured yet. Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> in the
          backend&apos;s environment, then restart the backend.
        </p>
      )}
      <LoginForm />
    </>
  );
}
