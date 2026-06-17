"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import {
  getMyCourseRating,
  notifyCourseRatingChange,
  submitCourseRating,
} from "@/lib/api/course-rating.service";
import { hasPurchasedCourse } from "@/lib/api/purchase.service";
import { readSession } from "@/lib/auth/session";
import { toast } from "@/lib/utils/toast";
import { cn } from "@/lib/utils";

const MAX_RATING = 5;

type Props = {
  courseId: string;
  onRated?: (rating: number, reviewCount: number) => void;
};

export function CourseRatingForm({ courseId, onRated }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [owned, setOwned] = useState(false);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const session = readSession();
      if (!session?.accessToken || session.role !== "student") {
        if (active) setLoading(false);
        return;
      }

      const purchased = await hasPurchasedCourse(courseId);
      if (!active) return;
      setOwned(purchased);
      if (!purchased) {
        setLoading(false);
        return;
      }

      const mine = await getMyCourseRating(courseId);
      if (!active) return;
      if (mine?.rating) {
        setStars(mine.rating);
        setText(mine.text ?? "");
        setSaved(true);
      }
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [courseId]);

  async function handleSubmit() {
    const session = readSession();
    if (!session?.accessToken || session.role !== "student") {
      toast.info("Please log in as a student to rate this course.");
      router.push(`/login?next=/courses/${courseId}`);
      return;
    }

    if (!owned) {
      toast.info("Purchase this course before leaving a rating.");
      return;
    }

    if (stars < 1) {
      toast.info("Select a rating from 1 to 5.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitCourseRating(courseId, stars, text.trim());
      setSaved(true);
      onRated?.(result.courseRating, result.reviewCount);
      notifyCourseRatingChange({
        courseId,
        rating: result.courseRating,
        reviewCount: result.reviewCount,
      });
      toast.success(saved ? "Rating updated" : "Thanks for your rating!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mb-6 flex items-center gap-2 text-[14px] text-ink-3">
        <Loader2 size={16} className="animate-spin" /> Checking rating access…
      </div>
    );
  }

  if (!owned) return null;

  const activeStars = hover || stars;

  return (
    <div className="mb-6 rounded-2xl border border-line bg-white p-5">
      <h4 className="text-[15px] font-bold text-navy">
        {saved ? "Update your rating" : "Rate this course"}
      </h4>
      <p className="mt-1 text-[13px] text-ink-3">Select 1-5 stars, then optionally add a short review.</p>

      <div className="mt-4 flex max-h-10 flex-wrap items-center gap-0.5">
        {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            className="rounded p-0.5 transition hover:scale-105"
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(value)}
            aria-label={`Rate ${value} out of 5`}
          >
            <Star
              size={22}
              className={cn(value <= activeStars ? "fill-gold text-gold" : "text-ink-3")}
              stroke="#C9A84C"
            />
          </button>
        ))}
        <span className="ml-2 text-[14px] font-semibold text-navy">
          {activeStars > 0 ? `${activeStars}/5` : "-/5"}
        </span>
      </div>

      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Optional review (what did you like?)"
        className="field-input mt-4 resize-none bg-surface text-[14px]"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="btn btn-navy btn-sm"
          onClick={() => void handleSubmit()}
          disabled={submitting || stars < 1}
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
          {saved ? "Update rating" : "Submit rating"}
        </button>
      </div>
    </div>
  );
}
