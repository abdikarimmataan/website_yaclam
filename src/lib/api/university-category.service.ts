import { api } from "@/api/http";
import type { LevelTab } from "@/lib/api/university-explorer";
import { LEVEL_TABS, withAllLevelTab } from "@/lib/api/university-explorer";

type UniversityCategoryApiRecord = {
  id: string;
  name?: string;
  isVisible?: boolean;
};

type PaginatedCategories = {
  data?: UniversityCategoryApiRecord[];
};

export async function getUniversityLevelTabs(): Promise<LevelTab[]> {
  try {
    const res = await api.get<PaginatedCategories>(
      "/university_categories/getAll?page=1&pageSize=100"
    );
    const rows = Array.isArray(res.data)
      ? res.data.filter((row) => row.isVisible !== false && String(row.name ?? "").trim())
      : [];
    if (!rows.length) return withAllLevelTab(LEVEL_TABS);
    return withAllLevelTab(
      rows.map((row) => {
        const name = String(row.name).trim();
        return { id: name, label: name };
      })
    );
  } catch {
    return withAllLevelTab(LEVEL_TABS);
  }
}
