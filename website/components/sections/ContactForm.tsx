"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { submitEnquiryAction } from "@/app/actions/enquiry";
import { ENQUIRY_TOPICS } from "@winefriend/shared/constants";
import { whatsappLink } from "@/lib/contact";
import { useHydrated } from "@winefriend/shared/use-hydrated";

export function ContactForm() {
  const params = useSearchParams();
  const product = (params.get("product") ?? "").slice(0, 120);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submitEnquiryAction, {});
  const ready = useHydrated();

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      className="wf-contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <div className="wf-contact-form-heading">
        <p className="wf-contact-kicker">Send us a note</p>
        <h2>How can we help?</h2>
        <p>Share a few details and we’ll help direct your enquiry to the right place.</p>
      </div>

      {product && <input type="hidden" name="product" value={product} />}
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label>
        Your name
        <input autoComplete="name" name="name" required maxLength={100} />
      </label>
      <div className="wf-contact-form-row">
        <label>
          Email address
          <input autoComplete="email" name="email" type="email" required />
        </label>
        <label>
          Phone number (optional)
          <input
            autoComplete="tel"
            name="phone"
            type="tel"
            maxLength={30}
            pattern={"(?=(?:\\D*\\d){7,15}\\D*$)\\+?(?:[0-9]|\\s|\\(|\\)|\\.|-)+"}
            title="Use 7–15 digits; spaces, parentheses, +, dots, and hyphens are allowed."
          />
        </label>
      </div>
      <label>
        What are you enquiring about?
        <select name="topic" defaultValue={ENQUIRY_TOPICS[0]}>
          {ENQUIRY_TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label>
        Your message
        <textarea
          key={product}
          name="message"
          rows={3}
          required
          maxLength={3000}
          defaultValue={product ? `Hello, I would like to know more about "${product}".` : ""}
        />
      </label>

      <div aria-live="polite">
        {state.error && <p className="wf-contact-feedback wf-contact-feedback-error" role="alert">{state.error}</p>}
        {state.ok && <p className="wf-contact-feedback">{state.message}</p>}
      </div>

      <button className="wf-contact-submit" type="submit" disabled={pending || !ready}>
        {pending ? "Sending…" : "Submit"}
      </button>
      <a className="wf-contact-whatsapp" href={whatsappLink(product ? `Hello Wine Friend, I would like to enquire about "${product}".` : undefined)} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" /> Prefer WhatsApp? Chat with us directly
      </a>
    </form>
  );
}
