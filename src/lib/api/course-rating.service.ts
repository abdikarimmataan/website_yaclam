import { api } from "@/api/http";

const BASE = "/course-rating";

export type CourseRatingRecord = {
  id?: string;
  rating: number;
  text?: string;
  created_at?: string;
};

export type CourseRatingsResponse = {
  courseId: string;
  rating: number;
  reviewCount: number;
  ratings: {
    id?: string;
    rating: number;
    text: string;
    created_at?: string;
    studentName: string;
    studentAvatar?: string;
  }[];
};

export const COURSE_RATING_EVENT = "yaclam:course-rated";

export type CourseRatingUpdate = {
  courseId: string;
  rating: number;
  reviewCount: number;
};

export function notifyCourseRatingChange(detail: CourseRatingUpdate) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COURSE_RATING_EVENT, { detail }));
}

export type SubmitRatingResult = {
  rating: CourseRatingRecord;
  courseRating: number;
  reviewCount: number;
};

export async function getCourseRatings(courseId: string): Promise<CourseRatingsResponse | null> {
  try {
    return await api.get<CourseRatingsResponse>(`${BASE}/by-course/${courseId}`, { auth: false });
  } catch {
    return null;
  }
}

export type CourseRatingsSummary = {
  courseId: string;
  rating: number;
  reviewCount: number;
};

export async function getCourseRatingsBatch(
  courseIds: string[]
): Promise<Record<string, CourseRatingsSummary>> {
  if (!courseIds.length) return {};
  try {
    const data = await api.get<{ courses: Record<string, CourseRatingsSummary> }>(
      `${BASE}/by-courses?ids=${courseIds.join(",")}`,
      { auth: false }
    );
    return data?.courses ?? {};
  } catch {
    return {};
  }
}

export async function getMyCourseRating(courseId: string): Promise<CourseRatingRecord | null> {
  try {
    return await api.get<CourseRatingRecord | null>(`${BASE}/mine/${courseId}`);
  } catch {
    return null;
  }
}

export async function submitCourseRating(
  courseId: string,
  rating: number,
  text = ""
): Promise<SubmitRatingResult> {
  return api.post<SubmitRatingResult>(BASE, { courseId, rating, text });
}
