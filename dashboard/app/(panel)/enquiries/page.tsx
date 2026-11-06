import { CheckCircle2, Mail, MessageCircle, Phone, RotateCcw, Trash2 } from "lucide-react";
import { deleteEnquiryAction, toggleEnquiryHandledAction } from "@/app/actions";
import { ConfirmForm } from "@/components/ConfirmForm";
import { PageHeader } from "@/components/PageHeader";
import { badgeAmber, badgeGrey, buttonDanger, buttonGhost, card } from "@/components/ui";
import { adminEnquiries } from "@/lib/admin-data";

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AdminEnquiriesPage() {
  const enquiries = await adminEnquiries();

  return (
    <>
      <PageHeader title="Enquiries" description="Messages sent through the website enquiry form. Reply by email, phone or WhatsApp, then mark them as handled." />

      {enquiries.length === 0 ? (
        <div className={`${card} p-10 text-center`}>
          <p className="font-serif text-xl">No enquiries yet</p>
          <p className="mt-2 text-sm text-slate">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {enquiries.map((item) => {
            const digits = item.phone.replace(/\D/g, "");
            const whatsapp = digits.length >= 10 ? `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}` : null;
            return (
              <li key={item.id} className={`${card} p-4 sm:p-5 ${item.status === "new" ? "border-l-4 border-l-gold" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg">{item.name}</p>
                    <p className="text-xs text-slate">{dateTime.format(new Date(item.createdAt))} · {item.topic}</p>
                  </div>
                  <span className={item.status === "new" ? badgeAmber : badgeGrey}>{item.status === "new" ? "New" : "Handled"}</span>
                </div>
                {item.product && <p className="mt-3 text-sm"><span className="font-semibold">Product:</span> {item.product}</p>}
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-charcoal-light">{item.message}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a className={buttonGhost} href={`mailto:${item.email}`}><Mail /> {item.email}</a>
                  {item.phone && <a className={buttonGhost} href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}><Phone /> {item.phone}</a>}
                  {whatsapp && <a className={buttonGhost} href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>}
                  <span className="grow" />
                  <form action={toggleEnquiryHandledAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className={buttonGhost}>
                      {item.status === "new" ? <CheckCircle2 /> : <RotateCcw />}
                      {item.status === "new" ? "Mark handled" : "Mark new"}
                    </button>
                  </form>
                  <ConfirmForm action={deleteEnquiryAction} id={item.id} message="Delete this enquiry? This cannot be undone.">
                    <button type="submit" className={buttonDanger} aria-label={`Delete enquiry from ${item.name}`}><Trash2 /></button>
                  </ConfirmForm>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
