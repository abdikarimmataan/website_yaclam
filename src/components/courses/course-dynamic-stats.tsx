"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Stars } from "@/components/shared/stars";
import { formatStudents } from "@/lib/utils";
import {
  COURSE_RATING_EVENT,
  getCourseRatings,
  type CourseRatingUpdate,
} from "@/lib/api/course-rating.service";
import {
  getCourseEnrollmentCount,
} from "@/lib/api/course-enrollment.service";

type Props = {
  courseId: string;
  initialRating?: number;
  initialReviewCount?: number;
  initialEnrollment?: number;
  layout?: "card" | "inline";
};

export function CourseDynamicStats({
  courseId,
  initialRating = 0,
  initialReviewCount = 0,
  initialEnrollment = 0,
  layout = "card",
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [enrollment, setEnrollment] = useState(initialEnrollment);

  useEffect(() => {
    void (async () => {
      const [ratingsData, enrollmentData] = await Promise.all([
        getCourseRatings(courseId),
        getCourseEnrollmentCount(courseId),
      ]);
      if (ratingsData) {
        setRating(ratingsData.rating);
        setReviewCount(ratingsData.reviewCount);
      }
      if (enrollmentData) {
        setEnrollment(enrollmentData.count);
      }
    })();
  }, [courseId]);

  useEffect(() => {
    function onRated(event: Event) {
      const detail = (event as CustomEvent<CourseRatingUpdate>).detail;
      if (!detail || detail.courseId !== courseId) return;
      setRating(detail.rating);
      setReviewCount(detail.reviewCount);
    }

    window.addEventListener(COURSE_RATING_EVENT, onRated);
    return () => window.removeEventListener(COURSE_RATING_EVENT, onRated);
  }, [courseId]);

  if (layout === "inline") {
    return (
      <span className="inline-flex items-center gap-2 text-[14px] text-ink-2">
        <Stars rating={rating} />
        <span className="text-ink-3">({reviewCount.toLocaleString()})</span>
        <span className="inline-flex items-center gap-1.5 text-ink-3">
          <Users size={14} />
          {formatStudents(enrollment)}
        </span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3.5 text-[12.5px] text-ink-3">
      <Stars rating={rating} />
      <span>({reviewCount.toLocaleString()})</span>
      <span className="inline-flex items-center gap-1.5">
        <Users size={13} /> {formatStudents(enrollment)}
      </span>
    </div>
  );
}
