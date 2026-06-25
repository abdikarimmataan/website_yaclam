"use client";

import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/lib/types";
import type { CourseCategory } from "@/lib/api/course-category.service";
import { resolveDefaultCategoryId } from "@/lib/api/course-category.service";
import { FeaturedCoursesCarousel } from "@/components/home/featured-courses-carousel";
import type { CourseRatingsSummary } from "@/lib/api/course-rating.service";
import type { CourseVideoHoursSummary } from "@/lib/api/course-video-hours.service";
import { cn } from "@/lib/utils";

type DisplayStats = {
  ratings: Record<string, CourseRatingsSummary>;
  enrollments: Record<string, number>;
  videoHours: Record<string, CourseVideoHoursSummary>;
};

type FeaturedCoursesWithCategoriesProps = {
  categories: CourseCategory[];
  courses: Course[];
  gridRows: number;
  gridColumns: number;
  stats: DisplayStats;
};

function matchesCategory(course: Course, categoryId: string): boolean {
  if (!categoryId) return false;
  return String(course.courseCategoryId ?? "").trim() === categoryId;
}

export function FeaturedCoursesWithCategories({
  categories,
  courses,
  gridRows,
  gridColumns,
  stats,
}: FeaturedCoursesWithCategoriesProps) {
  const defaultCategoryId = useMemo(() => resolveDefaultCategoryId(categories), [categories]);
  const [activeCategoryId, setActiveCategoryId] = useState("");

  useEffect(() => {
    setActiveCategoryId((current) => current || defaultCategoryId);
  }, [defaultCategoryId]);

  const effectiveCategoryId = activeCategoryId || defaultCategoryId;

  const filteredCourses = useMemo(() => {
    if (!effectiveCategoryId) return [];
    return courses.filter((c) => matchesCategory(c, effectiveCategoryId));
  }, [courses, effectiveCategoryId]);

  if (!categories.length) {
    return (
      <FeaturedCoursesCarousel
        courses={courses}
        gridRows={gridRows}
        gridColumns={gridColumns}
        stats={stats}
      />
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
        {categories.map((category) => {
          const active = category.id === effectiveCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={cn(
                "rounded-full px-4 py-2 text-[13.5px] font-semibold transition",
                active
                  ? "bg-royal text-white shadow-sm"
                  : "bg-surface-2 text-ink-3 hover:bg-line hover:text-navy"
              )}
              aria-pressed={active}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {filteredCourses.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-ink-3">
          No courses in this category yet.
        </p>
      ) : (
        <FeaturedCoursesCarousel
          key={effectiveCategoryId}
          courses={filteredCourses}
          gridRows={gridRows}
          gridColumns={gridColumns}
          stats={stats}
        />
      )}
    </div>
  );
}
