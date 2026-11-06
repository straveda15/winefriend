"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** A styled confirmation dialog used before destructive form submissions. */
export function ConfirmForm({
  action,
  message,
  children,
  id,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  children: ReactNode;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmedRef = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function confirmDelete() {
    setOpen(false);
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={(event) => {
          if (confirmedRef.current) {
            confirmedRef.current = false;
            return;
          }
          event.preventDefault();
          setOpen(true);
        }}
      >
        <input type="hidden" name="id" value={id} />
        {children}
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-gold/30 bg-white p-0 text-charcoal shadow-2xl backdrop:bg-charcoal/55"
      >
        <div className="p-6 sm:p-7">
          <h2 id={titleId} className="font-serif text-xl">Confirm deletion</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal-light">{message}</p>
          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-lg bg-[#a33a2e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#86291f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a33a2e]"
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
