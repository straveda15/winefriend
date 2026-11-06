import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { TextReveal } from "@/components/animations/TextReveal";

interface EditorialPageHeroProps {
  kicker: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function EditorialPageHero({ kicker, title, description, image, imageAlt }: EditorialPageHeroProps) {
  return (
    <section className="wf-page-hero wf-section bg-ivory">
      <Container className="wf-page-hero-grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="wf-page-hero-copy">
          <TextReveal><p className="wf-collection-kicker">{kicker}</p></TextReveal>
          <TextReveal delay={.1}><h1 className="wf-page-title">{title}</h1></TextReveal>
          <TextReveal delay={.2}><p className="wf-page-lede">{description}</p></TextReveal>
        </div>
        <ImageReveal direction="left" className="wf-page-hero-image relative overflow-hidden">
          <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        </ImageReveal>
      </Container>
    </section>
  );
}
