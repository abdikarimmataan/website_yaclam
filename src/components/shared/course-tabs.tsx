"use client";

import { useState } from "react";
import { ChevronDown, Play, Lock, CheckCircle2 } from "lucide-react";
import type { Course, Module } from "@/lib/types";
import type { CourseRatingsResponse } from "@/lib/api/course-rating.service";
import { uploadUrl } from "@/lib/api/cms";
import { CourseReviewsTab } from "@/components/courses/course-reviews-tab";
import { cn, formatCourseHoursLabel } from "@/lib/utils";

const TABS = ["Overview", "Curriculum", "Details", "Instructor", "Reviews"] as const;
type Tab = (typeof TABS)[number];

export function CourseTabs({
  course,
  modules,
  ratingsData = null,
  enrollmentCount = 0,
  durationHours = 0,
  lessonCount = 0,
}: {
  course: Course;
  modules: Module[];
  ratingsData?: CourseRatingsResponse | null;
  enrollmentCount?: number;
  durationHours?: number;
  lessonCount?: number;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [open, setOpen] = useState(0);
  const initials = course.instructor.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const instructorAvatarSrc = uploadUrl(course.instructorAvatar);
  const overviewHeadline = course.overviewHeadline?.trim() || "Build smarter, not harder";
  const instructorBio =
    course.instructorBio?.trim() ||
    "Practitioner-instructor with years of real-world experience, teaching the exact skills employers test for — explained in Somali with English technical terms.";

  return (
    <div>
      <div className="sticky top-[72px] z-10 -mx-1 mb-7 flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative whitespace-nowrap rounded-lg px-4 py-2.5 text-[14.5px] font-semibold transition",
              tab === t ? "bg-navy text-white" : "text-ink-2 hover:text-navy"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div>
          <h2 className="mb-4 text-[24px] font-semibold text-navy">{overviewHeadline}</h2>
          <p className="mb-4 text-[16px] leading-[1.8] text-ink-2">{course.description}</p>
          {course.outcomes.length > 0 ? (
            <>
              <h3 className="mb-3 mt-7 text-[19px] font-bold text-navy">What you&apos;ll master</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex gap-2.5 text-[15px] text-ink-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-royal" /> {o}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      )}

      {tab === "Curriculum" && (
        <div className="overflow-hidden rounded-2xl border border-line">
          {modules.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-3">No curriculum published yet.</div>
          ) : (
            modules.map((m, i) => (
            <div key={m.title} className="border-b border-surface-2 last:border-b-0">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between bg-surface px-5 py-4 text-left font-semibold text-navy">
                <span>{m.title} · {m.lessons.length} lessons</span>
                <ChevronDown size={18} className={cn("transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="px-5 pb-3.5 pt-1.5">
                  {m.lessons.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-3 py-2.5 text-[14px] text-ink-2">
                      <span className="flex items-center gap-2.5">
                        {l.free ? <Play size={15} className="text-royal" /> : <Lock size={14} className="text-ink-3" />}
                        {l.title}
                      </span>
                      <span className="shrink-0 text-[13px] text-ink-3">{l.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            ))
          )}
        </div>
      )}

      {tab === "Details" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Skill level", course.level],
            ["Language", course.language],
            ["Lessons", `${lessonCount}`],
            ["Duration", formatCourseHoursLabel(durationHours)],
            ["Certificate", course.certificate ? "Yes" : "No"],
            ["Access", course.expiry],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[14.5px]">
              <span className="text-ink-3">{k}</span><b className="text-navy">{v}</b>
            </div>
          ))}
        </div>
      )}

      {tab === "Instructor" && (
        <div className="flex items-start gap-5 rounded-2xl border border-line bg-white p-6">
          {instructorAvatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={instructorAvatarSrc}
              alt={course.instructor}
              className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full font-display text-2xl font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }}>{initials}</div>
          )}
          <div>
            <h3 className="font-sans text-lg font-bold text-navy">{course.instructor}</h3>
            {course.instructorRole ? (
              <p className="mt-0.5 text-sm font-medium text-royal">{course.instructorRole}</p>
            ) : null}
            <p className="mt-2 text-[14.5px] text-ink-3">{instructorBio}</p>
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <CourseReviewsTab
          courseId={String(course.id)}
          initialRating={ratingsData?.rating ?? 0}
          initialReviewCount={ratingsData?.reviewCount ?? 0}
          initialEnrollment={enrollmentCount}
          initialRatings={ratingsData?.ratings ?? []}
        />
      )}
    </div>
  );
}
