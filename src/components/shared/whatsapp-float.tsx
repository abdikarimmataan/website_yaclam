"use client";

import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_22px_rgba(37,211,102,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] max-sm:bottom-5 max-sm:right-5 max-sm:h-[52px] max-sm:w-[52px]"
    >
      <span className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        Chat with us
      </span>
      <WhatsAppIcon size={28} />
    </a>
  );
}
