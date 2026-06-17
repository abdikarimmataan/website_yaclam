"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  COURSE_RATING_EVENT,
  getCourseRatings,
  type CourseRatingUpdate,
} from "@/lib/api/course-rating.service";

type Props = {
  courseId: string;
  initialRating?: number;
  initialReviewCount?: number;
};

export function CourseDetailRatingBadge({
  courseId,
  initialRating = 0,
  initialReviewCount = 0,
}: Props) {
  const [avgRating, setAvgRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);

  useEffect(() => {
    void getCourseRatings(courseId).then((data) => {
      if (!data) return;
      setAvgRating(data.rating);
      setReviewCount(data.reviewCount);
    });
  }, [courseId]);

  useEffect(() => {
    function onRated(event: Event) {
      const detail = (event as CustomEvent<CourseRatingUpdate>).detail;
      if (!detail || detail.courseId !== courseId) return;
      setAvgRating(detail.rating);
      setReviewCount(detail.reviewCount);
    }

    window.addEventListener(COURSE_RATING_EVENT, onRated);
    return () => window.removeEventListener(COURSE_RATING_EVENT, onRated);
  }, [courseId]);

  const filledStars = Math.min(5, Math.max(0, Math.round(avgRating)));

  return (
    <div className="flex items-center gap-2">
      <span className="text-[15px] font-bold text-navy">{avgRating.toFixed(1)}</span>
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
          <Star
            key={value}
            size={12}
            fill={value <= filledStars ? "#C9A84C" : "none"}
            stroke="#C9A84C"
          />
        ))}
      </span>
      <span className="text-[13px] text-ink-3">
        ({reviewCount.toLocaleString()} review{reviewCount === 1 ? "" : "s"})
      </span>
    </div>
  );
}
