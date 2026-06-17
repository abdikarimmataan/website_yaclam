"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getInstructorReviews, type InstructorReviewRow } from "@/lib/api/instructor-stats.service";
import { initialsFromName } from "@/lib/auth/session";
import { uploadUrl } from "@/lib/api/cms";

export function InstructorReviewsClient() {
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState<InstructorReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const data = await getInstructorReviews();
      setAvgRating(data.avgRating);
      setReviewCount(data.reviewCount);
      setReviews(data.reviews);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Reviews</h1>
      <p className="mb-6 text-ink-3">Star ratings from learners across your courses.</p>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="rounded-2xl border border-line bg-white px-6 py-5 text-center">
          <div className="font-display text-4xl font-semibold text-navy">
            {loading ? "—" : avgRating.toFixed(1)}
          </div>
          <div className="mt-1 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                fill={s <= Math.round(avgRating) ? "#C9A84C" : "none"}
                stroke="#C9A84C"
              />
            ))}
          </div>
          <div className="mt-1 text-[12px] text-ink-3">
            {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-[14px] text-ink-3">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-5 py-8 text-center text-[14px] text-ink-3">
          No ratings yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => {
            const avatar = uploadUrl(r.avatar);
            const initials = initialsFromName(r.name);
            return (
              <div key={r.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-bold text-gold">
                        {initials}
                      </span>
                    )}
                    <div>
                      <div className="font-bold text-navy">{r.name}</div>
                      <div className="text-[12px] text-ink-3">{r.course}</div>
                    </div>
                  </div>
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        fill={s <= r.rating ? "#C9A84C" : "none"}
                        stroke="#C9A84C"
                      />
                    ))}
                  </span>
                </div>
                {r.text ? <p className="text-[14.5px] text-ink-2">{r.text}</p> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
