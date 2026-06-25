import Link from "next/link";
import { MapPin, Clock, Globe, Languages, ArrowUpRight } from "lucide-react";
import type { University } from "@/lib/api/university.types";
import { universityExternalUrl } from "@/lib/api/university.service";

export function UniversityCard({ university }: { university: University }) {
  const website = universityExternalUrl(university.website);

  return (
    <article className="card-base">
      <div
        className="thumb-pat relative grid h-[120px] place-items-center text-white"
        style={{ background: "linear-gradient(135deg, #1F3A93, #0D1B4B)" }}
      >
        <span className="text-4xl font-bold opacity-90">{university.flag || "🎓"}</span>
        {university.feePerYear !== "—" ? (
          <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wide text-navy">
            {university.feePerYear}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-[18px]">
        {university.ranking ? (
          <span className="pill">{university.ranking}</span>
        ) : null}
        <h3 className="font-sans text-lg font-bold leading-snug text-navy">{university.name}</h3>
        <div className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
          <MapPin size={13} /> {university.location}
        </div>
        <div className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
          <Clock size={13} /> {university.year}
        </div>
        {university.programs.length > 0 ? (
          <div className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
            <Languages size={13} /> {university.programs.length} programs
          </div>
        ) : university.languages.length > 0 ? (
          <div className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
            <Languages size={13} /> {university.languages.join(", ")}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between border-t border-surface-2 pt-3.5">
          {university.website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-royal hover:underline"
            >
              <Globe size={14} /> Website
            </a>
          ) : (
            <span className="text-[13px] font-bold text-ink-3">—</span>
          )}
          {university.website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Visit <ArrowUpRight size={14} />
            </a>
          ) : (
            <Link href="/scholarships" className="btn btn-outline btn-sm">
              Scholarships <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
