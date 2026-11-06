"use client";

import { startTransition, useActionState, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginAction } from "@/app/actions";
import { buttonPrimary, input, label } from "@/components/ui";
import { useHydrated } from "@winefriend/shared/use-hydrated";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  const ready = useHydrated();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <div>
        <label className={label} htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus value={email} onChange={(event) => setEmail(event.target.value)} className={input} />
      </div>
      <div>
        <label className={label} htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${input} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-lg text-slate hover:text-charcoal focus-visible:outline-2 focus-visible:outline-gold"
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg border border-[#a33a2e]/30 bg-[#a33a2e]/8 px-4 py-3 text-sm text-[#7d2b22]">{state.error}</p>
      )}
      <button type="submit" disabled={pending || !ready} className={`${buttonPrimary} w-full py-3`}>
        <LogIn /> {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
