"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Languages,
  GraduationCap,
  ExternalLink,
  BookOpen,
  Calendar,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import {
  ALL_LEVEL_TAB,
  LEVEL_TABS,
  isAllLevel,
  relatedScholarships,
  searchPrograms,
  withAllLevelTab,
  type LevelTab,
  type ProgramLevel,
} from "@/lib/api/university-explorer";
import { programDurationLabel, programExternalUrl } from "@/lib/api/university.service";
import type { University } from "@/lib/api/university.types";
import type { Scholarship } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScholarshipFlag } from "@/components/shared/scholarship-flag";

type UniversitiesExplorerProps = {
  universities: University[];
  scholarships: Scholarship[];
  levelTabs?: LevelTab[];
  emptyStateText?: string;
};

export function UniversitiesExplorer({
  universities,
  scholarships,
  levelTabs = withAllLevelTab(LEVEL_TABS),
  emptyStateText = "No programs match your search. Try a broader term or another tab.",
}: UniversitiesExplorerProps) {
  const [level, setLevel] = useState<ProgramLevel>(ALL_LEVEL_TAB.id);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!levelTabs.some((tab) => tab.id === level)) {
      setLevel(levelTabs[0]?.id ?? ALL_LEVEL_TAB.id);
    }
  }, [levelTabs, level]);

  const hits = useMemo(
    () => searchPrograms(universities, level, query),
    [universities, level, query]
  );
  const matchedScholarships = useMemo(
    () => relatedScholarships(hits, scholarships),
    [hits, scholarships]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof hits>();
    for (const hit of hits) {
      const key = hit.program.course;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(hit);
    }
    return Array.from(map.entries());
  }, [hits]);

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-2">
        {levelTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setLevel(tab.id)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-[14px] font-semibold transition",
              level === tab.id
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-ink-2 hover:border-royal hover:text-royal"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-white px-4">
        <Search size={20} className="text-ink-3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search a course or university (e.g. "Data Science" or "Oxford")…'
          className="flex-1 bg-transparent py-3.5 text-[15px] outline-none"
        />
      </div>

      <p className="mb-7 text-[13px] text-ink-3">
        Showing <b className="text-navy">{hits.length}</b>{" "}
        {isAllLevel(level)
          ? "programs"
          : level === "Internship"
            ? "internship/apprenticeship programs"
            : `${level} programs`}{" "}
        across <b className="text-navy">{new Set(hits.map((h) => h.university.id)).size}</b>{" "}
        universities.
      </p>

      {grouped.length > 0 ? (
        <div className="flex flex-col gap-8">
          {grouped.map(([course, items]) => (
            <section key={course}>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-royal" />
                <h2 className="font-sans text-[19px] font-bold text-navy">{course}</h2>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] font-semibold text-royal">
                  {items.length} {items.length === 1 ? "university" : "universities"}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map(({ university, program }) => (
                  <div
                    key={program.id}
                    className="card-base !flex-row items-stretch overflow-hidden"
                  >
                    <div
                      className="flex w-16 shrink-0 items-center justify-center overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #1F3A93, #0D1B4B)" }}
                    >
                      <ScholarshipFlag
                        flag={university.flag}
                        name={university.name}
                        className="text-3xl"
                        imageClassName="h-10 w-14 object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-sans text-[15.5px] font-bold text-navy">
                        {university.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-3">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {university.city}, {university.country}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {programDurationLabel(university, program)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Languages size={12} /> {program.language}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[13px] font-bold text-royal">
                          {program.tuition || "—"}
                        </span>
                        <a
                          href={programExternalUrl(program, university)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          Visit <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center text-ink-3">
          <Building2 size={40} className="mx-auto mb-3" />
          <p>
            {query
              ? `No ${isAllLevel(level) ? "" : `${level} `}programs match “${query}”. Try a broader term or another tab.`
              : emptyStateText}
          </p>
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-line bg-surface p-6">
        <div className="mb-1 flex items-center gap-2">
          <GraduationCap size={20} className="text-royal" />
          <h2 className="font-sans text-[19px] font-bold text-navy">Related scholarships</h2>
        </div>
        <p className="mb-5 text-[13.5px] text-ink-3">
          Funding that fits the level and destinations in your results.
        </p>
        {matchedScholarships.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matchedScholarships.map((s) => (
              <Link
                key={String(s.id)}
                href={`/scholarships/${s.slug}`}
                className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-gold hover:shadow-soft"
              >
                <ScholarshipFlag
                  flag={s.flag}
                  name={s.name}
                  className="text-2xl"
                  imageClassName="h-8 w-11 shrink-0"
                />
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-navy">{s.name}</div>
                  <div className="mt-0.5 text-[12px] text-ink-3">
                    {s.country} · {s.level}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-ink-3">
                    <Calendar size={11} /> {s.deadline}
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-ink-3" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-ink-3">
            No scholarships match your current filters yet. Browse the full list below.
          </p>
        )}
        <Link
          href="/scholarships"
          className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-royal hover:text-navy"
        >
          Browse all scholarships <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
