import type { Scholarship } from "@/lib/types";
import type { University, UniversityProgram } from "@/lib/api/university.types";

export type ProgramLevel = string;

export type LevelTab = { id: string; label: string };

export const ALL_LEVEL_TAB: LevelTab = { id: "All", label: "All" };

export const LEVEL_TABS: LevelTab[] = [
  { id: "Bachelor", label: "Bachelor" },
  { id: "Master", label: "Master" },
  { id: "PhD", label: "PhD" },
  { id: "Research", label: "Research Courses" },
  { id: "Internship", label: "Internships & Apprenticeships" },
];

export function withAllLevelTab(tabs: LevelTab[]): LevelTab[] {
  const rest = tabs.filter((tab) => tab.id !== ALL_LEVEL_TAB.id);
  return [ALL_LEVEL_TAB, ...rest];
}

export function isAllLevel(level: string): boolean {
  return level === ALL_LEVEL_TAB.id;
}

export type ExplorerProgram = UniversityProgram & { id: string };

export type ProgramHit = {
  university: University;
  program: ExplorerProgram;
};

const levelKeyword: Record<string, string[]> = {
  Bachelor: ["bachelor", "bsc", "all level", "undergrad", "undergraduate"],
  Master: ["master", "msc", "all level", "graduate"],
  PhD: ["phd", "doctora", "all level", "doctoral"],
  Research: ["phd", "research", "master", "all level"],
  Internship: ["all level", "short", "intern"],
};

function programId(university: University, program: UniversityProgram, index: number): string {
  return `${university.id}-${program.course}-${program.level}-${index}`;
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function scholarshipMatchesLevel(scholarship: Scholarship, wantedKeywords: Set<string>): boolean {
  const slevel = normalizeToken(scholarship.level);
  if (!slevel) return true;
  if (slevel.includes("all level")) return true;
  return Array.from(wantedKeywords).some((k) => slevel.includes(k));
}

function scholarshipMatchesGeo(
  scholarship: Scholarship,
  countries: Set<string>,
  regions: Set<string>
): boolean {
  const sc = normalizeToken(scholarship.country);
  if (!sc) return true;
  if (sc.includes("global") || sc.includes("worldwide") || sc.includes("international")) return true;
  if (sc.includes("europe") || sc.includes("africa") || sc.includes("asia")) {
    return Array.from(regions).some((r) => sc.includes(r) || r.includes(sc));
  }
  return (
    Array.from(countries).some(
      (c) => c && (sc.includes(c) || c.includes(sc) || sc.split(/[\s,]+/)[0] === c.split(/[\s,]+/)[0])
    ) || Array.from(regions).some((r) => sc.includes(r))
  );
}

export function searchPrograms(
  universities: University[],
  level: ProgramLevel,
  query: string
): ProgramHit[] {
  const q = query.trim().toLowerCase();
  const hits: ProgramHit[] = [];

  for (const university of universities) {
    university.programs.forEach((program, index) => {
      if (!isAllLevel(level) && program.level !== level) return;
      const haystack = `${program.course} ${program.field}`.toLowerCase();
      if (
        q &&
        !haystack.includes(q) &&
        !university.name.toLowerCase().includes(q) &&
        !university.country.toLowerCase().includes(q)
      ) {
        return;
      }
      hits.push({
        university,
        program: { ...program, id: programId(university, program, index) },
      });
    });
  }

  return hits;
}

export function relatedScholarships(hits: ProgramHit[], scholarships: Scholarship[]): Scholarship[] {
  if (!scholarships.length) return [];

  if (!hits.length) {
    return scholarships.slice(0, 6);
  }

  const levels = new Set(hits.map((h) => h.program.level));
  const countries = new Set(hits.map((h) => normalizeToken(h.university.country)).filter(Boolean));
  const regions = new Set(hits.map((h) => normalizeToken(h.university.region)).filter(Boolean));

  const wantedKeywords = new Set<string>();
  levels.forEach((lv) => {
    const keywords = levelKeyword[lv];
    if (keywords) keywords.forEach((k) => wantedKeywords.add(k));
  });

  const strict = scholarships.filter(
    (s) =>
      scholarshipMatchesLevel(s, wantedKeywords) &&
      scholarshipMatchesGeo(s, countries, regions)
  );
  if (strict.length) return strict.slice(0, 6);

  const byCountry = scholarships.filter((s) => scholarshipMatchesGeo(s, countries, regions));
  if (byCountry.length) return byCountry.slice(0, 6);

  const byLevel = scholarships.filter((s) => scholarshipMatchesLevel(s, wantedKeywords));
  if (byLevel.length) return byLevel.slice(0, 6);

  return scholarships.slice(0, 6);
}
