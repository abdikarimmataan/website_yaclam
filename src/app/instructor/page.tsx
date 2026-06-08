import Link from "next/link";
import { Users, DollarSign, BookOpen, Star, TrendingUp, Plus } from "lucide-react";

export default function InstructorOverview() {
  const kpis = [
    { icon: Users, v: "12,431", l: "Total students", up: "+312 this month" },
    { icon: DollarSign, v: "$8,940", l: "Total earnings", up: "+$640 this month" },
    { icon: BookOpen, v: "9", l: "Published courses", up: "2 in draft" },
    { icon: Star, v: "4.8", l: "Avg. rating", up: "1,240 reviews" },
  ];
  const top = [
    { title: "Power BI & Data Analytics Mastery", students: 3820, revenue: "$3,140", rating: 4.9 },
    { title: "Forex & ICT Trading Foundations", students: 5140, revenue: "$2,980", rating: 4.7 },
    { title: "AI & Prompt Engineering Essentials", students: 3400, revenue: "$1,560", rating: 4.8 },
  ];
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-[28px]">Instructor Overview</h1>
          <p className="text-sm text-ink-3 sm:text-base">Welcome back, Abdikarim. Here&apos;s how your courses are doing.</p>
        </div>
        <Link href="/instructor/courses?create=1" className="btn btn-gold"><Plus size={17} /> New course</Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-xl bg-surface text-royal"><k.icon size={20} /></div>
            <div className="font-display text-[28px] font-semibold text-navy">{k.v}</div>
            <div className="text-[13px] text-ink-3">{k.l}</div>
            <div className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-success"><TrendingUp size={12} /> {k.up}</div>
          </div>
        ))}
      </div>

      <h3 className="mb-4 font-sans text-lg font-bold text-navy">Top performing courses</h3>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 border-b border-line bg-surface px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-ink-3 md:grid">
          <span>Course</span><span>Students</span><span>Revenue</span><span>Rating</span>
        </div>
        {top.map((c) => (
          <div key={c.title} className="grid grid-cols-1 gap-1.5 border-b border-surface-2 px-5 py-4 text-[14px] last:border-b-0 md:grid-cols-[2fr_1fr_1fr_0.8fr] md:items-center md:gap-3">
            <span className="font-semibold text-navy">{c.title}</span>
            <span className="text-ink-2">{c.students.toLocaleString()} students</span>
            <span className="font-bold text-navy">{c.revenue}</span>
            <span className="flex items-center gap-1 text-ink-2"><Star size={13} fill="#C9A84C" stroke="#C9A84C" /> {c.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
