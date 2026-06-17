import { getCourseEnrollmentCounts } from "@/lib/api/course-enrollment.service";
import {
  getCourseRatingsBatch,
  type CourseRatingsSummary,
} from "@/lib/api/course-rating.service";
import {
  getCourseVideoHoursBatch,
  type CourseVideoHoursSummary,
} from "@/lib/api/course-video-hours.service";

export async function getCoursesDisplayStats(courseIds: string[]): Promise<{
  ratings: Record<string, CourseRatingsSummary>;
  enrollments: Record<string, number>;
  videoHours: Record<string, CourseVideoHoursSummary>;
}> {
  const ids = courseIds.filter(Boolean);
  if (!ids.length) {
    return { ratings: {}, enrollments: {}, videoHours: {} };
  }

  const [ratings, enrollments, videoHours] = await Promise.all([
    getCourseRatingsBatch(ids),
    getCourseEnrollmentCounts(ids),
    getCourseVideoHoursBatch(ids),
  ]);

  return { ratings, enrollments, videoHours };
}
