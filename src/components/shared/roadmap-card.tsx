import Link from "next/link";
import type { Roadmap } from "@/lib/types";
import { Icon } from "@/lib/icon-map";

export function RoadmapCard({ r }: { r: Roadmap }) {
  return (
    <Link href={`/roadmaps/${r.id}`} className="group relative block overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-card">
      <div className="mb-4 grid h-[50px] w-[50px] place-items-center rounded-[13px] bg-gradient-to-br from-navy to-royal text-gold">
        <Icon name={r.icon} size={24} />
      </div>
      <h3 className="font-sans text-lg font-bold text-navy">{r.title}</h3>
      <p className="mb-3.5 mt-2 min-h-[42px] text-[13.5px] text-ink-3">{r.description}</p>
      <div className="flex justify-between border-t border-surface-2 py-1.5 text-[13px]"><span>Demand</span><span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-extrabold text-[#047857]">{r.demand}</span></div>
      <div className="flex justify-between border-t border-surface-2 py-1.5 text-[13px]"><span>Salary</span><b className="text-navy">{r.salary}</b></div>
      <div className="flex justify-between border-t border-surface-2 py-1.5 text-[13px]"><span>Timeline</span><b className="text-navy">{r.months} months</b></div>
    </Link>
  );
}
