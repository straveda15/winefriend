"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { submitEnquiryAction } from "@/app/actions/enquiry";
import { ENQUIRY_TOPICS } from "@winefriend/shared/constants";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useHydrated } from "@winefriend/shared/use-hydrated";
import { isValidContactName, isValidEmail, isValidEnquiryMessage, isValidIndianMobile } from "@winefriend/shared/validation";

type ContactField = "name" | "email" | "phone" | "message";
type FieldErrors = Partial<Record<ContactField, string>>;

function validateField(field: ContactField, value: string): string {
  if (field === "name") return isValidContactName(value) ? "" : "Enter at least 2 letters. Use alphabets and spaces only.";
  if (field === "email") return isValidEmail(value.trim()) ? "" : "Enter a valid email address.";
  if (field === "phone") return isValidIndianMobile(value) ? "" : "Enter a valid 10-digit Indian mobile number.";
  return isValidEnquiryMessage(value) ? "" : "Please enter a message.";
}

export function ContactForm() {
  const params = useSearchParams();
  const product = (params.get("product") ?? "").slice(0, 120);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submitEnquiryAction, {});
  const [errors, setErrors] = useState<FieldErrors>({});
  const ready = useHydrated();

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    if (!["name", "email", "phone", "message"].includes(field.name)) return;
    const name = field.name as ContactField;
    setErrors((current) => ({ ...current, [name]: validateField(name, field.value) }));
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    if (!["name", "email", "phone", "message"].includes(field.name)) return;
    const name = field.name as ContactField;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateField(name, field.value) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors: FieldErrors = {
      name: validateField("name", String(formData.get("name") ?? "")),
      email: validateField("email", String(formData.get("email") ?? "")),
      phone: validateField("phone", String(formData.get("phone") ?? "")),
      message: validateField("message", String(formData.get("message") ?? "")),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    startTransition(() => action(formData));
  }

  return (
    <form
      ref={formRef}
      className="wf-contact-form"
      noValidate
      onBlur={handleBlur}
      onChange={handleChange}
      onSubmit={handleSubmit}
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
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label>
        Your name
        <input autoComplete="name" name="name" required maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} />
        {errors.name && <span id="contact-name-error" className="wf-contact-field-error">{errors.name}</span>}
      </label>
      <div className="wf-contact-form-row">
        <label>
          Email address
          <input autoComplete="email" name="email" type="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
          {errors.email && <span id="contact-email-error" className="wf-contact-field-error">{errors.email}</span>}
        </label>
        <label>
          Phone number
          <input
            autoComplete="tel"
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          />
          {errors.phone && <span id="contact-phone-error" className="wf-contact-field-error">{errors.phone}</span>}
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
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && <span id="contact-message-error" className="wf-contact-field-error">{errors.message}</span>}
      </label>

      <div aria-live="polite">
        {state.error && <p className="wf-contact-feedback wf-contact-feedback-error" role="alert">{state.error}</p>}
        {state.ok && <p className="wf-contact-feedback">{state.message}</p>}
      </div>

      <button className="wf-contact-submit" type="submit" disabled={pending || !ready}>
        {pending ? "Sending…" : "Submit"}
      </button>
      <WhatsAppLink className="wf-contact-whatsapp" message={product ? `Hello Wine Friend, I would like to enquire about "${product}".` : undefined}>
        <MessageCircle aria-hidden="true" /> Prefer WhatsApp? Chat with us directly
      </WhatsAppLink>
    </form>
  );
}
