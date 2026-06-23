"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, Loader2 } from "lucide-react";
import { confirmStripePayment, createStripeIntent } from "@/lib/api/payment.service";

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function stripeElementStyle(isDark: boolean) {
  return {
    base: {
      fontSize: "14px",
      color: isDark ? "#ffffff" : "#0D1B4B",
      fontFamily: "inherit",
      "::placeholder": { color: isDark ? "#8b97b0" : "#9CA3AF" },
    },
    invalid: { color: "#f87171" },
  };
}

const fieldWrapClass =
  "rounded-xl border border-line bg-white px-4 py-3 focus-within:border-royal focus-within:ring-2 focus-within:ring-royal/15 dark:border-[#1f2a4a] dark:bg-[#0b1126] dark:focus-within:border-royal dark:focus-within:ring-royal/25";

type InnerProps = {
  courseId: string;
  disabled?: boolean;
  onSuccess: () => void;
  onError: (message: string) => void;
};

function StripeCardFields({ courseId, disabled, onSuccess, onError }: InnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const isDark = useIsDarkMode();
  const elementOptions = useMemo(
    () => ({
      style: stripeElementStyle(isDark),
      disableLink: true,
    }),
    [isDark]
  );
  const elementKey = isDark ? "dark" : "light";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || disabled || busy) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      onError("Card form is not ready");
      return;
    }

    setBusy(true);
    try {
      const { clientSecret, paymentIntentId } = await createStripeIntent(courseId);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardNumber },
      });

      if (result.error) {
        onError(result.error.message || "Card payment failed");
        return;
      }

      if (result.paymentIntent?.status !== "succeeded") {
        onError("Payment was not completed");
        return;
      }

      await confirmStripePayment(paymentIntentId);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Card payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
          Account number
        </label>
        <div className={fieldWrapClass}>
          <CardNumberElement
            key={`number-${elementKey}`}
            options={{
              ...elementOptions,
              placeholder: "1234 5678 9012 3456",
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
            Expiry year
          </label>
          <div className={fieldWrapClass}>
            <CardExpiryElement
              key={`expiry-${elementKey}`}
              options={{
                ...elementOptions,
                placeholder: "MM / YY",
              }}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
            CVC
          </label>
          <div className={fieldWrapClass}>
            <CardCvcElement
              key={`cvc-${elementKey}`}
              options={{
                ...elementOptions,
                placeholder: "123",
              }}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-gold w-full" disabled={!stripe || disabled || busy}>
        {busy ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <CreditCard size={16} /> Pay with Card
          </>
        )}
      </button>
    </form>
  );
}

type Props = {
  publishableKey: string;
  courseId: string;
  disabled?: boolean;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export function StripeCardForm({ publishableKey, courseId, disabled, onSuccess, onError }: Props) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <Elements stripe={stripePromise}>
      <StripeCardFields courseId={courseId} disabled={disabled} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
