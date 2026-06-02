import Link from "next/link";
import { Play } from "lucide-react";
import { courses } from "@/lib/data/courses";

export const metadata = { title: "My Courses" };

const mine = [
  { slug: "power-bi-data-analytics-mastery", progress: 64 },
  { slug: "forex-ict-trading-foundations", progress: 28 },
  { slug: "python-for-data-analysis", progress: 91 },
  { slug: "sql-for-data-analysts-zero-to-job-ready", progress: 12 },
];

export default function MyCourses() {
  const list = mine.map((m) => ({ ...m, course: courses.find((c) => c.slug === m.slug)! })).filter((x) => x.course);
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">My Courses</h1>
      <p className="mb-7 text-ink-3">Pick up where you left off.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {list.map(({ course, progress }) => (
          <div key={course.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative h-28 thumb-pat" style={{ background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }} />
            <div className="p-5">
              <span className="pill">{course.level}</span>
              <h3 className="mt-2 font-sans text-[16px] font-bold text-navy">{course.title}</h3>
              <p className="mt-1 text-[13px] text-ink-3">by {course.instructor}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-md bg-surface-2"><div className="h-full rounded-md bg-gradient-to-r from-royal to-gold" style={{ width: `${progress}%` }} /></div>
                <span className="text-[12px] font-bold text-royal">{progress}%</span>
              </div>
              <Link href={`/learn/${course.slug}`} className="btn btn-navy btn-sm mt-4 w-full"><Play size={14} /> {progress > 0 ? "Continue" : "Start"}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
