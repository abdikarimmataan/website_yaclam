import { api } from "@/api/http";
import { toCourse } from "@/lib/api/course.service";
import type { CourseApiRecord } from "@/lib/api/course.types";
import type { Course } from "@/lib/types";

const BASE = "/wishlist";

type WishlistItem = {
  courseId: CourseApiRecord | string;
  addedAt?: string;
};

type WishlistRecord = {
  id: string;
  items: WishlistItem[];
};

export async function getWishlistCourses(): Promise<Course[]> {
  try {
    const res = await api.get<WishlistRecord>(`${BASE}/`);
    if (!Array.isArray(res.items)) return [];
    return res.items
      .map((item) => {
        const raw = item.courseId;
        if (!raw || typeof raw === "string") return null;
        return toCourse(raw);
      })
      .filter(Boolean) as Course[];
  } catch {
    return [];
  }
}

export async function isCourseInWishlist(courseId: string): Promise<boolean> {
  try {
    const res = await api.get<{ saved: boolean }>(`${BASE}/check/${courseId}`);
    return res.saved === true;
  } catch {
    return false;
  }
}

export async function addToWishlist(courseId: string): Promise<void> {
  await api.post(`${BASE}/items`, { courseId });
}

export async function removeFromWishlist(courseId: string): Promise<void> {
  await api.delete(`${BASE}/items/${courseId}`);
}

export async function toggleWishlist(courseId: string, saved: boolean): Promise<boolean> {
  if (saved) {
    await removeFromWishlist(courseId);
    return false;
  }
  await addToWishlist(courseId);
  return true;
}
