import { api } from "@/api/http";

const BASE = "/purchase";

export type CourseEnrollmentResponse = {
  courseId: string;
  count: number;
};

export type CourseEnrollmentCountsResponse = {
  counts: Record<string, number>;
};

export async function getCourseEnrollmentCount(
  courseId: string
): Promise<CourseEnrollmentResponse | null> {
  try {
    return await api.get<CourseEnrollmentResponse>(`${BASE}/enrollment-count/${courseId}`, {
      auth: false,
    });
  } catch {
    return null;
  }
}

export async function getCourseEnrollmentCounts(
  courseIds: string[]
): Promise<Record<string, number>> {
  if (!courseIds.length) return {};
  try {
    const data = await api.get<CourseEnrollmentCountsResponse>(
      `${BASE}/enrollment-counts?ids=${courseIds.join(",")}`,
      { auth: false }
    );
    return data?.counts ?? {};
  } catch {
    return {};
  }
}
