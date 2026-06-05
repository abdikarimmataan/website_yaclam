import { api } from "@/api/http";
import type { Testimonial } from "@/lib/types";
import type {
  PaginatedTestimonials,
  TestimonialApiRecord,
} from "@/lib/api/testimonial.types";

const BASE = "/testimonial";

export const HOME_TESTIMONIALS_COUNT = 4;

export type TestimonialListParams = {
  page?: number;
  pageSize?: number;
};

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function visibleTestimonials(rows: TestimonialApiRecord[]) {
  return rows.filter((t) => t.isVisible !== false);
}

function testimonialTimestamp(record: TestimonialApiRecord): number {
  const raw = record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

export function sortTestimonialsByLatest(rows: TestimonialApiRecord[]): TestimonialApiRecord[] {
  return [...rows].sort((a, b) => {
    const byTime = testimonialTimestamp(b) - testimonialTimestamp(a);
    if (byTime !== 0) return byTime;
    return Number(b.sortOrder ?? 0) - Number(a.sortOrder ?? 0);
  });
}

export function toTestimonial(record: TestimonialApiRecord): Testimonial {
  const name = record.name?.trim() || "Learner";
  return {
    id: record.id,
    name,
    role: record.role?.trim() || "",
    text: record.text?.trim() || record.description?.trim() || "",
    initials: record.initials?.trim() || deriveInitials(name),
  };
}

export async function getAllTestimonials(
  params?: TestimonialListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedTestimonials> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  return api.get<PaginatedTestimonials>(`${BASE}/getAll?${q}`, { signal: opts?.signal });
}

/** Four most recently saved visible testimonials for the home Learners section. */
export async function getHomeTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await getAllTestimonials({ page: 1, pageSize: 100 });
    if (!Array.isArray(res.data)) return [];
    return sortTestimonialsByLatest(visibleTestimonials(res.data))
      .slice(0, HOME_TESTIMONIALS_COUNT)
      .map(toTestimonial);
  } catch {
    return [];
  }
}
