"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Course, Level } from "@/lib/types";
import { categories } from "@/lib/data/categories";
import { CourseCard } from "@/components/shared/course-card";
import { cn } from "@/lib/utils";

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];
const prices = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

export function CoursesExplorer({
  courses,
  initialCat = "all",
  emptyStateText = "No courses found.",
}: {
  courses: Course[];
  initialCat?: string;
  emptyStateText?: string;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCat);
  const [price, setPrice] = useState("all");
  const [picked, setPicked] = useState<Level[]>([]);

  const toggle = (l: Level) => setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        if (q && !`${c.title} ${c.instructor}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat !== "all" && c.category !== cat) return false;
        if (price === "free" && !c.free) return false;
        if (price === "paid" && c.free) return false;
        if (picked.length && !picked.includes(c.level)) return false;
        return true;
      }),
    [courses, q, cat, price, picked]
  );

  return (
    <div className="grid items-start gap-9 md:grid-cols-[260px_1fr]">
      <aside className="sticky top-24 hidden rounded-2xl border border-line bg-white p-[22px] md:block">
        <h4 className="mb-3.5 font-sans text-[14px] font-extrabold uppercase tracking-wider text-navy">Filters</h4>

        <div className="border-t border-surface-2 py-3.5">
          <h4 className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy">Price</h4>
          {prices.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy">
              <input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} className="h-4 w-4 accent-royal" /> {p.label}
            </label>
          ))}
        </div>

        <div className="border-t border-surface-2 py-3.5">
          <h4 className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy">Level</h4>
          {levels.map((l) => (
            <label key={l} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy">
              <input type="checkbox" checked={picked.includes(l)} onChange={() => toggle(l)} className="h-4 w-4 accent-royal" /> {l}
            </label>
          ))}
        </div>

        <div className="border-t border-surface-2 py-3.5">
          <h4 className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy">Category</h4>
          <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy">
            <input type="radio" name="cat" checked={cat === "all"} onChange={() => setCat("all")} className="h-4 w-4 accent-royal" /> All categories
          </label>
          {categories.map((ct) => (
            <label key={ct.id} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] text-ink-2 hover:text-navy">
              <input type="radio" name="cat" checked={cat === ct.id} onChange={() => setCat(ct.id)} className="h-4 w-4 accent-royal" /> {ct.name}
            </label>
          ))}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-white px-4">
          <Search size={20} className="text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses, topics, instructors…"
            className="flex-1 bg-transparent py-3.5 text-[15px] outline-none"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setCat("all")} className={cn("rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition", cat === "all" ? "border-navy bg-navy text-white" : "bg-white text-ink-2 hover:border-royal hover:text-royal")}>All</button>
          {categories.map((ct) => (
            <button key={ct.id} onClick={() => setCat(ct.id)} className={cn("rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition", cat === ct.id ? "border-navy bg-navy text-white" : "bg-white text-ink-2 hover:border-royal hover:text-royal")}>{ct.name}</button>
          ))}
        </div>

        <div className="mb-5 text-[14px] text-ink-3"><b className="text-navy">{filtered.length}</b> courses found</div>

        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => <CourseCard key={c.id} c={c} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
            <Search size={40} className="mx-auto mb-3 text-ink-3" />
            <p className="text-[17px] font-semibold text-navy">{emptyStateText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
