import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Course } from "@/lib/types";
import { Icon } from "@/lib/icon-map";
import { categoryIcon } from "@/lib/data/categories";
import { uploadUrl } from "@/lib/api/cms";
import { WishlistHeartButton } from "@/components/courses/wishlist-heart-button";
import { CourseDynamicStats } from "@/components/courses/course-dynamic-stats";
import { CourseCardCurriculumStats } from "@/components/courses/course-card-curriculum-stats";
import { formatCoursePrice } from "@/lib/utils";

function resolveCategoryIcon(course: Course) {
  return course.categoryIcon?.trim() || categoryIcon(course.category);
}

export function CourseCard({
  c,
  initialRating,
  initialReviewCount,
  initialEnrollment,
  initialDurationHours,
  initialLessonCount,
}: {
  c: Course;
  initialRating?: number;
  initialReviewCount?: number;
  initialEnrollment?: number;
  initialDurationHours?: number;
  initialLessonCount?: number;
}) {
  const thumbnailSrc = uploadUrl(c.thumbnail);
  const iconName = resolveCategoryIcon(c);
  const href = `/courses/${c.slug}`;

  return (
    <Link href={href} className="card-base flex flex-col transition-shadow hover:shadow-card">
      <div
        className="thumb-pat relative grid h-[158px] place-items-center overflow-hidden text-white"
        style={
          thumbnailSrc
            ? undefined
            : { background: `linear-gradient(135deg, ${c.color}, #0D1B4B)` }
        }
      >
        {thumbnailSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailSrc}
            alt={c.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="relative grid h-[62px] w-[62px] place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Icon name={iconName} size={28} />
          </div>
        )}
        {c.badge && (
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wide ${
              c.free ? "bg-success text-white" : "bg-gold text-navy"
            }`}
          >
            {c.badge}
          </span>
        )}
        <WishlistHeartButton courseId={String(c.id)} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-[18px]">
        <span className="pill">{c.level}</span>
        <h3 className="font-sans text-lg font-bold leading-snug text-navy">{c.title}</h3>
        <div className="text-[13px] text-ink-3">by {c.instructor}</div>
        <div className="flex items-center gap-3.5 text-[12.5px] text-ink-3">
          <CourseDynamicStats
            courseId={String(c.id)}
            initialRating={initialRating}
            initialReviewCount={initialReviewCount}
            initialEnrollment={initialEnrollment}
          />
        </div>
        <div className="flex items-center gap-3.5 text-[12.5px] text-ink-3">
          <CourseCardCurriculumStats
            courseId={String(c.id)}
            initialDurationHours={initialDurationHours}
            initialLessonCount={initialLessonCount}
          />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-surface-2 pt-3.5">
          <span
            className={`font-display text-[22px] font-semibold ${
              c.free ? "text-success" : "text-navy"
            }`}
          >
            {c.free ? "Free" : `$${formatCoursePrice(c.price)}`}
            {!c.free && c.oldPrice && (
              <span className="ml-1.5 text-sm font-medium text-ink-3 line-through">
                ${c.oldPrice}
              </span>
            )}
          </span>
          <span className="btn btn-outline btn-sm pointer-events-none">
            {c.free ? "Enroll" : "Details"} <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
