"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Loader2, Star, Users } from "lucide-react";
import { getInstructorOverview, type InstructorOverview } from "@/lib/api/instructor-stats.service";
import { useAuthSession } from "@/components/auth/use-auth-session";

export function InstructorOverviewClient() {
  const { session } = useAuthSession();
  const [data, setData] = useState<InstructorOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const overview = await getInstructorOverview();
      setData(overview);
      setLoading(false);
    })();
  }, []);

  const displayName = data?.instructorName || session?.displayName || "Instructor";

  const kpis = [
    {
      icon: Users,
      v: loading ? "—" : String(data?.totalStudents ?? 0),
      l: "Total students",
      up: "Across all your courses",
    },
    {
      icon: BookOpen,
      v: loading ? "—" : String(data?.publishedCourses ?? 0),
      l: "Published courses",
      up: "Live on Yaclam",
    },
    {
      icon: Star,
      v: loading ? "—" : (data?.avgRating ?? 0).toFixed(1),
      l: "Avg. rating",
      up: `${data?.reviewCount ?? 0} review${(data?.reviewCount ?? 0) === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-[28px]">Instructor Overview</h1>
          <p className="text-sm text-ink-3 sm:text-base">
            Welcome back, {displayName}. Here&apos;s how your courses are doing.
          </p>
        </div>
        <Link href="/instructor/courses?create=1" className="btn btn-gold">
          + New course
        </Link>
      </div>

      {loading ? (
        <div className="mb-8 flex items-center gap-2 text-[14px] text-ink-3">
          <Loader2 size={18} className="animate-spin" /> Loading overview…
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((k) => (
            <div key={k.l} className="rounded-2xl border border-line bg-white p-5">
              <div className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-xl bg-surface text-royal">
                <k.icon size={20} />
              </div>
              <div className="font-display text-[28px] font-semibold text-navy">{k.v}</div>
              <div className="text-[13px] text-ink-3">{k.l}</div>
              <div className="mt-1.5 text-[12px] font-semibold text-success">{k.up}</div>
            </div>
          ))}
        </div>
      )}

      <h3 className="mb-4 font-sans text-lg font-bold text-navy">Top performing courses</h3>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[2fr_1fr_0.8fr] gap-3 border-b border-line bg-surface px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-ink-3 md:grid">
          <span>Course</span>
          <span>Students</span>
          <span>Rating</span>
        </div>
        {!loading && (data?.topCourses?.length ?? 0) === 0 ? (
          <div className="px-5 py-8 text-center text-[14px] text-ink-3">
            No enrolled students yet. Publish a course to get started.
          </div>
        ) : (
          (data?.topCourses ?? []).map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-1 gap-1.5 border-b border-surface-2 px-5 py-4 text-[14px] last:border-b-0 md:grid-cols-[2fr_1fr_0.8fr] md:items-center md:gap-3"
            >
              <span className="font-semibold text-navy">{course.title}</span>
              <span className="text-ink-2">{course.students.toLocaleString()} students</span>
              <span className="flex items-center gap-1 text-ink-2">
                <Star size={13} fill="#C9A84C" stroke="#C9A84C" /> {course.rating.toFixed(1)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
