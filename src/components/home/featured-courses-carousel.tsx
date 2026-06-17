"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

function gridClassForCount(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
}

export function FeaturedCoursesCarousel({
  courses,
  cardsPerPage,
  stats,
}: {
  courses: Course[];
  cardsPerPage: number;
  stats: DisplayStats;
}) {
  const perPage = Math.max(1, cardsPerPage || 1);
  const totalPages = Math.max(1, Math.ceil(courses.length / perPage));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages - 1);
  const visible = courses.slice(safePage * perPage, safePage * perPage + perPage);
  const showNav = totalPages > 1;

  return (
    <div className="relative px-1 sm:px-12">
      {showNav ? (
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={safePage === 0}
          className="absolute left-0 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-navy shadow-card transition hover:border-royal disabled:pointer-events-none disabled:opacity-35"
          aria-label="Previous courses"
        >
          <ChevronLeft size={20} />
        </button>
      ) : null}

      <div className={cn("grid gap-6", gridClassForCount(perPage))}>
        {visible.map((c) => {
          const id = String(c.id);
          const ratingStats = stats.ratings[id];
          const videoStats = stats.videoHours[id];
          return (
            <CourseCard
              key={c.id}
              c={c}
              initialRating={ratingStats?.rating ?? 0}
              initialReviewCount={ratingStats?.reviewCount ?? 0}
              initialEnrollment={stats.enrollments[id] ?? 0}
              initialDurationHours={videoStats?.durationHours ?? 0}
              initialLessonCount={videoStats?.lessonCount ?? 0}
            />
          );
        })}
      </div>

      {showNav ? (
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={safePage >= totalPages - 1}
          className="absolute right-0 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-navy shadow-card transition hover:border-royal disabled:pointer-events-none disabled:opacity-35"
          aria-label="Next courses"
        >
          <ChevronRight size={20} />
        </button>
      ) : null}
    </div>
  );
}
