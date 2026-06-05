import { api } from "@/api/http";
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

/** First four published roadmaps for the home section. */
export async function getHomeRoadmaps(): Promise<Roadmap[]> {
  try {
    const res = await getAllRoadmaps({ page: 1, pageSize: 4, isPublished: true });
    if (!Array.isArray(res.data)) return [];
    return visibleRoadmaps(res.data).slice(0, 4).map(toRoadmap);
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

/** Paginated roadmaps for /roadmaps listing (8 per page). */
export async function getRoadmapsPage(
  page = 1,
  pageSize = ROADMAPS_PAGE_SIZE
): Promise<RoadmapsPageResult> {
  try {
    const safePage = Math.max(1, page);
    const res = await getAllRoadmaps({
      page: safePage,
      pageSize,
      isPublished: true,
    });
    const rows = Array.isArray(res.data) ? visibleRoadmaps(res.data) : [];
    const pages = Math.max(1, res.pages ?? 1);
    return {
      roadmaps: rows.map(toRoadmap),
      page: Math.min(safePage, pages),
      pages,
      rows: res.rows ?? rows.length,
      pageSize: res.pageSize ?? pageSize,
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
