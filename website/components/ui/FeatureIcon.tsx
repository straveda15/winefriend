import { Building2, Palette, Users, Wine } from "lucide-react";
import type { AboutPillar } from "@winefriend/shared/types";

const iconMap: Record<string, React.ElementType> = {
  building: Building2,
  palette: Palette,
  users: Users,
  wine: Wine,
};

interface FeatureIconProps {
  pillar: AboutPillar;
  horizontalMobile?: boolean;
}

export function FeatureIcon({ pillar, horizontalMobile = false }: FeatureIconProps) {
  const Icon = iconMap[pillar.icon] || Wine;

  return (
    <div className={`wf-about-pillar group flex flex-col items-start text-left gap-4 p-4 sm:p-5 transition-colors duration-300${horizontalMobile ? " wf-about-pillar--horizontal-mobile" : ""}`}>
      <div className="wf-about-pillar-icon flex items-center justify-center transition-colors duration-300">
        <Icon className="w-5 h-5 text-burgundy transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="wf-about-pillar-content">
        <p className="font-serif text-sm sm:text-base font-medium text-charcoal leading-snug">
          {pillar.title}
        </p>
        {pillar.description && (
          <p className="wf-about-pillar-description mt-2 font-sans text-xs leading-relaxed text-charcoal-light">
            {pillar.description}
          </p>
        )}
      </div>
    </div>
  );
}
