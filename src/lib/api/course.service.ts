import { api } from "@/api/http";
import { sortBySortOrder, sortCoursesForListing } from "@/lib/api/sort-order";
import type { Course, CourseResource, Level, Module } from "@/lib/types";
import type {
  CourseApiRecord,
  CourseDetail,
  CourseModuleApiRecord,
  CourseResourceApiRecord,
  CoursesPageResult,
  PaginatedCourses,
} from "@/lib/api/course.types";
import { resolveLessonType } from "@/lib/lesson-media";

const BASE = "/course";

export const COURSES_PAGE_SIZE = 9;
export const HOME_LATEST_COURSES = 6;

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

function resolveCourseId(record: CourseApiRecord): string | null {
  const raw = record.id ?? record._id;
  if (raw == null) return null;
  const id = String(raw).trim();
  return id || null;
}

function normalizeCourseRecord(raw: CourseApiRecord): CourseApiRecord | null {
  const id = resolveCourseId(raw);
  if (!id) return null;
  return { ...raw, id };
}

function isTruthyFlag(value: unknown, defaultValue = true): boolean {
  if (value === false || value === "false" || value === "0" || value === 0) return false;
  if (value === true || value === "true" || value === "1" || value === 1) return true;
  return defaultValue;
}

function visibleCourses(rows: CourseApiRecord[]) {
  return rows
    .map(normalizeCourseRecord)
    .filter((c): c is CourseApiRecord => {
      if (!c) return false;
      return (
        isTruthyFlag(c.isVisible) &&
        isTruthyFlag(c.isPublished) &&
        isTruthyFlag(c.status)
      );
    });
}

