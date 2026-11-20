import { Building2, Grape, Handshake, Mountain, Package, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";
import { Img } from "@/components/ui/Img";

const milestones: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "The First Spark",
    description: "A corkscrew inspired Manoj to start developing wine accessories.",
    icon: Package,
  },
  {
    title: "Wine Solutions",
    description: "Kamaltara Enterprises manufactures, imports and customises wine products.",
    icon: Building2,
  },
  {
    title: "Growing Connections",
    description: "Serving businesses and individual wine enthusiasts with thoughtful products.",
    icon: Handshake,
  },
  {
    title: "Nashik Experiences",
    description: "Curated winery visits and small-group tours across Nashik Valley.",
    icon: Grape,
  },
  {
    title: "Today & Beyond",
    description: "Bringing wine accessories and wine experiences together under Wine Friend.",
    icon: Mountain,
  },
];

export function AboutFounderJourney() {
  return (
    <section id="founder-story" className="wf-section wf-about-founder-journey">
      <GrapevineDecoration className="wf-vine wf-vine--about-founder" variant="olive" />
      <Container className="wf-about-founder-journey-content">
        <div className="wf-about-founder-journey-grid">
          <div className="wf-about-founder-panel">
            <h2 className="wf-about-founder-title">The Founder Behind the Brand</h2>
            <div className="wf-about-founder-story">
              <figure className="wf-about-founder-photo">
                <Img
                  src="/images/about/founder.jpg"
                  alt="Wine Friend founder Manoj Jagtap"
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 40vw, 25vw"
                  className="wf-about-founder-image object-contain"
                />
              </figure>
              <div className="wf-about-founder-copy">
                <h3>The Vision Behind Wine Friend</h3>
                <p>
                  Wine Friend began with founder Manoj Jagtap’s work in wine sales and a corkscrew
                  that sparked an idea for practical wine accessories. Conversations with customers
                  later led to curated Nashik Valley winery visits.
                </p>
              </div>
            </div>
          </div>

          <div id="our-journey" className="wf-about-journey-panel">
            <h2 className="wf-about-journey-title">Our Journey</h2>
            <ol className="wf-about-journey-list">
              {milestones.map(({ title, description, icon: Icon }) => (
                <li className="wf-about-journey-item" key={title}>
                  <span className="wf-about-journey-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
