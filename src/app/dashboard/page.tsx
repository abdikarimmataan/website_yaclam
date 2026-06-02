import Link from "next/link";
import { BookOpen, Trophy, Clock, Target, Flame, Play, ArrowRight } from "lucide-react";

export const metadata = { title: "Dashboard" };

const kpis = [
  { icon: BookOpen, v: "3", l: "Active courses" },
  { icon: Trophy, v: "2", l: "Certificates earned" },
  { icon: Clock, v: "48h", l: "Hours learned" },
  { icon: Target, v: "61%", l: "Avg. completion" },
];

const enrolled = [
  { title: "Power BI & Data Analytics Mastery", slug: "power-bi-data-analytics-mastery", progress: 64 },
  { title: "Forex & ICT Trading Foundations", slug: "forex-ict-trading-foundations", progress: 28 },
  { title: "Python for Data Analysis", slug: "python-for-data-analysis", progress: 91 },
];

export default function DashboardHome() {
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-navy to-royal p-7 text-white">
        <div>
          <h2 className="text-[26px] font-semibold">Soo dhawow, Abdikarim 👋</h2>
          <p className="mt-1.5 text-white/80">You&apos;re 64% through Power BI Mastery — keep going!</p>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 font-bold"><Flame size={22} className="text-gold" /> 7-day streak</div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-xl bg-surface text-royal"><k.icon size={20} /></div>
            <div className="font-display text-[30px] font-semibold text-navy">{k.v}</div>
            <div className="text-[13px] text-ink-3">{k.l}</div>
          </div>
        ))}
      </div>

      <h3 className="mb-4 font-sans text-lg font-bold text-navy">Continue learning</h3>
      <div className="flex flex-col gap-4">
        {enrolled.map((c) => (
          <div key={c.slug} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <h4 className="font-sans text-[16px] font-bold text-navy">{c.title}</h4>
              <span className="text-[13px] font-bold text-royal">{c.progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-md bg-surface-2"><div className="h-full rounded-md bg-gradient-to-r from-royal to-gold" style={{ width: `${c.progress}%` }} /></div>
            <Link href={`/learn/${c.slug}`} className="btn btn-outline btn-sm mt-3.5"><Play size={14} /> Continue</Link>
          </div>
        ))}
      </div>

      <Link href="/courses" className="btn btn-gold mt-5">Browse more courses <ArrowRight size={16} /></Link>
    </div>
  );
}
