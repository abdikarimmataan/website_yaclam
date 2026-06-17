import { api } from "@/api/http";

const BASE = "/course";

export type CourseVideoHoursSummary = {
  durationHours: number;
  lessonCount: number;
};

export type CourseVideoHoursResponse = {
  courseId: string;
  durationHours: number;
  lessonCount: number;
};

export type CourseVideoHoursBatchResponse = {
  courses: Record<string, CourseVideoHoursSummary>;
};

export async function getCourseVideoHours(
  courseId: string
): Promise<CourseVideoHoursSummary | null> {
  try {
    const data = await api.get<CourseVideoHoursResponse>(`${BASE}/video-hours/${courseId}`, {
      auth: false,
    });
    if (!data) return null;
    return {
      durationHours: data.durationHours ?? 0,
      lessonCount: data.lessonCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function getCourseVideoHoursBatch(
  courseIds: string[]
): Promise<Record<string, CourseVideoHoursSummary>> {
  if (!courseIds.length) return {};
  try {
    const data = await api.get<CourseVideoHoursBatchResponse>(
      `${BASE}/video-hours?ids=${courseIds.join(",")}`,
      { auth: false }
    );
    return data?.courses ?? {};
  } catch {
    return {};
  }
}
