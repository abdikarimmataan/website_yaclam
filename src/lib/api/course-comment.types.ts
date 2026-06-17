export type CommentAuthorType = "student" | "instructor" | "admin";

export type CourseCommentRecord = {
  id: string;
  courseId: string;
  lessonId?: string;
  userId: string;
  authorType: CommentAuthorType;
  authorName: string;
  authorAvatar?: string;
  text: string;
  parentId?: string | null;
  created_at?: string;
  updated_at?: string;
  replies?: CourseCommentRecord[];
};

export type CourseCommentsResponse = {
  courseId: string;
  lessonId?: string | null;
  total: number;
  comments: CourseCommentRecord[];
};
