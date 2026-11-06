/** Shared Tailwind class strings so the admin screens stay visually consistent. */

export const card = "rounded-xl border border-gold/25 bg-white shadow-[0_6px_24px_rgb(50_42_27/6%)]";

export const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-light";

export const input =
  "mt-1.5 block w-full rounded-lg border border-gold/40 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-slate/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:opacity-60";

export const hint = "mt-1.5 text-xs leading-relaxed text-slate";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-4";

export const buttonPrimary = `${buttonBase} bg-gold text-charcoal hover:bg-[#d4aa4d]`;
export const buttonGhost = `${buttonBase} border border-gold/50 text-charcoal hover:bg-gold-muted/60`;
export const buttonDanger = `${buttonBase} border border-[#a33a2e]/40 text-[#8c2f25] hover:bg-[#a33a2e]/10`;

export const badge = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold";
export const badgeGreen = `${badge} bg-[#1f8f4e]/12 text-[#17703d]`;
export const badgeAmber = `${badge} bg-gold/20 text-[#7a5a1c]`;
export const badgeGrey = `${badge} bg-charcoal/8 text-charcoal-light`;
