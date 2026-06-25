import { api } from "@/api/http";
import { sortBySortOrder } from "@/lib/api/sort-order";
import type {
  CourseCategoryApiRecord,
  PaginatedCourseCategories,
} from "@/lib/api/course-category.types";

const BASE = "/course_categories";

export const DEFAULT_COURSE_CATEGORY_NAME = "New & Popular Courses";

export type CourseCategory = {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
};

function resolveCategoryId(record: CourseCategoryApiRecord): string | null {
  const raw = record.id ?? record._id;
  if (raw == null) return null;
  const id = String(raw).trim();
  return id || null;
}

function toCourseCategory(record: CourseCategoryApiRecord): CourseCategory | null {
  const id = resolveCategoryId(record);
  if (!id) return null;
  return {
    id,
    name: record.name?.trim() || "Category",
    description: record.description?.trim() || undefined,
    sortOrder: Number(record.sortOrder) || 0,
  };
}

function visibleCategories(rows: CourseCategoryApiRecord[]) {
  return rows.filter((c) => c.isVisible !== false);
}

export async function getHomeCourseCategories(): Promise<CourseCategory[]> {
  try {
    const res = await api.get<PaginatedCourseCategories | { message?: string }>(
      `${BASE}/getAll?page=1&pageSize=100&isVisible=true`
    );
    if (!Array.isArray(res.data)) return [];
    return sortBySortOrder(visibleCategories(res.data))
      .map(toCourseCategory)
      .filter((c): c is CourseCategory => c != null);
  } catch {
    return [];
  }
}

export function resolveDefaultCategoryId(categories: CourseCategory[]): string {
  if (!categories.length) return "";
  const byName = categories.find(
    (c) => c.name.toLowerCase() === DEFAULT_COURSE_CATEGORY_NAME.toLowerCase()
  );
  return byName?.id ?? categories[0].id;
}

export function resolveCourseCategoryId(
  courseCategoryId: string | CourseCategoryApiRecord | null | undefined
): string | undefined {
  if (!courseCategoryId) return undefined;
  if (typeof courseCategoryId === "object") {
    const id = courseCategoryId.id ?? (courseCategoryId as { _id?: string })._id;
    return id ? String(id).trim() : undefined;
  }
  const id = String(courseCategoryId).trim();
  return id || undefined;
}
