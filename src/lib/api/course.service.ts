import { api } from "@/api/http";
import { sortBySortOrder } from "@/lib/api/sort-order";
import type { Course, Level } from "@/lib/types";
import type {
  CourseApiRecord,
  CoursesPageResult,
  PaginatedCourses,
} from "@/lib/api/course.types";

const BASE = "/course";

export const COURSES_PAGE_SIZE = 9;

export type CourseListParams = {
  page?: number;
  pageSize?: number;
  category?: string;
  isFree?: boolean;
  isFeatured?: boolean;
};

function normalizeLevel(level?: string): Level {
  if (level === "Intermediate" || level === "Advanced") return level;
  return "Beginner";
}

function visibleCourses(rows: CourseApiRecord[]) {
  return rows.filter(
    (c) => c.isVisible !== false && c.isPublished !== false && c.status !== false
  );
}

export function toCourse(record: CourseApiRecord): Course {
  const instructor =
    record.instructorName?.trim() || record.instructor?.name?.trim() || "Instructor";
  const hours = Number(record.durationHours ?? record.details?.durationHours) || 0;
  const lessons = Number(record.lessonCount ?? record.details?.lessonCount) || 0;
  const isFree = record.isFree === true;

  return {
    id: record.id,
    slug: record.id,
    title: record.title?.trim() || "Course",
    category: record.category?.trim() || "general",
    instructor,
    level: normalizeLevel(record.level || record.details?.skillLevel),
    rating: Number(record.rating) || 0,
    reviews: Number(record.reviewCount) || 0,
    students: Number(record.studentCount) || 0,
    hours,
    lessons,
    price: Number(record.price) || 0,
    oldPrice: record.originalPrice ? Number(record.originalPrice) : undefined,
    free: isFree,
    badge:
      record.badge?.trim() ||
      (isFree ? "FREE" : record.isFeatured ? "FEATURED" : undefined),
    color: record.color?.trim() || "#1F3A93",
    description:
      record.description?.trim() ||
      record.shortDescription?.trim() ||
      record.overview?.description?.trim() ||
      "",
    outcomes: Array.isArray(record.overview?.outcomes)
      ? record.overview!.outcomes!.filter(Boolean)
      : [],
    language: record.language?.trim() || record.details?.language || "Somali",
    expiry: record.access?.trim() || record.details?.access || "1 Year",
    certificate: record.certificate ?? record.details?.certificate ?? true,
  };
}

export async function getAllCourses(
  params?: CourseListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedCourses> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? COURSES_PAGE_SIZE));
  if (params?.category) q.set("category", params.category);
  if (params?.isFree) q.set("isFree", "true");
  if (params?.isFeatured) q.set("isFeatured", "true");
  return api.get<PaginatedCourses>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

const EMPTY_COURSES_PAGE: CoursesPageResult = {
  courses: [],
  page: 1,
  pages: 1,
  rows: 0,
  pageSize: COURSES_PAGE_SIZE,
};

/** Featured published courses for the home section, ordered by sortOrder. */
export async function getHomeFeaturedCourses(limit = 5): Promise<Course[]> {
  try {
    const res = await getAllCourses({ page: 1, pageSize: 100, isFeatured: true });
    if (!Array.isArray(res.data)) return [];
    return sortBySortOrder(visibleCourses(res.data))
      .slice(0, Math.max(0, limit))
      .map(toCourse);
  } catch {
    return [];
  }
}

/** Paginated courses for /courses listing (9 per page). */
export async function getCoursesPage(
  page = 1,
  pageSize = COURSES_PAGE_SIZE
): Promise<CoursesPageResult> {
  try {
    const safePage = Math.max(1, page);
    const res = await getAllCourses({ page: safePage, pageSize });
    const rows = Array.isArray(res.data) ? visibleCourses(res.data) : [];
    const pages = Math.max(1, res.pages ?? 1);
    return {
      courses: rows.map(toCourse),
      page: Math.min(safePage, pages),
      pages,
      rows: res.rows ?? rows.length,
      pageSize: res.pageSize ?? pageSize,
    };
  } catch {
    return EMPTY_COURSES_PAGE;
  }
}
