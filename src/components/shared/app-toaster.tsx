"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans text-sm shadow-lg border border-line",
          title: "font-semibold",
          description: "text-ink-3 whitespace-pre-line",
        },
      }}
    />
  );
}
