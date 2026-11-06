"use client";

import type { ReactNode } from "react";

/** A form that asks for confirmation before submitting, e.g. before deleting. */
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
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      {children}
    </form>
  );
}
