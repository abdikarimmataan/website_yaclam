import { api } from "@/api/http";
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

/** First page of why-yaclam cards for the home section (max 10). */
export async function getWhyYaclamCards(): Promise<WhyYaclamItem[]> {
  try {
    const res = await getAllWhyYaclam({ page: 1, pageSize: 10 });
    if (!Array.isArray(res.data)) return [];
    return res.data.filter((item) => item.isVisible !== false).slice(0, 10);
  } catch {
    return [];
  }
}
