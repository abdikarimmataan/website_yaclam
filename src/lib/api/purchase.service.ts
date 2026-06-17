import { api } from "@/api/http";
import { toCourse } from "@/lib/api/course.service";
import type { CourseApiRecord } from "@/lib/api/course.types";
import type { Course } from "@/lib/types";

const BASE = "/purchase";

export type PurchaseRecord = {
  id: string;
  studentID?: string;
  courseId: CourseApiRecord | string;
  transactionID?: string | null;
  created_at?: string;
};

export type PaginatedPurchases = {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: PurchaseRecord[];
};

export type PurchasedCourse = {
  purchaseId: string;
  course: Course;
  purchasedAt?: string;
  transactionId?: string | null;
};

function courseFromPurchase(record: PurchaseRecord): PurchasedCourse | null {
  const raw = record.courseId;
  if (!raw || typeof raw === "string") return null;
  if (!raw.id && !(raw as { _id?: string })._id) return null;
  return {
    purchaseId: record.id,
    course: toCourse(raw),
    purchasedAt: record.created_at,
    transactionId: record.transactionID,
  };
}

export async function getMyPurchasedCourses(page = 1, pageSize = 50): Promise<PurchasedCourse[]> {
  try {
    const res = await api.get<PaginatedPurchases | { message?: string }>(
      `${BASE}/my-courses?page=${page}&pageSize=${pageSize}`
    );
    if (!res || !("data" in res) || !Array.isArray(res.data)) return [];
    return res.data.map(courseFromPurchase).filter(Boolean) as PurchasedCourse[];
  } catch {
    return [];
  }
}

export async function enrollFreeCourse(courseId: string): Promise<PurchasedCourse | null> {
  const record = await api.post<PurchaseRecord>(`${BASE}/enroll-free`, { courseId });
  return courseFromPurchase(record);
}

export async function hasPurchasedCourse(courseId: string): Promise<boolean> {
  const items = await getMyPurchasedCourses(1, 500);
  return items.some((item) => item.course.id === courseId || item.course.slug === courseId);
}
