"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Loader2, Play } from "lucide-react";
import { getMyPurchasedCourses, type PurchasedCourse } from "@/lib/api/purchase.service";
import { useAuthSession } from "@/components/auth/use-auth-session";

export function DashboardHomeClient() {
  const { session } = useAuthSession();
  const [items, setItems] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyPurchasedCourses(1, 6)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = session?.displayName ?? "Student";

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-navy to-royal p-7 text-white">
        <div>
          <h2 className="text-[26px] font-semibold">Soo dhawow, {displayName} 👋</h2>
          <p className="mt-1.5 text-white/80">
            {items.length > 0
              ? `You have ${items.length} purchased course${items.length === 1 ? "" : "s"}.`
              : "Browse courses and start learning today."}
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 font-bold">
          <BookOpen size={22} className="text-gold" /> {items.length} courses
        </div>
      </div>

      <h3 className="mb-4 font-sans text-lg font-bold text-navy">Your purchased courses</h3>
      {loading ? (
        <div className="flex items-center gap-2 py-8 text-ink-3">
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-ink-3">
          No purchased courses yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(({ course, purchaseId }) => (
            <div key={purchaseId} className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-3.5 flex items-center justify-between">
                <h4 className="font-sans text-[16px] font-bold text-navy">{course.title}</h4>
                <span className="text-[13px] font-bold text-royal">{course.level}</span>
              </div>
              <Link href={`/learn/${course.slug}`} className="btn btn-outline btn-sm">
                <Play size={14} /> Continue
              </Link>
            </div>
          ))}
        </div>
      )}

      <Link href="/courses" className="btn btn-gold mt-5">
        Browse more courses <ArrowRight size={16} />
      </Link>
    </div>
  );
}
