import { api } from "@/api/http";
import type { HomeConfig, PaginatedHome } from "@/lib/api/home.types";

const BASE = "/home";

export type HomeListParams = {
  page?: number;
  pageSize?: number;
};

export async function getAllHome(
  params?: HomeListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedHome> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  return api.get<PaginatedHome>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

/** Latest live home CMS row for the public site. */
export async function getHomeConfig(): Promise<HomeConfig | null> {
  try {
    const res = await getAllHome({ page: 1, pageSize: 1 });
    const row = Array.isArray(res?.data) ? res.data[0] : undefined;
    return row ?? null;
  } catch {
    return null;
  }
}
