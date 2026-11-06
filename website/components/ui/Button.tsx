import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gold text-charcoal hover:bg-gold-muted shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent border border-gold/70 text-charcoal hover:bg-gold hover:text-charcoal",
  ghost: "bg-transparent text-charcoal hover:text-gold underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-5 py-2.5 text-[11px]",
  lg: "px-6 py-3 text-xs",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon = true,
}: ButtonProps) {
  const baseStyles = [
    "group inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-wider",
    "rounded-full transition-all duration-300 ease-out",
    variant !== "ghost" ? sizeStyles[size] : "py-0.5 text-[11px]",
    variantStyles[variant],
    className,
  ].join(" ");

  const content = (
    <>
      {children}
      {icon && (
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseStyles}>
      {content}
    </button>
  );
}
