"use client";

import { Loader2, ShieldCheck, Smartphone } from "lucide-react";

export type PaymentMethodId = "waafipay" | "stripe";

export type PaymentMethodOption = {
  id: PaymentMethodId;
  label: string;
  description: string;
};

type Props = {
  methods: PaymentMethodOption[];
  selected: PaymentMethodId | null;
  onSelect: (id: PaymentMethodId) => void;
  loading?: boolean;
};

function WaafiPayMark() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B7A3B] text-white shadow-sm">
      <Smartphone size={22} strokeWidth={2.2} />
    </div>
  );
}

function CardBrandsMark() {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#1A1F71] shadow-sm">
        <svg viewBox="0 0 48 30" className="h-5 w-8" aria-hidden>
          <rect width="48" height="30" rx="4" fill="#1A1F71" />
          <text x="24" y="19" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Arial,sans-serif">
            VISA
          </text>
        </svg>
      </span>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EB001B] shadow-sm">
        <svg viewBox="0 0 48 30" className="h-6 w-8" aria-hidden>
          <circle cx="18" cy="15" r="10" fill="#EB001B" opacity="0.95" />
          <circle cx="30" cy="15" r="10" fill="#F79E1B" opacity="0.95" />
        </svg>
      </span>
    </div>
  );
}

function methodMeta(id: PaymentMethodId) {
  if (id === "waafipay") {
    return {
      mark: <WaafiPayMark />,
      badges: ["EVC Plus", "Zaad"],
      accent: "border-[#0B7A3B]/30 ring-[#0B7A3B]/20",
      selectedAccent: "border-[#0B7A3B] bg-[#0B7A3B]/[0.04] ring-2 ring-[#0B7A3B]/25",
    };
  }
  return {
    mark: <CardBrandsMark />,
    badges: ["Mastercard", "Visa"],
    accent: "border-line",
    selectedAccent: "border-royal bg-royal/[0.04] ring-2 ring-royal/20",
  };
}

export function PaymentMethodPicker({ methods, selected, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-line bg-surface-2/60 px-4 py-10">
        <Loader2 size={22} className="animate-spin text-royal" />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface-2/50 px-4 py-6 text-center text-[13px] text-ink-3">
        No payment methods are configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
        <ShieldCheck size={14} className="text-royal" />
        Choose payment method
      </div>

      <div className="grid gap-3">
        {methods.map((method) => {
          const meta = methodMeta(method.id);
          const isSelected = selected === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                isSelected ? meta.selectedAccent : `${meta.accent} hover:border-royal/40 hover:bg-white`
              }`}
            >
              {meta.mark}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-sans text-[15px] font-bold text-navy">{method.label}</p>
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                      isSelected ? "border-royal bg-royal" : "border-line bg-white group-hover:border-royal/50"
                    }`}
                  >
                    {isSelected ? (
                      <span className="block h-full w-full scale-[0.45] rounded-full bg-white" />
                    ) : null}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{method.description}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {meta.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-2"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
