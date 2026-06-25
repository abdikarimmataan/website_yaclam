"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/shared/course-card";
import type { CourseRatingsSummary } from "@/lib/api/course-rating.service";
import type { CourseVideoHoursSummary } from "@/lib/api/course-video-hours.service";
import {
  DEFAULT_FEATURED_GRID_COLUMNS,
  DEFAULT_FEATURED_GRID_ROWS,
  featuredCardsPerPage,
  featuredGridColsClass,
  featuredGridMinHeight,
  featuredGridRowsClass,
} from "@/lib/featured-courses-grid";
import { cn } from "@/lib/utils";

type DisplayStats = {
  ratings: Record<string, CourseRatingsSummary>;
  enrollments: Record<string, number>;
  videoHours: Record<string, CourseVideoHoursSummary>;
};

export function FeaturedCoursesCarousel({
  courses,
  gridRows = DEFAULT_FEATURED_GRID_ROWS,
  gridColumns = DEFAULT_FEATURED_GRID_COLUMNS,
  stats,
}: {
  courses: Course[];
  gridRows?: number;
  gridColumns?: number;
  stats: DisplayStats;
}) {
  const perPage = featuredCardsPerPage(gridRows, gridColumns);
  const totalPages = Math.max(1, Math.ceil(courses.length / perPage));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * perPage;
  const pageCourses = courses.slice(pageStart, pageStart + perPage);
  const activeRows = Math.max(
    1,
    Math.min(gridRows, Math.ceil(pageCourses.length / gridColumns))
  );
  const isFullPage = pageCourses.length >= perPage;
  const showNav = courses.length > perPage;

  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2",
          isFullPage ? "items-stretch" : "items-start",
          featuredGridColsClass(gridColumns),
          featuredGridRowsClass(activeRows),
          isFullPage && featuredGridMinHeight(activeRows)
        )}
      >
        {pageCourses.map((c) => {
          const id = String(c.id);
          const ratingStats = stats.ratings[id];
          const videoStats = stats.videoHours[id];
          return (
            <div key={c.id} className={isFullPage ? "h-full [&>a]:h-full" : undefined}>
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
