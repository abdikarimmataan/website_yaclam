"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Play } from "lucide-react";
import { getMyPurchasedCourses, type PurchasedCourse } from "@/lib/api/purchase.service";
import { uploadUrl } from "@/lib/api/cms";

export function MyCoursesClient() {
  const [items, setItems] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyPurchasedCourses()
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-ink-3">
        <Loader2 size={20} className="animate-spin" />
        Loading your courses...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="text-ink-3">You have not purchased any courses yet.</p>
        <Link href="/courses" className="btn btn-gold btn-sm mt-4 inline-flex">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map(({ course, purchaseId }) => {
        const thumbnailSrc = uploadUrl(course.thumbnail);
        return (
          <div key={purchaseId} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div
              className="relative h-28 thumb-pat"
              style={
                thumbnailSrc
                  ? undefined
                  : { background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }
              }
            >
              {thumbnailSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnailSrc} alt={course.title} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-5">
              <span className="pill">{course.level}</span>
              <h3 className="mt-2 font-sans text-[16px] font-bold text-navy">{course.title}</h3>
              <p className="mt-1 text-[13px] text-ink-3">by {course.instructor}</p>
              <Link href={`/learn/${course.slug}`} className="btn btn-navy btn-sm mt-4 w-full">
                <Play size={14} /> Start Learning
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
