import { Building2, Grape, Users, Wine } from "lucide-react";
import type { AboutPillar } from "@winefriend/shared/types";

const iconMap: Record<string, React.ElementType> = {
  building: Building2,
  palette: Grape,
  users: Users,
  wine: Wine,
};

interface FeatureIconProps {
  pillar: AboutPillar;
}

export function FeatureIcon({ pillar }: FeatureIconProps) {
  const Icon = iconMap[pillar.icon] || Wine;

  return (
    <div className="wf-about-pillar">
      <div className="wf-about-pillar-heading">
        <div className="wf-about-pillar-icon flex items-center justify-center">
          <Icon className="w-8 h-8 text-burgundy" />
        </div>
        <p className="wf-about-pillar-title font-serif font-medium text-charcoal leading-snug">
          {pillar.title}
        </p>
      </div>
      {pillar.description && (
        <p className="wf-about-pillar-description font-sans text-charcoal-light">
          {pillar.description}
        </p>
      )}
    </div>
  );
}
