import { api } from "@/api/http";
import { sortBySortOrder } from "@/lib/api/sort-order";
import type { Instructor } from "@/lib/types";
import type {
  PaginatedPractitioners,
  PractitionerApiRecord,
} from "@/lib/api/practitioner.types";

const BASE = "/practitioner";

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

/** Visible practitioners for the home section, ordered by sortOrder. */
export async function getHomePractitioners(): Promise<Instructor[]> {
  try {
    const res = await getAllPractitioners({ page: 1, pageSize: 100 });
    if (!Array.isArray(res.data)) return [];
    return sortBySortOrder(visiblePractitioners(res.data)).map(toPractitioner);
  } catch {
    return [];
  }
}
