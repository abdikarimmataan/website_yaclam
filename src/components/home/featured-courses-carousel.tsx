"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/shared/course-card";
import type { CourseRatingsSummary } from "@/lib/api/course-rating.service";
import type { CourseVideoHoursSummary } from "@/lib/api/course-video-hours.service";
import { cn } from "@/lib/utils";

type DisplayStats = {
  ratings: Record<string, CourseRatingsSummary>;
  enrollments: Record<string, number>;
  videoHours: Record<string, CourseVideoHoursSummary>;
};

const CARDS_PER_ROW = 3;
const ROWS_PER_PAGE = 2;
const CARDS_PER_PAGE = CARDS_PER_ROW * ROWS_PER_PAGE;

export function FeaturedCoursesCarousel({
  courses,
  cardsPerPage: _cardsPerPage,
  stats,
}: {
  courses: Course[];
  cardsPerPage: number;
  stats: DisplayStats;
}) {
  const perPage = CARDS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(courses.length / perPage));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * perPage;
  const showNav = courses.length > perPage;

  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:min-h-[744px] lg:grid-cols-3 lg:grid-rows-2">
        {Array.from({ length: perPage }, (_, i) => {
          const c = courses[pageStart + i];
          if (!c) {
            return (
              <div
                key={`featured-slot-${safePage}-${i}`}
                className="card-base pointer-events-none invisible hidden min-h-[360px] lg:block"
                aria-hidden
              />
            );
          }

          const id = String(c.id);
          const ratingStats = stats.ratings[id];
          const videoStats = stats.videoHours[id];
          return (
            <div key={c.id} className="h-full [&>a]:h-full">
              <CourseCard
                c={c}
                initialRating={ratingStats?.rating ?? 0}
                initialReviewCount={ratingStats?.reviewCount ?? 0}
                initialEnrollment={stats.enrollments[id] ?? 0}
                initialDurationHours={videoStats?.durationHours ?? 0}
                initialLessonCount={videoStats?.lessonCount ?? 0}
              />
            </div>
          );
        })}
      </div>

      {showNav ? (
        <div className="mt-10 flex min-h-[52px] flex-wrap items-center justify-center gap-2 sm:gap-3">
          <nav aria-label="Featured courses pagination" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="inline-flex min-w-[72px] items-center justify-center rounded-full bg-surface-2 px-5 py-2.5 text-[14px] font-bold text-ink-3 transition hover:bg-line hover:text-navy disabled:pointer-events-none disabled:opacity-50"
            aria-label="Previous page"
          >
            Prev
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const active = n === safePage + 1;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n - 1)}
                  aria-current={active ? "page" : undefined}
                  aria-label={`Page ${n}`}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full text-[14px] font-semibold transition",
                    active
                      ? "bg-royal font-bold text-white"
                      : "bg-surface-2 text-ink-3 hover:bg-line hover:text-navy"
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="inline-flex min-w-[72px] items-center justify-center rounded-full bg-royal px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-navy disabled:pointer-events-none disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
