import { api } from "@/api/http";
import { sortBySortOrder } from "@/lib/api/sort-order";
import { slugify } from "@/lib/utils";

export type CourseFieldOption = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  courseCount: number;
};

type FieldByCourseRow = {
  id?: string;
  _id?: string;
  name?: string;
  icon?: string;
  sortOrder?: number;
  isVisible?: boolean;
  courseCount?: number;
};

export async function getCourseFields(): Promise<CourseFieldOption[]> {
  try {
    const data = await api.get<FieldByCourseRow[]>("/fields/getAllFieldByCourse", {
      auth: false,
    });
    if (!Array.isArray(data)) return [];
    const options = data
      .filter((row) => row.isVisible !== false)
      .map((row) => {
        const id = String(row.id ?? row._id ?? "").trim();
        const name = String(row.name ?? "").trim();
        if (!id || !name) return null;
        return {
          id,
          name,
          slug: slugify(name),
          icon: row.icon?.trim() || undefined,
          courseCount: Number(row.courseCount) || 0,
        };
      })
      .filter((row) => row != null) as CourseFieldOption[];
    return sortBySortOrder(
      options as Array<CourseFieldOption & { sortOrder?: number }>
    ) as CourseFieldOption[];
  } catch {
    return [];
  }
}

export function resolveCourseFieldFilter(
  fields: CourseFieldOption[],
  cat?: string | null
): string {
  const raw = String(cat ?? "").trim();
  if (!raw || raw === "all") return "all";
  if (fields.some((f) => f.id === raw)) return raw;
  const bySlug = fields.find((f) => f.slug === raw);
  if (bySlug) return bySlug.id;
  return raw;
}
