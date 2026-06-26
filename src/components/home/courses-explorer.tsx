"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Course, Level } from "@/lib/types";
import type { CourseFieldOption } from "@/lib/api/fields.service";
import type { CourseRatingsSummary } from "@/lib/api/course-rating.service";
import type { CourseVideoHoursSummary } from "@/lib/api/course-video-hours.service";
import { CourseCard } from "@/components/shared/course-card";
import { getCourseVideoHoursBatch } from "@/lib/api/course-video-hours.service";
import { cn, slugify } from "@/lib/utils";

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];
const prices = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

type DisplayStats = {
  ratings: Record<string, CourseRatingsSummary>;
  enrollments: Record<string, number>;
  videoHours: Record<string, CourseVideoHoursSummary>;
};

export function CoursesExplorer({
  courses,
  fields,
  initialCat = "all",
  emptyStateText = "No courses found.",
  displayStats,
}: {
  courses: Course[];
  fields: CourseFieldOption[];
  initialCat?: string;
  emptyStateText?: string;
  displayStats?: DisplayStats;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCat);
  const [price, setPrice] = useState("all");
  const [picked, setPicked] = useState<Level[]>([]);
  const [videoHours, setVideoHours] = useState<Record<string, CourseVideoHoursSummary>>(
    displayStats?.videoHours ?? {}
  );

  useEffect(() => {
    setCat(initialCat);
  }, [initialCat]);

  const courseIds = useMemo(() => courses.map((c) => String(c.id)), [courses]);

  useEffect(() => {
    if (displayStats?.videoHours) {
      setVideoHours(displayStats.videoHours);
      return;
    }
    let cancelled = false;
    void (async () => {
      const data = await getCourseVideoHoursBatch(courseIds);
      if (!cancelled) setVideoHours(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseIds, displayStats?.videoHours]);

  const updateCategory = (nextCat: string) => {
    setCat(nextCat);
    const params = new URLSearchParams(searchParams.toString());
    if (nextCat === "all") params.delete("cat");
    else params.set("cat", nextCat);
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `/courses?${query}` : "/courses", { scroll: false });
  };

  const toggle = (l: Level) =>
    setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        if (q && !`${c.title} ${c.instructor}`.toLowerCase().includes(q.toLowerCase())) {
          return false;
        }
        if (cat !== "all") {
          const fieldMatch = c.fieldId && String(c.fieldId) === cat;
          const slugMatch = slugify(c.category) === cat;
          const nameMatch = c.category === cat;
          if (!fieldMatch && !slugMatch && !nameMatch) return false;
        }
        if (price === "free" && !c.free) return false;
        if (price === "paid" && c.free) return false;
        if (picked.length && !picked.includes(c.level)) return false;
        return true;
      }),
    [courses, q, cat, price, picked]
  );

  const fieldsWithCourses = useMemo(() => {
    const countByFieldId = new Map<string, number>();
    for (const course of courses) {
      const fieldId = course.fieldId ? String(course.fieldId).trim() : "";
      if (fieldId) countByFieldId.set(fieldId, (countByFieldId.get(fieldId) ?? 0) + 1);
    }

    const seen = new Set<string>();
    const result: CourseFieldOption[] = [];

    for (const field of fields) {
      const courseCount = countByFieldId.get(field.id) ?? field.courseCount;
      if (courseCount > 0 || cat === field.id) {
        result.push({ ...field, courseCount });
        seen.add(field.id);
      }
    }

    for (const [fieldId, courseCount] of countByFieldId) {
      if (courseCount > 0 && !seen.has(fieldId)) {
        const course = courses.find((c) => String(c.fieldId) === fieldId);
        result.push({
          id: fieldId,
          name: course?.category ?? "Field",
          slug: slugify(course?.category ?? fieldId),
          icon: course?.categoryIcon,
          courseCount,
        });
      }
    }

    return result;
  }, [courses, fields, cat]);

  return (
    <div className="grid items-start gap-9 md:grid-cols-[260px_1fr]">
      <aside className="sticky top-24 hidden rounded-2xl border border-line bg-white p-[22px] md:block">
        <h4 className="mb-3.5 font-sans text-[14px] font-extrabold uppercase tracking-wider text-navy">
          Filters
        </h4>

        <div className="border-t border-surface-2 py-3.5">
          <h4 className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy">Price</h4>
          {prices.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy"
            >
              <input
                type="radio"
                name="price"
                checked={price === p.id}
                onChange={() => setPrice(p.id)}
                className="h-4 w-4 accent-royal"
              />{" "}
              {p.label}
            </label>
          ))}
        </div>

        <div className="border-t border-surface-2 py-3.5">
          <h4 className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy">Level</h4>
          {levels.map((l) => (
            <label
              key={l}
              className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy"
            >
              <input
                type="checkbox"
                checked={picked.includes(l)}
                onChange={() => toggle(l)}
                className="h-4 w-4 accent-royal"
              />{" "}
              {l}
            </label>
          ))}
        </div>

        <div className="border-t border-surface-2 py-3.5">
          <h4 className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy">Field</h4>
          <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy">
            <input
              type="radio"
              name="cat"
              checked={cat === "all"}
              onChange={() => updateCategory("all")}
              className="h-4 w-4 accent-royal"
            />{" "}
            All fields
          </label>
          {fieldsWithCourses.map((field) => (
            <label
              key={field.id}
              className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy"
            >
              <input
                type="radio"
                name="cat"
                checked={cat === field.id}
                onChange={() => updateCategory(field.id)}
                className="h-4 w-4 accent-royal"
              />{" "}
              {field.name}
            </label>
          ))}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-white px-4">
          <Search size={20} className="text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses, topics, instructors…"
            className="flex-1 bg-transparent py-3.5 text-[15px] outline-none"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateCategory("all")}
            className={cn(
              "rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition",
              cat === "all"
                ? "border-navy bg-navy text-white"
                : "bg-white text-ink-2 hover:border-royal hover:text-royal"
            )}
          >
            All
          </button>
          {fieldsWithCourses.map((field) => (
            <button
              key={field.id}
              type="button"
              onClick={() => updateCategory(field.id)}
              className={cn(
                "rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition",
                cat === field.id
                  ? "border-navy bg-navy text-white"
                  : "bg-white text-ink-2 hover:border-royal hover:text-royal"
              )}
            >
              {field.name}
            </button>
          ))}
        </div>

        <div className="mb-5 text-[14px] text-ink-3">
          <b className="text-navy">{filtered.length}</b> courses found
        </div>

        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => {
              const id = String(c.id);
              const ratingStats = displayStats?.ratings[id];
              const hoursStats = videoHours[id];
              return (
                <CourseCard
                  key={c.id}
                  c={c}
                  initialRating={ratingStats?.rating ?? 0}
                  initialReviewCount={ratingStats?.reviewCount ?? 0}
                  initialEnrollment={displayStats?.enrollments[id] ?? 0}
                  initialDurationHours={hoursStats?.durationHours ?? 0}
                  initialLessonCount={hoursStats?.lessonCount ?? 0}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
            <Search size={40} className="mx-auto mb-3 text-ink-3" />
            <p className="text-[17px] font-semibold text-navy">{emptyStateText}</p>
            {cat !== "all" ? (
              <Link href="/courses" className="btn btn-outline btn-sm mt-6 inline-flex">
                Clear filters
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
