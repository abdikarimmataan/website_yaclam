import { api } from "@/api/http";
import type { Scholarship } from "@/lib/types";
import { slugify } from "@/lib/utils";
import type {
  PaginatedScholarships,
  ScholarshipApiRecord,
  ScholarshipDetailView,
  ScholarshipsPageResult,
} from "@/lib/api/scholarship.types";

const BASE = "/scholarship";

export const SCHOLARSHIPS_PAGE_SIZE = 9;
export const HOME_SCHOLARSHIPS_COUNT = 4;

export type ScholarshipListParams = {
  page?: number;
  pageSize?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
};

function normalizeFunding(funding?: string): Scholarship["funding"] {
  return funding === "Partial" ? "Partial" : "Full";
}

function visibleScholarships(rows: ScholarshipApiRecord[]) {
  return rows.filter((s) => s.isVisible !== false && s.isPublished !== false);
}

function scholarshipTimestamp(record: ScholarshipApiRecord): number {
  const raw = record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

export function sortScholarshipsByLatest(rows: ScholarshipApiRecord[]): ScholarshipApiRecord[] {
  return [...rows].sort((a, b) => {
    const byTime = scholarshipTimestamp(b) - scholarshipTimestamp(a);
    if (byTime !== 0) return byTime;
    return Number(b.sortOrder ?? 0) - Number(a.sortOrder ?? 0);
  });
}

function listStrings(values?: string[]) {
  return Array.isArray(values) ? values.map((v) => v.trim()).filter(Boolean) : [];
}

export function toScholarship(record: ScholarshipApiRecord): Scholarship {
  const name = record.name?.trim() || record.title?.trim() || "Scholarship";
  const overview = record.overview?.trim() || record.description?.trim() || "";
  const website = record.website?.trim() || record.applicationUrl?.trim() || "";

  return {
    id: record.id,
    slug: record.id,
    name,
    provider: record.provider?.trim() || "—",
    country: record.country?.trim() || "—",
    level: record.level?.trim() || "—",
    funding: normalizeFunding(record.funding),
    deadline: record.deadline?.trim() || "—",
    flag: record.flag?.trim() || "🌍",
    website,
    overview,
    benefits: listStrings(record.benefits),
    eligibility: listStrings(record.eligibility),
    documents: listStrings(record.documents),
  };
}

function toScholarshipDetailView(record: ScholarshipApiRecord): ScholarshipDetailView {
  const scholarship = toScholarship(record);
  const ctaVisible = record.ctaButton?.isVisible !== false;
  const ctaUrl =
    (ctaVisible && record.ctaButton?.url?.trim()) ||
    scholarship.website ||
    "";
  const cta = {
    label:
      ctaVisible && record.ctaButton?.label?.trim()
        ? record.ctaButton.label.trim()
        : "Official Website",
    url: ctaUrl,
  };
  return { scholarship, cta };
}

export async function getAllScholarships(
  params?: ScholarshipListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedScholarships> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  if (params?.isPublished) q.set("isPublished", "true");
  if (params?.isFeatured) q.set("isFeatured", "true");
  return api.get<PaginatedScholarships>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

/** Four most recently saved published scholarships for the home section. */
export async function getHomeScholarships(): Promise<Scholarship[]> {
  try {
    const res = await getAllScholarships({ page: 1, pageSize: 100, isPublished: true });
    if (!Array.isArray(res.data)) return [];
    return sortScholarshipsByLatest(visibleScholarships(res.data))
      .slice(0, HOME_SCHOLARSHIPS_COUNT)
      .map(toScholarship);
  } catch {
    return [];
  }
}

const EMPTY_SCHOLARSHIPS_PAGE: ScholarshipsPageResult = {
  scholarships: [],
  page: 1,
  pages: 1,
  rows: 0,
  pageSize: SCHOLARSHIPS_PAGE_SIZE,
};

/** Paginated scholarships for /scholarships listing. */
export async function getScholarshipsPage(
  page = 1,
  pageSize = SCHOLARSHIPS_PAGE_SIZE
): Promise<ScholarshipsPageResult> {
  try {
    const safePage = Math.max(1, page);
    const res = await getAllScholarships({
      page: safePage,
      pageSize,
      isPublished: true,
    });
    const rows = Array.isArray(res.data) ? visibleScholarships(res.data) : [];
    const pages = Math.max(1, res.pages ?? 1);
    return {
      scholarships: rows.map(toScholarship),
      page: Math.min(safePage, pages),
      pages,
      rows: res.rows ?? rows.length,
      pageSize: res.pageSize ?? pageSize,
    };
  } catch {
    return EMPTY_SCHOLARSHIPS_PAGE;
  }
}

export async function getScholarshipDetail(slug: string): Promise<ScholarshipDetailView | null> {
  const byId = await fetchScholarshipById(slug);
  if (byId) return byId;

  try {
    const res = await getAllScholarships({ page: 1, pageSize: 500, isPublished: true });
    if (!Array.isArray(res.data)) return null;
    const match = visibleScholarships(res.data).find(
      (row) => slugify(row.name?.trim() || row.title?.trim() || "") === slug
    );
    return match ? toScholarshipDetailView(match) : null;
  } catch {
    return null;
  }
}

async function fetchScholarshipById(id: string): Promise<ScholarshipDetailView | null> {
  try {
    const record = await api.get<ScholarshipApiRecord>(`${BASE}/getById/${id}`);
    if (!record?.id || record.isVisible === false || record.isPublished === false) {
      return null;
    }
    return toScholarshipDetailView(record);
  } catch {
    return null;
  }
}

export function scholarshipExternalUrl(url: string): string {
  const u = url.trim();
  if (!u) return "#";
  if (/^https?:\/\//i.test(u)) return u;
  return u.startsWith("/") ? u : `https://${u}`;
}
