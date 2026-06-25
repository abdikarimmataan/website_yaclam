import { api } from "@/api/http";
import type {
  PaginatedUniversities,
  UniversitiesPageResult,
  University,
  UniversityApiRecord,
  UniversityLanguageRef,
  UniversityLocationRef,
} from "@/lib/api/university.types";

const BASE = "/universities";

export const UNIVERSITIES_PAGE_SIZE = 8;

export type UniversityListParams = {
  page?: number;
  pageSize?: number;
  isPublished?: boolean;
};

function visibleUniversities(rows: UniversityApiRecord[]) {
  return rows.filter((u) => u.isVisible !== false && u.isPublished !== false);
}

function universityTimestamp(record: UniversityApiRecord): number {
  const raw = record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

export function sortUniversitiesByLatest(rows: UniversityApiRecord[]): UniversityApiRecord[] {
  return [...rows].sort((a, b) => {
    const byTime = universityTimestamp(b) - universityTimestamp(a);
    if (byTime !== 0) return byTime;
    return Number(b.sortOrder ?? 0) - Number(a.sortOrder ?? 0);
  });
}

function resolveLocation(location?: string | UniversityLocationRef): { city: string; country: string } {
  if (!location || typeof location === "string") {
    return { city: "—", country: "—" };
  }
  const city = location.name?.trim() || "—";
  const country =
    location.countryId && typeof location.countryId === "object"
      ? location.countryId.name?.trim() || "—"
      : "—";
  return { city, country };
}

function resolveLanguages(languages?: Array<string | UniversityLanguageRef>): string[] {
  if (!Array.isArray(languages)) return [];
  return languages
    .map((lang) => (typeof lang === "object" ? lang.name?.trim() : ""))
    .filter(Boolean) as string[];
}

function normalizePrograms(programs?: UniversityApiRecord["programs"]) {
  if (!Array.isArray(programs)) return [];
  return programs.map((program) => ({
    course: program.course?.trim() || "",
    field: program.field?.trim() || "",
    level: program.level?.trim() || "",
    duration: program.duration?.trim() || "",
    language: program.language?.trim() || "",
    tuition: program.tuition?.trim() || "",
    link: program.link?.trim() || "",
  }));
}

function pickPrimaryDuration(programs: ReturnType<typeof normalizePrograms>): string {
  const bachelor = programs.find((p) => p.level === "Bachelor" && p.duration);
  if (bachelor) return bachelor.duration;
  const first = programs.find((p) => p.duration);
  return first?.duration || "";
}

function resolveUniversityYear(
  record: UniversityApiRecord,
  programs: ReturnType<typeof normalizePrograms>
): string {
  const raw = record.year != null ? String(record.year).trim() : "";
  if (raw && (/\d+\s*year/i.test(raw) || /month/i.test(raw))) return raw;
  const fromPrograms = pickPrimaryDuration(programs);
  return fromPrograms || "—";
}

function resolveUniversityFlag(record: UniversityApiRecord): string {
  const location = record.locationId;
  if (location && typeof location === "object" && location.countryId && typeof location.countryId === "object") {
    const countryFlag = location.countryId.flag?.trim();
    if (countryFlag) return countryFlag;
    const code = location.countryId.code?.trim();
    if (code && /^[A-Za-z]{2}$/.test(code)) {
      return `/uploads/flags/${code.toLowerCase()}.png`;
    }
  }

  const raw = record.flag?.trim() || "";
  if (!raw) return "🎓";
  if (raw.startsWith("/uploads/") || /^https?:\/\//i.test(raw)) return raw;
  if (/^[A-Za-z]{2}$/.test(raw)) return `/uploads/flags/${raw.toLowerCase()}.png`;
  return raw;
}

export function toUniversity(record: UniversityApiRecord): University {
  const { city, country } = resolveLocation(record.locationId);
  const displayCity = record.city?.trim() || city;
  const displayCountry = record.country?.trim() || country;
  const location =
    displayCountry !== "—" ? `${displayCity}, ${displayCountry}` : displayCity;
  const programs = normalizePrograms(record.programs);

  return {
    id: record.id,
    slug: record.slug?.trim() || record.id,
    name: record.name?.trim() || "University",
    location,
    country: displayCountry,
    region: record.region?.trim() || "",
    city: displayCity,
    flag: resolveUniversityFlag(record),
    ranking: record.ranking?.trim() || "",
    year: resolveUniversityYear(record, programs),
    languages: resolveLanguages(record.languageIds),
    feePerYear: record.feePerYear?.trim() || "—",
    website: record.website?.trim() || "",
    programs,
  };
}

export async function getAllUniversities(
  params?: UniversityListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedUniversities> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  if (params?.isPublished) q.set("isPublished", "true");
  return api.get<PaginatedUniversities>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

const EMPTY_UNIVERSITIES_PAGE: UniversitiesPageResult = {
  universities: [],
  page: 1,
  pages: 1,
  rows: 0,
  pageSize: UNIVERSITIES_PAGE_SIZE,
};

export async function getUniversitiesPage(
  page = 1,
  pageSize = UNIVERSITIES_PAGE_SIZE
): Promise<UniversitiesPageResult> {
  try {
    const safePage = Math.max(1, page);
    const res = await getAllUniversities({ page: 1, pageSize: 500, isPublished: true });
    const allRows = Array.isArray(res.data)
      ? sortUniversitiesByLatest(visibleUniversities(res.data))
      : [];
    const rows = allRows.length;
    const pages = Math.max(1, Math.ceil(rows / pageSize));
    const currentPage = Math.min(safePage, pages);
    const start = (currentPage - 1) * pageSize;

    return {
      universities: allRows.slice(start, start + pageSize).map(toUniversity),
      page: currentPage,
      pages,
      rows,
      pageSize,
    };
  } catch {
    return EMPTY_UNIVERSITIES_PAGE;
  }
}

export function programDurationLabel(university: University, program: { duration?: string }): string {
  const duration = program.duration?.trim();
  if (duration) return duration;
  const year = university.year?.trim();
  if (year && year !== "—") return year;
  return "—";
}

export function programExternalUrl(program: { link?: string }, university: University): string {
  const link = program.link?.trim();
  if (link) return universityExternalUrl(link);
  return universityExternalUrl(university.website);
}

export function universityExternalUrl(url: string): string {
  const u = url.trim();
  if (!u) return "#";
  if (/^https?:\/\//i.test(u)) return u;
  return u.startsWith("/") ? u : `https://${u}`;
}
