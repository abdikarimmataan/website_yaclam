"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { confirmStripeCheckout } from "@/lib/api/payment.service";
import { toast } from "@/lib/utils/toast";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <Loader2 size={36} className="animate-spin text-royal" />
      <p className="mt-4 text-[15px] text-ink-3">Confirming your payment...</p>
    </div>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [courseSlug, setCourseSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    confirmStripeCheckout(sessionId)
      .then((result) => {
        if (cancelled) return;
        const courseRef = result.purchase?.courseId;
        const slug =
          typeof courseRef === "object" && courseRef
            ? String(courseRef.id ?? courseRef._id ?? "")
            : courseRef
              ? String(courseRef)
              : null;
        setCourseSlug(slug);
        setStatus("success");
        toast.success(result.message || "Payment successful");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        toast.error(err instanceof Error ? err.message : "Could not confirm payment");
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {status === "loading" ? (
        <>
          <Loader2 size={36} className="animate-spin text-royal" />
          <p className="mt-4 text-[15px] text-ink-3">Confirming your payment...</p>
        </>
      ) : null}

      {status === "success" ? (
        <>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-navy">Payment successful</h1>
          <p className="mt-2 text-[15px] text-ink-3">Your course is ready. You can start learning right away.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {courseSlug ? (
              <Link href={`/learn/${courseSlug}`} className="btn btn-gold">
                Start Learning
              </Link>
            ) : null}
            <Link href="/dashboard/courses" className="btn btn-outline">
              My Courses
            </Link>
          </div>
        </>
      ) : null}

      {status === "error" ? (
        <>
          <h1 className="font-display text-2xl font-bold text-navy">Payment not confirmed</h1>
          <p className="mt-2 text-[15px] text-ink-3">
            We could not verify this payment. If you were charged, contact support with your receipt.
          </p>
          <button type="button" className="btn btn-outline mt-8" onClick={() => router.push("/courses")}>
            Back to courses
          </button>
        </>
      ) : null}
    </div>
  );
}
