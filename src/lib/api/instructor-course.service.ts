import { api } from "@/api/http";
import { readSession } from "@/lib/auth/session";
import type { CourseApiRecord } from "@/lib/api/course.types";
import type { CourseModule } from "@/lib/instructor/course-types";
import type { ResourcesSavePayload } from "@/lib/instructor/resources";

const BASE = "/course/instructor";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000/api";

const JSON_BODY_KEYS = new Set([
  "overview",
  "curriculum",
  "resources",
  "resourceFileIndexes",
  "details",
  "instructor",
  "badges",
  "ctaButton",
  "wishlistButton",
]);

export type FieldOption = {
  id: string;
  name: string;
  icon?: string;
};

export type CourseUploadFiles = {
  thumbnail?: File | null;
  video?: File | null;
};

type Paginated<T> = {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: T[];
};

function authHeaders(): Headers {
  const headers = new Headers({ Accept: "application/json" });
  const token = readSession()?.accessToken;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

function appendPayloadToFormData(fd: FormData, payload: Record<string, unknown>) {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (JSON_BODY_KEYS.has(key) && typeof value === "object") {
      fd.append(key, JSON.stringify(value));
      return;
    }
    if (typeof value === "boolean") {
      fd.append(key, value ? "true" : "false");
      return;
    }
    if (typeof value === "number" || typeof value === "string") {
      fd.append(key, String(value));
    }
  });
}

async function parseCourseResponse(res: Response): Promise<CourseApiRecord> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(typeof body?.message === "string" ? body.message : res.statusText);
  }
  const text = await res.text();
  if (!text) throw new Error("Empty response");
  return JSON.parse(text) as CourseApiRecord;
}

async function multipartSave(
  method: "POST" | "PATCH",
  path: string,
  payload: Record<string, unknown>,
  files: CourseUploadFiles
) {
  const fd = new FormData();
  appendPayloadToFormData(fd, payload);
  if (files.thumbnail) fd.append("thumbnail", files.thumbnail);
  if (files.video) fd.append("video", files.video);

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: fd,
  });
  return parseCourseResponse(res);
}

export async function getInstructorCourses(params: { page?: number; pageSize?: number } = {}) {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("pageSize", String(params.pageSize ?? 500));
  return api.get<Paginated<CourseApiRecord>>(`${BASE}/getAll?${q}`);
}

export async function getInstructorCourseById(id: string) {
  return api.get<CourseApiRecord>(`${BASE}/getById/${id}`);
}

export async function saveInstructorCourse(
  recordId: string | null,
  payload: Record<string, unknown>,
  files: CourseUploadFiles = {}
) {
  const hasFiles = Boolean(files.thumbnail || files.video);
  if (hasFiles) {
    if (recordId) {
      return multipartSave("PATCH", `${BASE}/update/${recordId}`, payload, files);
    }
    return multipartSave("POST", `${BASE}/create`, payload, files);
  }
  if (recordId) {
    return api.patch<CourseApiRecord>(`${BASE}/update/${recordId}`, payload);
  }
  return api.post<CourseApiRecord>(`${BASE}/create`, payload);
}

export async function updateInstructorCourseVisible(id: string, isVisible: boolean) {
  return api.patch<CourseApiRecord>(`${BASE}/update/${id}`, { isVisible });
}

export async function updateInstructorCourseStatus(id: string, status: boolean) {
  return api.patch<CourseApiRecord>(`${BASE}/status/${id}`, { status });
}

export async function deleteInstructorCourse(id: string) {
  return api.delete<{ message?: string }>(`${BASE}/delete/${id}`);
}

export async function saveInstructorCurriculum(courseId: string, curriculum: CourseModule[]) {
  return api.patch<CourseApiRecord>(`${BASE}/update/${courseId}`, { curriculum });
}

export async function saveInstructorResources(courseId: string, payload: ResourcesSavePayload) {
  const { resources, resourceFileIndexes, files } = payload;
  if (files.length > 0) {
    const fd = new FormData();
    fd.append("resources", JSON.stringify(resources));
    fd.append("resourceFileIndexes", JSON.stringify(resourceFileIndexes));
    files.forEach((file) => fd.append("resourceFiles", file));

    const res = await fetch(`${API_BASE}${BASE}/update/${courseId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: fd,
    });
    return parseCourseResponse(res);
  }
  return api.patch<CourseApiRecord>(`${BASE}/update/${courseId}`, { resources });
}

export async function uploadInstructorLessonVideo(
  courseId: string,
  moduleIndex: number,
  lessonIndex: number,
  file: File
) {
  const fd = new FormData();
  fd.append("video", file);
  fd.append("moduleIndex", String(moduleIndex));
  fd.append("lessonIndex", String(lessonIndex));

  const res = await fetch(`${API_BASE}${BASE}/${courseId}/curriculum/lesson-video`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(typeof body?.message === "string" ? body.message : "Upload failed");
  }
  return res.json() as Promise<{ videoUrl?: string; course?: CourseApiRecord }>;
}

export async function getFieldOptions(): Promise<FieldOption[]> {
  const res = await api.get<Paginated<{ id: string; name?: string; icon?: string }>>(
    "/field/getAll?page=1&pageSize=200",
    { auth: false }
  );
  if (!Array.isArray(res.data)) return [];
  return res.data
    .map((row) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? "Field"),
      icon: row.icon ? String(row.icon) : undefined,
    }))
    .filter((row) => row.id);
}

export function getCourseFieldName(record: CourseApiRecord): string {
  const f = record.fieldId;
  if (f && typeof f === "object" && "name" in f) return String(f.name ?? "—");
  return "—";
}

export function getCourseLabel(record: CourseApiRecord): string {
  return String(record.title ?? record.id ?? "—");
}
