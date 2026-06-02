"use client";

import { useState } from "react";
import { ChevronDown, Play, Lock, Star, CheckCircle2 } from "lucide-react";
import type { Course, Module } from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Curriculum", "Details", "Instructor", "Reviews"] as const;
type Tab = (typeof TABS)[number];

const sampleReviews = [
  { name: "Maxamed A.", rating: 5, date: "2 weeks ago", text: "Casharradu aad bay u faahfaahsan yihiin. Si fudud baan u fahmay — waan ku talin lahaa qof kasta.", initials: "MA" },
  { name: "Khadija H.", rating: 5, date: "1 month ago", text: "The projects are practical and the Somali explanations made hard concepts click. Worth every cent.", initials: "KH" },
  { name: "Cabdi N.", rating: 4, date: "1 month ago", text: "Great course overall. Would love even more advanced exercises at the end, but the foundation is excellent.", initials: "CN" },
];

export function CourseTabs({ course, modules }: { course: Course; modules: Module[] }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [open, setOpen] = useState(0);
  const initials = course.instructor.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <div>
      <div className="sticky top-[72px] z-10 -mx-1 mb-7 flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative whitespace-nowrap rounded-lg px-4 py-2.5 text-[14.5px] font-semibold transition",
              tab === t ? "bg-navy text-white" : "text-ink-2 hover:text-navy"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div>
          <h2 className="mb-4 text-[24px] font-semibold text-navy">Build smarter, not harder</h2>
          <p className="mb-4 text-[16px] leading-[1.8] text-ink-2">{course.description}</p>
          <h3 className="mb-3 mt-7 text-[19px] font-bold text-navy">What you&apos;ll master</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {course.outcomes.map((o) => (
              <li key={o} className="flex gap-2.5 text-[15px] text-ink-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-royal" /> {o}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "Curriculum" && (
        <div className="overflow-hidden rounded-2xl border border-line">
          {modules.map((m, i) => (
            <div key={m.title} className="border-b border-surface-2 last:border-b-0">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between bg-surface px-5 py-4 text-left font-semibold text-navy">
                <span>{m.title} · {m.lessons.length} lessons</span>
                <ChevronDown size={18} className={cn("transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="px-5 pb-3.5 pt-1.5">
                  {m.lessons.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-3 py-2.5 text-[14px] text-ink-2">
                      <span className="flex items-center gap-2.5">
                        {l.free ? <Play size={15} className="text-royal" /> : <Lock size={14} className="text-ink-3" />}
                        {l.title}
                      </span>
                      <span className="shrink-0 text-[13px] text-ink-3">{l.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "Details" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Skill level", course.level],
            ["Language", course.language],
            ["Lessons", `${course.lessons}`],
            ["Duration", `${course.hours} hours`],
            ["Certificate", course.certificate ? "Yes" : "No"],
            ["Access", course.expiry],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-xl border border-line bg-surface px-4 py-3.5 text-[14.5px]">
              <span className="text-ink-3">{k}</span><b className="text-navy">{v}</b>
            </div>
          ))}
        </div>
      )}

      {tab === "Instructor" && (
        <div className="flex items-start gap-5 rounded-2xl border border-line bg-white p-6">
          <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full font-display text-2xl font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }}>{initials}</div>
          <div>
            <h3 className="font-sans text-lg font-bold text-navy">{course.instructor}</h3>
            <p className="mt-1 text-[14.5px] text-ink-3">Practitioner-instructor with years of real-world experience, teaching the exact skills employers test for — explained in Somali with English technical terms.</p>
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div>
          <div className="mb-6 flex items-center gap-5 rounded-2xl border border-line bg-surface p-6">
            <div className="text-center">
              <div className="font-display text-5xl font-semibold text-navy">{course.rating.toFixed(1)}</div>
              <div className="mt-1 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={15} fill={s <= Math.round(course.rating) ? "#C9A84C" : "none"} stroke="#C9A84C" />)}
              </div>
              <div className="mt-1 text-[13px] text-ink-3">{course.reviews} reviews</div>
            </div>
            <p className="text-[14.5px] text-ink-2">Rated by {course.reviews.toLocaleString()} learners. Here&apos;s what a few of them said.</p>
          </div>
          <div className="flex flex-col gap-4">
            {sampleReviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-line bg-white p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-navy font-bold text-gold">{r.initials}</div>
                  <div>
                    <div className="font-bold text-navy">{r.name}</div>
                    <div className="flex items-center gap-2 text-[12px] text-ink-3">
                      <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={11} fill={s <= r.rating ? "#C9A84C" : "none"} stroke="#C9A84C" />)}</span>
                      {r.date}
                    </div>
                  </div>
                </div>
                <p className="text-[14.5px] text-ink-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
