import { api } from "@/api/http";
import type {
  CourseCommentRecord,
  CourseCommentsResponse,
} from "@/lib/api/course-comment.types";

const BASE = "/course-comment";

export async function getCourseComments(
  courseId: string,
  lessonId?: string
): Promise<CourseCommentRecord[]> {
  try {
    const q = lessonId ? `?lessonId=${encodeURIComponent(lessonId)}` : "";
    const res = await api.get<CourseCommentsResponse>(`${BASE}/by-course/${courseId}${q}`);
    return Array.isArray(res.comments) ? res.comments : [];
  } catch {
    return [];
  }
}

export async function postCourseComment(
  courseId: string,
  text: string,
  lessonId?: string
): Promise<CourseCommentRecord> {
  return api.post<CourseCommentRecord>(BASE, {
    courseId,
    lessonId: lessonId ?? "",
    text,
  });
}

export async function replyToCourseComment(
  commentId: string,
  text: string
): Promise<CourseCommentRecord> {
  return api.post<CourseCommentRecord>(`${BASE}/${commentId}/reply`, { text });
}