function courseTimestamp(record: CourseApiRecord): number {
  const raw = record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

/** Latest saved first — used on the home section. */
export function sortCoursesByLatest(rows: CourseApiRecord[]): CourseApiRecord[] {
  return [...rows].sort((a, b) => {
    const byTime = courseTimestamp(b) - courseTimestamp(a);
    if (byTime !== 0) return byTime;
    return Number(b.sortOrder ?? 0) - Number(a.sortOrder ?? 0);
  });
}

function resolveFieldMeta(record: CourseApiRecord) {
  const field = record.fieldId;
  if (field && typeof field === "object") {
    const fieldId = field.id ? String(field.id).trim() : undefined;
    return {
      fieldId,
      category: field.name?.trim() || record.category?.trim() || "general",
      categoryIcon: field.icon?.trim() || undefined,
    };
  }
  if (typeof field === "string" && field.trim()) {
    return {
      fieldId: field.trim(),
      category: record.category?.trim() || "general",
      categoryIcon: undefined,
    };
  }
  return {
    fieldId: undefined,
    category: record.category?.trim() || "general",
    categoryIcon: undefined,
  };
}

function extractPreviewVideoUrl(record: CourseApiRecord): string | undefined {
  const direct = record.previewVideoUrl?.trim();
  if (direct) return direct;

  for (const mod of record.curriculum ?? []) {
    for (const lesson of mod.lessons ?? []) {
      const url = lesson.videoUrl?.trim();
      if (url) return url;
    }
  }
  return undefined;
}

function toModules(curriculum: CourseModuleApiRecord[] | undefined): Module[] {
  return (curriculum ?? [])
    .filter((module) => module.isVisible !== false)
    .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
    .map((module, moduleIndex) => ({
      title: module.title?.trim() || `Module ${moduleIndex + 1}`,
      lessons: (module.lessons ?? [])
        .filter((lesson) => lesson.isVisible !== false)
        .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
        .map((lesson, lessonIndex) => ({
          id: String(lesson.id ?? `${moduleIndex}-${lessonIndex}`),
          title: lesson.title?.trim() || "Untitled lesson",
          duration: lesson.duration?.trim() || "",
          lessonType: resolveLessonType(lesson),
          vimeoId: lesson.vimeoId?.trim() || "",
          videoUrl: lesson.videoUrl?.trim() || "",
          linkUrl: lesson.linkUrl?.trim() || "",
          free: lesson.free === true,
        })),
    }));
}

export function toCourse(record: CourseApiRecord): Course {
  const id = resolveCourseId(record) ?? "";
  const instructor =
    record.instructorName?.trim() || record.instructor?.name?.trim() || "Instructor";
  const hours = Number(record.durationHours ?? record.details?.durationHours) || 0;
  const lessons = Number(record.lessonCount ?? record.details?.lessonCount) || 0;
  const isFree = record.isFree === true;
  const { category, categoryIcon, fieldId } = resolveFieldMeta(record);

  return {
    id,
    slug: id,
    title: record.title?.trim() || "Course",
    category,
    fieldId,
    categoryIcon,
    instructor,
    instructorRole: record.instructor?.role?.trim() || undefined,
    instructorBio: record.instructor?.bio?.trim() || undefined,
    instructorAvatar: record.instructor?.avatar?.trim() || undefined,
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
    overviewHeadline: record.overview?.headline?.trim() || undefined,
    outcomes: Array.isArray(record.overview?.outcomes)
      ? record.overview!.outcomes!.filter(Boolean)
      : [],
    language: record.language?.trim() || record.details?.language || "Somali",
    expiry: record.access?.trim() || record.details?.access || "1 Year",
    certificate: record.certificate ?? record.details?.certificate ?? true,
    thumbnail: record.thumbnail?.trim() || undefined,
    previewVideoUrl: extractPreviewVideoUrl(record),
  };
}

function toResources(resources: CourseResourceApiRecord[] | undefined): CourseResource[] {
  return (resources ?? [])
    .filter((resource) => resource.isVisible !== false)
    .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
    .map((resource, index) => ({
      id: String(resource.id ?? `resource-${index}`),
      title: resource.title?.trim() || "Resource",
      description: resource.description?.trim() || "",
      fileUrl: resource.fileUrl?.trim() || "",
      fileName: resource.fileName?.trim() || "",
      fileSize: Number(resource.fileSize ?? 0) || undefined,
      mimeType: resource.mimeType?.trim() || "",
    }))
    .filter((resource) => resource.fileUrl);
}

function toCourseDetail(record: CourseApiRecord): CourseDetail {
  return {
    course: toCourse(record),
    modules: toModules(record.curriculum),
    resources: toResources(record.resources),
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
  const res = await api.get<PaginatedCourses>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
  if (Array.isArray(res.data)) {
    res.data = res.data
      .map((row) => normalizeCourseRecord(row))
      .filter((row): row is CourseApiRecord => row != null);
  }
  return res;
}

const EMPTY_COURSES_PAGE: CoursesPageResult = {
  courses: [],
  page: 1,
  pages: 1,
  rows: 0,
  pageSize: COURSES_PAGE_SIZE,
};

/** Latest published courses for the home section. */
export async function getHomeLatestCourses(
  limit = HOME_LATEST_COURSES
): Promise<Course[]> {
  try {
    const res = await getAllCourses({ page: 1, pageSize: 500 });
    if (!Array.isArray(res.data)) return [];
    return sortCoursesByLatest(visibleCourses(res.data))
      .slice(0, Math.max(0, limit))
      .map(toCourse);
  } catch {
    return [];
  }
}

/** Featured published courses, ordered by sortOrder. */
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

/** All published courses for the /courses explorer (client-side filters). */
export async function getAllCoursesForExplorer(): Promise<Course[]> {
  try {
    const res = await getAllCourses({ page: 1, pageSize: 500 });
    if (!Array.isArray(res.data)) return [];
    return sortCoursesForListing(visibleCourses(res.data)).map(toCourse);
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

export async function getCourseDetail(id: string): Promise<CourseDetail | null> {
  const courseId = id.trim();
  if (!courseId) return null;

  try {
    const raw = await api.get<CourseApiRecord>(`${BASE}/getById/${courseId}`);
    const record = normalizeCourseRecord(raw);
    if (
      !record ||
      !isTruthyFlag(record.isVisible) ||
      !isTruthyFlag(record.isPublished) ||
      !isTruthyFlag(record.status)
    ) {
      return null;
    }
    return toCourseDetail(record);
  } catch {
    return null;
  }
}
