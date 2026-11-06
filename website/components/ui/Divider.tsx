interface DividerProps {
  className?: string;
  variant?: "line" | "diamond";
}

export function Divider({ className = "", variant = "line" }: DividerProps) {
  if (variant === "diamond") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <div className="w-12 h-px bg-gold" />
        <div className="w-2 h-2 rotate-45 bg-gold" />
        <div className="w-12 h-px bg-gold" />
      </div>
    );
  }

  return <div className={`w-20 h-px bg-gold mx-auto ${className}`} />;
}
