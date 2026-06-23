"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Play, ShoppingCart } from "lucide-react";
import type { Course } from "@/lib/types";
import { readSession } from "@/lib/auth/session";
import { enrollFreeCourse, hasPurchasedCourse } from "@/lib/api/purchase.service";
import { addToWishlist, isCourseInWishlist, removeFromWishlist } from "@/lib/api/wishlist.service";
import { getPaymentMethods, payForCourse, type PaymentMethodOption } from "@/lib/api/payment.service";
import {
  PaymentMethodPicker,
  type PaymentMethodId,
} from "@/components/courses/payment-method-picker";
import { StripeCardForm } from "@/components/courses/stripe-card-form";
import { toast } from "@/lib/utils/toast";
import { formatCoursePrice } from "@/lib/utils";

type Props = {
  course: Course;
};

export function CoursePurchaseActions({ course }: Props) {
  const courseId = String(course.id);
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [phone, setPhone] = useState("");
  const [methods, setMethods] = useState<PaymentMethodOption[]>([]);
  const [stripePublicKey, setStripePublicKey] = useState<string | null>(null);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);

  useEffect(() => {
    const session = readSession();
    if (!session?.userId || session.role !== "student") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [saved, purchased] = await Promise.all([
          isCourseInWishlist(courseId),
          hasPurchasedCourse(courseId),
        ]);
        if (!cancelled) {
          setWishlisted(saved);
          setOwned(purchased);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!showPay) return;

    let cancelled = false;
    setMethodsLoading(true);
    getPaymentMethods()
      .then(({ methods: items, stripePublicKey: publicKey }) => {
        if (cancelled) return;
        setMethods(items);
        setStripePublicKey(publicKey);
        setSelectedMethod(items[0]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setMethods([]);
      })
      .finally(() => {
        if (!cancelled) setMethodsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showPay]);

  function requireLogin(): boolean {
    const session = readSession();
    if (!session?.accessToken || session.role !== "student") {
      toast.info("Please log in as a student to continue.");
      router.push(`/login?next=/courses/${course.slug}`);
      return false;
    }
    return true;
  }

  function closeCheckout() {
    setShowPay(false);
    setPhone("");
    setSelectedMethod(null);
  }

  async function handleWishlist() {
    if (!requireLogin()) return;
    setBusy(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(courseId);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(courseId);
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wishlist update failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleFreeEnroll() {
    if (!requireLogin()) return;
    setBusy(true);
    try {
      await enrollFreeCourse(courseId);
      setOwned(true);
      toast.success("Enrolled successfully");
      router.push(`/learn/${course.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setBusy(false);
    }
  }

  function goAfterPurchase(message?: string) {
    toast.success(message || "Payment successful — you now own this course.");
    if (course.lessons > 0) {
      router.push(`/learn/${course.slug}`);
      return;
    }
    router.push(`/courses/${course.slug}?purchased=1`);
  }

  async function handleWaafiPay() {
    if (!requireLogin()) return;
    if (!phone.trim()) {
      toast.error("Enter your EVC Plus mobile number");
      return;
    }
    setBusy(true);
    try {
      const result = await payForCourse(phone.trim(), courseId);
      setOwned(true);
      closeCheckout();
      goAfterPurchase(result.message || "Payment successful");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleCardPaymentSuccess() {
    setOwned(true);
    closeCheckout();
    goAfterPurchase();
  }

  function handleCardPaymentError(message: string) {
    toast.error(message);
  }

  if (owned) {
    if (course.lessons > 0) {
      return (
        <div>
          <Link href={`/learn/${course.slug}`} className="btn btn-gold w-full">
            <Play size={16} /> Start Learning
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <div className="rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-[13px] leading-relaxed text-ink-2">
          You own this course. Lessons are not published yet — check back soon or visit My Courses.
        </div>
        <Link href="/dashboard/courses" className="btn btn-gold w-full">
          <Play size={16} /> My Courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-end gap-2">
        <span
          className={`font-display text-[34px] font-bold ${
            course.free ? "text-success" : "text-navy"
          }`}
        >
          {course.free ? "Free" : `$${formatCoursePrice(course.price)}`}
        </span>
        {!course.free && course.oldPrice ? (
          <span className="mb-1.5 text-lg text-ink-3 line-through">
            ${formatCoursePrice(course.oldPrice)}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        className="btn btn-outline mb-2.5 w-full"
        onClick={handleWishlist}
        disabled={busy || loading}
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />}
        {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>

      {course.free ? (
        <button type="button" className="btn btn-gold w-full" onClick={handleFreeEnroll} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Start Learning
        </button>
      ) : showPay ? (
        <div className="space-y-4 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_30px_rgba(13,27,75,0.06)]">
          <PaymentMethodPicker
            methods={methods}
            selected={selectedMethod}
            onSelect={setSelectedMethod}
            loading={methodsLoading}
          />

          {selectedMethod === "waafipay" ? (
            <div className="space-y-2.5 border-t border-surface-2 pt-4">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                Mobile wallet number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="EVC Plus number (e.g. 0612345678)"
                className="w-full rounded-xl border border-line px-4 py-3 text-[14px] outline-none focus:border-royal focus:ring-2 focus:ring-royal/15"
              />
              <button type="button" className="btn btn-gold w-full" onClick={handleWaafiPay} disabled={busy}>
                {busy ? <Loader2 size={16} className="animate-spin" /> : "Pay with WaafiPay"}
              </button>
            </div>
          ) : null}

          {selectedMethod === "stripe" && stripePublicKey ? (
            <div className="border-t border-surface-2 pt-4">
              <StripeCardForm
                publishableKey={stripePublicKey}
                courseId={courseId}
                disabled={busy}
                onSuccess={handleCardPaymentSuccess}
                onError={handleCardPaymentError}
              />
            </div>
          ) : null}

          {selectedMethod === "stripe" && !stripePublicKey ? (
            <p className="border-t border-surface-2 pt-4 text-[13px] text-ink-3">
              Card payments are not available right now.
            </p>
          ) : null}

          <button type="button" className="btn btn-outline w-full" onClick={closeCheckout} disabled={busy}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-gold w-full"
          onClick={() => {
            if (!requireLogin()) return;
            setShowPay(true);
          }}
          disabled={busy}
        >
          <ShoppingCart size={16} /> Buy Now
        </button>
      )}
    </div>
  );
}
