import { api } from "@/api/http";
import { sortBySortOrder } from "@/lib/api/sort-order";
import type { Testimonial } from "@/lib/types";
import type {
  PaginatedTestimonials,
  TestimonialApiRecord,
} from "@/lib/api/testimonial.types";

const BASE = "/testimonial";

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

/** Visible testimonials for the home Learners section, ordered by sortOrder. */
export async function getHomeTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await getAllTestimonials({ page: 1, pageSize: 100 });
    if (!Array.isArray(res.data)) return [];
    return sortBySortOrder(visibleTestimonials(res.data)).map(toTestimonial);
  } catch {
    return [];
  }
}
