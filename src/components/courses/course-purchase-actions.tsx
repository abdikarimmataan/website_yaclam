"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Play, ShoppingCart } from "lucide-react";
import type { Course } from "@/lib/types";
import { readSession } from "@/lib/auth/session";
import { enrollFreeCourse, hasPurchasedCourse } from "@/lib/api/purchase.service";
import { addToWishlist, isCourseInWishlist, removeFromWishlist } from "@/lib/api/wishlist.service";
import { payForCourse } from "@/lib/api/payment.service";
import { toast } from "@/lib/utils/toast";
import { formatCoursePrice } from "@/lib/utils";

const PAYMENT_METHODS = ["WaafiPay", "EVC Plus", "Zaad", "PayPal", "Visa"];

type Props = {
  course: Course;
};

export function CoursePurchaseActions({ course }: Props) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [phone, setPhone] = useState("");

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
          isCourseInWishlist(course.id),
          hasPurchasedCourse(course.id),
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
  }, [course.id]);

  function requireLogin(): boolean {
    const session = readSession();
    if (!session?.accessToken || session.role !== "student") {
      toast.info("Please log in as a student to continue.");
      router.push(`/login?next=/courses/${course.slug}`);
      return false;
    }
    return true;
  }

  async function handleWishlist() {
    if (!requireLogin()) return;
    setBusy(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(course.id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(course.id);
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
      await enrollFreeCourse(course.id);
      setOwned(true);
      toast.success("Enrolled successfully");
      router.push(`/learn/${course.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setBusy(false);
    }
  }

  async function handlePay() {
    if (!requireLogin()) return;
    if (!phone.trim()) {
      toast.error("Enter your EVC Plus mobile number");
      return;
    }
    setBusy(true);
    try {
      const result = await payForCourse(phone.trim(), course.id);
      setOwned(true);
      setShowPay(false);
      toast.success(result.message || "Payment successful");
      router.push(`/learn/${course.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  if (owned) {
    return (
      <div>
        <Link href={`/learn/${course.slug}`} className="btn btn-gold w-full">
          <Play size={16} /> Start Learning
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
        <div className="space-y-2.5">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="EVC Plus number (e.g. 0612345678)"
            className="w-full rounded-xl border border-line px-4 py-3 text-[14px] outline-none focus:border-royal"
          />
          <button type="button" className="btn btn-gold w-full" onClick={handlePay} disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : "Pay with EVC Plus"}
          </button>
          <button type="button" className="btn btn-outline w-full" onClick={() => setShowPay(false)} disabled={busy}>
            Cancel
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-gold w-full" onClick={() => setShowPay(true)} disabled={busy}>
          <ShoppingCart size={16} /> Buy Now
        </button>
      )}

      {!course.free && (
        <div className="mt-4 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((payment) => (
            <span
              key={payment}
              className="rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink-2"
            >
              {payment}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
