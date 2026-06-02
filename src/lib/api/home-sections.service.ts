import { api } from "@/api/http";
import type { HomeSectionsConfig } from "@/lib/api/home-sections.types";

const BASE = "/home_sections";

/** Backend returns a plain array (not paginated like /home/getAll). */
export async function getAllHomeSections(
  opts?: { signal?: AbortSignal }
): Promise<HomeSectionsConfig[]> {
  const res = await api.get<HomeSectionsConfig[]>(`${BASE}/getAll`, { signal: opts?.signal });
  return Array.isArray(res) ? res : [];
}

/** Latest live home sections CMS row. */
export async function getHomeSectionsConfig(): Promise<HomeSectionsConfig | null> {
  try {
    const rows = await getAllHomeSections();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
