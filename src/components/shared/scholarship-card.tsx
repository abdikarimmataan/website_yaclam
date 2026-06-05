import Link from "next/link";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { ScholarshipFlag } from "@/components/shared/scholarship-flag";
import type { Scholarship } from "@/lib/types";

export function ScholarshipCard({ s }: { s: Scholarship }) {
  return (
    <article className="card-base">
      <div className="thumb-pat relative grid h-[120px] place-items-center text-[44px]" style={{ background: "linear-gradient(135deg, #1F3A93, #0D1B4B)" }}>
        <ScholarshipFlag flag={s.flag} name={s.name} className="relative text-[44px]" imageClassName="h-14 w-20" />
        <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wide ${s.funding === "Full" ? "bg-success text-white" : "bg-gold text-navy"}`}>{s.funding} Funding</span>
      </div>
      <Link href={`/scholarships/${s.slug}`} className="flex flex-1 flex-col gap-2 p-[18px]">
        <span className="pill">{s.level}</span>
        <h3 className="font-sans text-lg font-bold leading-snug text-navy">{s.name}</h3>
        <div className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3"><MapPin size={13} /> {s.country}</div>
        <div className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3"><Calendar size={13} /> {s.deadline}</div>
        <div className="mt-auto flex items-center justify-between border-t border-surface-2 pt-3.5">
          <span className="text-[13px] font-bold text-royal">{s.provider}</span>
          <span className="btn btn-outline btn-sm">Details <ArrowUpRight size={14} /></span>
        </div>
      </Link>
    </article>
  );
}
