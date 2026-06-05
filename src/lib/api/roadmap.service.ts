import { api } from "@/api/http";
import { roadmapTimelineLabel } from "@/lib/api/roadmap-timeline";
import { sortBySortOrder } from "@/lib/api/sort-order";
import type { Roadmap } from "@/lib/types";
import type {
  PaginatedRoadmaps,
  RoadmapApiRecord,
  RoadmapDetail,
  RoadmapsPageResult,
} from "@/lib/api/roadmap.types";

const BASE = "/roadmap";

export const ROADMAPS_PAGE_SIZE = 8;

export type RoadmapListParams = {
  page?: number;
  pageSize?: number;
  isPublished?: boolean;
};

function normalizeDemand(demand?: string): Roadmap["demand"] {
  if (demand === "Very High" || demand === "High" || demand === "Medium") return demand;
  return "High";
}

function visibleRoadmaps(rows: RoadmapApiRecord[]) {
  return rows.filter((r) => r.isVisible !== false && r.isPublished !== false);
}

function roadmapTimestamp(record: RoadmapApiRecord): number {
  const raw = record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

/** Latest saved first — used on /roadmaps listing only. */
export function sortRoadmapsByLatest(rows: RoadmapApiRecord[]): RoadmapApiRecord[] {
  return [...rows].sort((a, b) => {
    const byTime = roadmapTimestamp(b) - roadmapTimestamp(a);
    if (byTime !== 0) return byTime;
    return Number(b.sortOrder ?? 0) - Number(a.sortOrder ?? 0);
  });
}

export function toRoadmap(record: RoadmapApiRecord): Roadmap {
  const steps = (record.steps ?? [])
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => ({
      title: s.title?.trim() || "Step",
      detail: s.detail?.trim() || "",
    }));

  return {
    id: record.id,
    title: record.title,
    icon: record.icon?.trim() || "BookOpen",
    demand: normalizeDemand(record.demand),
    salary: record.salary?.trim() || "—",
    months: Number(record.months) || 0,
    timeline: roadmapTimelineLabel(record),
    skills: Array.isArray(record.skills) ? record.skills.filter(Boolean) : [],
    description: record.description?.trim() || "",
    steps,
  };
}

function toRoadmapDetail(record: RoadmapApiRecord): RoadmapDetail {
  const roadmap = toRoadmap(record);
  const skillsRequired =
    Number(record.skillsRequired) > 0 ? Number(record.skillsRequired) : roadmap.skills.length;
  const ctaVisible = record.ctaButton?.isVisible !== false;
  const cta = {
    label: ctaVisible && record.ctaButton?.label?.trim()
      ? record.ctaButton.label.trim()
      : "Start this path",
    url: ctaVisible && record.ctaButton?.url?.trim()
      ? record.ctaButton.url.trim()
      : "/courses",
  };
  return { roadmap, skillsRequired, cta };
}

export async function getAllRoadmaps(
  params?: RoadmapListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedRoadmaps> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  if (params?.isPublished) q.set("isPublished", "true");
  return api.get<PaginatedRoadmaps>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

/** Published roadmaps for the home section, ordered by sortOrder. */
export async function getHomeRoadmaps(): Promise<Roadmap[]> {
  try {
    const res = await getAllRoadmaps({ page: 1, pageSize: 100, isPublished: true });
    if (!Array.isArray(res.data)) return [];
    return sortBySortOrder(visibleRoadmaps(res.data)).map(toRoadmap);
  } catch {
    return [];
  }
}

const EMPTY_ROADMAPS_PAGE: RoadmapsPageResult = {
  roadmaps: [],
  page: 1,
  pages: 1,
  rows: 0,
  pageSize: ROADMAPS_PAGE_SIZE,
};

/** Paginated roadmaps for /roadmaps listing (latest saved first). */
export async function getRoadmapsPage(
  page = 1,
  pageSize = ROADMAPS_PAGE_SIZE
): Promise<RoadmapsPageResult> {
  try {
    const safePage = Math.max(1, page);
    const res = await getAllRoadmaps({ page: 1, pageSize: 500, isPublished: true });
    const allRows = Array.isArray(res.data)
      ? sortRoadmapsByLatest(visibleRoadmaps(res.data))
      : [];
    const rows = allRows.length;
    const pages = Math.max(1, Math.ceil(rows / pageSize));
    const currentPage = Math.min(safePage, pages);
    const start = (currentPage - 1) * pageSize;

    return {
      roadmaps: allRows.slice(start, start + pageSize).map(toRoadmap),
      page: currentPage,
      pages,
      rows,
      pageSize,
    };
  } catch {
    return EMPTY_ROADMAPS_PAGE;
  }
}

export async function getRoadmapDetail(id: string): Promise<RoadmapDetail | null> {
  try {
    const record = await api.get<RoadmapApiRecord>(`${BASE}/getById/${id}`);
    if (!record?.id || record.isVisible === false || record.isPublished === false) {
      return null;
    }
    return toRoadmapDetail(record);
  } catch {
    return null;
  }
}
