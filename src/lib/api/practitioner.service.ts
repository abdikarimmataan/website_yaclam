import { api } from "@/api/http";
import type { Instructor } from "@/lib/types";
import type {
  PaginatedPractitioners,
  PractitionerApiRecord,
} from "@/lib/api/practitioner.types";

const BASE = "/practitioner";

export const HOME_PRACTITIONERS_COUNT = 4;

export type PractitionerListParams = {
  page?: number;
  pageSize?: number;
};

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function visiblePractitioners(rows: PractitionerApiRecord[]) {
  return rows.filter((p) => p.isVisible !== false);
}

function practitionerTimestamp(record: PractitionerApiRecord): number {
  const raw = record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

export function sortPractitionersByLatest(rows: PractitionerApiRecord[]): PractitionerApiRecord[] {
  return [...rows].sort((a, b) => {
    const byTime = practitionerTimestamp(b) - practitionerTimestamp(a);
    if (byTime !== 0) return byTime;
    return Number(b.sortOrder ?? 0) - Number(a.sortOrder ?? 0);
  });
}

export function toPractitioner(record: PractitionerApiRecord): Instructor {
  const name = record.name?.trim() || "Instructor";
  const courses = Number(record.coursesCount ?? record.courses);
  const students = record.studentsCount ?? record.students;

  return {
    id: record.id,
    name,
    role: record.role?.trim() || "",
    initials: record.initials?.trim() || deriveInitials(name),
    bio: record.bio?.trim() || "",
    courses: Number.isFinite(courses) ? courses : 0,
    students: students != null && String(students).trim() ? String(students).trim() : "0",
    color: record.color?.trim() || "#1F3A93",
  };
}

export async function getAllPractitioners(
  params?: PractitionerListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedPractitioners> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  return api.get<PaginatedPractitioners>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

/** Four most recently saved visible practitioners for the home section. */
export async function getHomePractitioners(): Promise<Instructor[]> {
  try {
    const res = await getAllPractitioners({ page: 1, pageSize: 100 });
    if (!Array.isArray(res.data)) return [];
    return sortPractitionersByLatest(visiblePractitioners(res.data))
      .slice(0, HOME_PRACTITIONERS_COUNT)
      .map(toPractitioner);
  } catch {
    return [];
  }
}
