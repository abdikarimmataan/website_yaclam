import { api } from "@/api/http";
import { sortBySortOrder } from "@/lib/api/sort-order";
import type { PaginatedWhyYaclam, WhyYaclamItem } from "@/lib/api/why-yaclam.types";

const BASE = "/why_yaclam";

export type WhyYaclamListParams = {
  page?: number;
  pageSize?: number;
};

export async function getAllWhyYaclam(
  params?: WhyYaclamListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedWhyYaclam> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  return api.get<PaginatedWhyYaclam>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

/** Visible why-yaclam cards for the home section, ordered by sortOrder. */
export async function getWhyYaclamCards(): Promise<WhyYaclamItem[]> {
  try {
    const res = await getAllWhyYaclam({ page: 1, pageSize: 100 });
    if (!Array.isArray(res.data)) return [];
    return sortBySortOrder(res.data.filter((item) => item.isVisible !== false));
  } catch {
    return [];
  }
}
