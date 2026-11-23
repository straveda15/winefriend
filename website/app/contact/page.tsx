import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactPageMotion } from "@/components/sections/ContactPageMotion";
import { contactInfo } from "@/data/footer";
import { GrapevineDecoration } from "@/components/ui/GrapevineDecoration";
import { mapHref, telHref } from "@/lib/contact";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact | Kamaltara Enterprises — Always in All Ways for the Wine Lovers",
  description:
    "Contact Manoj Jagtap at Kamaltara Enterprises in Nashik for wine accessories, product customisation, business enquiries, and winery tours.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactPageMotion>
      <main className="wf-contact-page">
        <section className="wf-contact-content">
          <GrapevineDecoration className="wf-vine wf-vine--top-left wf-vine--contact" />
          <Container className="wf-contact-grid wf-botanical-content">
            <div className="wf-contact-details">
              <p className="wf-contact-kicker">Get in touch</p>
              <h2 aria-label="We’re here to help.">
                <span className="wf-contact-title-word" aria-hidden="true">We’re</span>{" "}
                <span className="wf-contact-title-word" aria-hidden="true">here</span>{" "}
                <span className="wf-contact-title-word" aria-hidden="true">to</span>{" "}
                <span className="wf-contact-title-word" aria-hidden="true">help.</span>
              </h2>
              <p className="wf-contact-details-copy">
                Reach out directly by phone or email, or visit the Kamaltara Enterprises office in Panchavati, Nashik.
              </p>

              <div className="wf-contact-primary-row">
                <a className="wf-contact-detail" href={telHref}>
                  <span className="wf-contact-detail-icon"><Phone aria-hidden="true" /></span>
                  <span><small>Call</small>{contactInfo.phone.map((number) => <span key={number}>{number}</span>)}</span>
                </a>
                <div className="wf-contact-detail">
                  <span className="wf-contact-detail-icon"><Mail aria-hidden="true" /></span>
                  <span>
                    <small>Email</small>
                    {(contactInfo.emails ?? [contactInfo.email]).map((email) => (
                      <a
                        className="wf-contact-email-address"
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={email}
                      >
                        {email}
                      </a>
                    ))}
                  </span>
                </div>
              </div>
              <div className="wf-contact-secondary-row">
              <WhatsAppLink className="wf-contact-detail">
                <span className="wf-contact-detail-icon"><WhatsAppIcon monochrome /></span>
                <span><small>WhatsApp</small>Chat with us directly<em>Open WhatsApp ↗</em></span>
              </WhatsAppLink>
              <div className="wf-contact-detail">
                <span className="wf-contact-detail-icon"><Clock3 aria-hidden="true" /></span>
                <span><small>Hours</small>{contactInfo.hours}</span>
              </div>
              </div>
              <div className="wf-contact-detail">
                <span className="wf-contact-detail-icon"><MapPin aria-hidden="true" /></span>
                <span>
                  <small>Registered Address</small>
                  <span>&apos;KAMAL&apos; Ashirwad Elite Row Bunglow No.4, Mahadeo Colony Lane No.1, Beside Canal, Makhamalabad Road, Nashik. 422003, Maharashtra, India</span>
                  <span><strong>GSTN:</strong> 27AMCPS2796P1Z4</span>
                </span>
              </div>
              <div className="wf-contact-address">
                <span className="wf-contact-detail-icon"><MapPin aria-hidden="true" /></span>
                <div className="wf-contact-address-content">
                  <small className="wf-contact-address-heading">Office</small>
                  <iframe
                    className="wf-contact-map"
                    src="https://maps.google.com/maps?q=Kamaltara%20Enterprises%2C%20A-130%2C%204th%20Floor%2C%20Business%20Index%2C%20Panchavati%2C%20Nashik%20422003&z=15&output=embed"
                    title="Map to Kamaltara Enterprises in Nashik"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="wf-contact-address-row">
                    <div className="wf-contact-address-copy">
                      <span className="wf-contact-address-text">{contactInfo.location}</span>
                    </div>
                    <a className="wf-contact-map-link" href={mapHref} target="_blank" rel="noreferrer">
                      Open in Maps <ArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Suspense fallback={<div className="wf-contact-form" aria-busy="true" />}>
              <ContactForm />
            </Suspense>
          </Container>
        </section>
      </main>
      </ContactPageMotion>
      <Footer />
    </>
  );
}
