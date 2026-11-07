interface SectionHeadingProps {
  kicker?: string;
  heading: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  kicker,
  heading,
  description,
  align = "center",
  light = false,
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const textColor = light ? "text-white" : "text-charcoal";
  const subtextColor = light ? "text-white/80" : "text-charcoal-light";

  return (
    <div className={`${alignClass} ${className}`}>
      {kicker && (
        <p
          className={`wf-discover-kicker text-[13px] font-sans font-semibold uppercase tracking-[0.15em] mb-2 ${
            "text-burgundy"
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`font-serif text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-tight ${textColor}`}
      >
        {heading}
      </h2>
      {description && (
        <p
        className={`wf-discover-description mt-3 text-sm font-sans leading-relaxed max-w-xl ${
            align === "center" ? "mx-auto" : ""
          } ${subtextColor}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
