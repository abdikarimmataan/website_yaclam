"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getWishlistCourses } from "@/lib/api/wishlist.service";
import { getCourseVideoHoursBatch } from "@/lib/api/course-video-hours.service";
import { CourseCard } from "@/components/shared/course-card";
import type { Course } from "@/lib/types";

export function WishlistClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [videoHours, setVideoHours] = useState<
    Record<string, { durationHours: number; lessonCount: number }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getWishlistCourses()
      .then(async (data) => {
        if (cancelled) return;
        setCourses(data);
        if (data.length) {
          const stats = await getCourseVideoHoursBatch(data.map((c) => String(c.id)));
          if (!cancelled) setVideoHours(stats);
        }
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
        Loading wishlist...
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="text-ink-3">Your wishlist is empty.</p>
        <Link href="/courses" className="btn btn-gold btn-sm mt-4 inline-flex">
          Explore courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((c) => {
        const id = String(c.id);
        const stats = videoHours[id];
        return (
          <CourseCard
            key={c.id}
            c={c}
            initialDurationHours={stats?.durationHours ?? 0}
            initialLessonCount={stats?.lessonCount ?? 0}
          />
        );
      })}
    </div>
  );
}
