"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  COURSE_RATING_EVENT,
  getCourseRatings,
  type CourseRatingUpdate,
  type CourseRatingsResponse,
} from "@/lib/api/course-rating.service";
import { getCourseEnrollmentCount } from "@/lib/api/course-enrollment.service";
import { CourseRatingForm } from "@/components/courses/course-rating-form";
import { initialsFromName } from "@/lib/auth/session";
import { uploadUrl } from "@/lib/api/cms";

function formatRelativeTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (!Number.isFinite(diff)) return "";

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function starsForRating(rating: number) {
  return Math.min(5, Math.max(0, Math.round(rating)));
}

/** Public course page: learner ratings only (1-5 scale). */
export function CourseReviewsTab({
  courseId,
  initialRating = 0,
  initialReviewCount = 0,
  initialEnrollment = 0,
  initialRatings = [],
}: {
  courseId: string;
  initialRating?: number;
  initialReviewCount?: number;
  initialEnrollment?: number;
  initialRatings?: CourseRatingsResponse["ratings"];
}) {
  const [avgRating, setAvgRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [enrollment, setEnrollment] = useState(initialEnrollment);
  const [ratings, setRatings] = useState(initialRatings);

  useEffect(() => {
    void (async () => {
      const [ratingsData, enrollmentData] = await Promise.all([
        getCourseRatings(courseId),
        getCourseEnrollmentCount(courseId),
      ]);
      if (ratingsData) {
        setAvgRating(ratingsData.rating);
        setReviewCount(ratingsData.reviewCount);
        setRatings(ratingsData.ratings ?? []);
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
      setAvgRating(detail.rating);
      setReviewCount(detail.reviewCount);
      void getCourseRatings(courseId).then((data) => {
        if (data) setRatings(data.ratings ?? []);
      });
    }

    window.addEventListener(COURSE_RATING_EVENT, onRated);
    return () => window.removeEventListener(COURSE_RATING_EVENT, onRated);
  }, [courseId]);

  function handleRated(rating: number, count: number) {
    setAvgRating(rating);
    setReviewCount(count);
    void getCourseRatings(courseId).then((data) => {
      if (data) setRatings(data.ratings ?? []);
    });
  }

  const filledStars = starsForRating(avgRating);

  return (
    <div>
      <div className="mb-6 flex items-center gap-5 rounded-2xl border border-line bg-surface p-6">
        <div className="text-center">
          <div className="font-display text-5xl font-semibold text-navy">{avgRating.toFixed(1)}</div>
          <div className="mt-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
              <Star
                key={value}
                size={13}
                fill={value <= filledStars ? "#C9A84C" : "none"}
                stroke="#C9A84C"
              />
            ))}
          </div>
          <div className="mt-1 text-[13px] text-ink-3">
            {reviewCount.toLocaleString()} review{reviewCount === 1 ? "" : "s"}
          </div>
        </div>
        <p className="text-[14.5px] text-ink-2">
          {reviewCount > 0
            ? `Rated by ${reviewCount.toLocaleString()} enrolled learner${reviewCount === 1 ? "" : "s"} · ${enrollment.toLocaleString()} students enrolled.`
            : `No ratings yet. ${enrollment.toLocaleString()} students enrolled — purchase to leave the first review.`}
        </p>
      </div>

      <CourseRatingForm courseId={courseId} onRated={handleRated} />

      {ratings.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h4 className="text-[16px] font-bold text-navy">Learner reviews</h4>
          {ratings.map((row) => {
            const avatarSrc = uploadUrl(row.studentAvatar);
            const initials = initialsFromName(row.studentName || "?");
            const rowStars = starsForRating(row.rating);

            return (
              <div
                key={row.id ?? `${row.studentName}-${row.created_at}`}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {avatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarSrc}
                        alt={row.studentName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-navy font-bold text-gold">
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-navy">{row.studentName}</div>
                      <div className="text-[12px] text-ink-3">{formatRelativeTime(row.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-navy">{row.rating.toFixed(1)}</span>
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                        <Star
                          key={value}
                          size={11}
                          fill={value <= rowStars ? "#C9A84C" : "none"}
                          stroke="#C9A84C"
                        />
                      ))}
                    </span>
                  </div>
                </div>
                {row.text ? <p className="text-[14.5px] text-ink-2">{row.text}</p> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
