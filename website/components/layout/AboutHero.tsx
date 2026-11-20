import { ArrowDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export function AboutHero() {
  return (
    <section className="wf-about-hero wf-section">
      <Container className="wf-about-hero-content">
        <p className="wf-about-hero-kicker">About Us</p>
        <h1 className="wf-about-hero-title">
          <span className="wf-about-hero-title-desktop">More Than a Business.<br />A Passion for Everything Wine.</span>
          <span className="wf-about-hero-title-mobile">More Than a<br />Business. A Passion<br />for Everything Wine.</span>
        </h1>
        <p className="wf-about-hero-copy">
          Wine Friend, a brand of Kamaltara Enterprises, brings together wine accessories,
          thoughtful craftsmanship and wine experiences. Rooted in Nashik, India’s wine
          country, our journey is driven by a simple philosophy: making every wine
          experience more meaningful.
        </p>
        <div className="wf-about-hero-actions">
          <Button href="/about#founder-story" variant="primary" icon={false} className="wf-about-hero-primary">
            Our Journey <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button href="/products" variant="secondary" className="wf-about-hero-secondary">
            Explore Products
          </Button>
        </div>
      </Container>
    </section>
  );
}
