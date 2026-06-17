import type { Course, CourseResource, Module } from "@/lib/types";

export type CourseFieldRef = {
  id?: string;
  name?: string;
  icon?: string;
};

export type CourseLessonApiRecord = {
  id?: string;
  title?: string;
  duration?: string;
  free?: boolean;
  videoUrl?: string;
  vimeoId?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type CourseModuleApiRecord = {
  title?: string;
  sortOrder?: number;
  isVisible?: boolean;
  lessons?: CourseLessonApiRecord[];
};

export type CourseResourceApiRecord = {
  id?: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type CourseApiRecord = {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  fieldId?: string | CourseFieldRef | null;
  level?: string;
  language?: string;
  duration?: string;
  color?: string;
  badge?: string;
  certificate?: boolean;
  access?: string;
  instructorName?: string;
  thumbnail?: string;
  previewVideoUrl?: string;
  price?: number;
  originalPrice?: number;
  isFree?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  isVisible?: boolean;
  status?: boolean;
  sortOrder?: number;
  durationHours?: number;
  lessonCount?: number;
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  created_at?: string;
  updated_at?: string;
  overview?: {
    headline?: string;
    description?: string;
    outcomes?: string[];
  };
  details?: {
    skillLevel?: string;
    language?: string;
    durationHours?: number;
    lessonCount?: number;
    certificate?: boolean;
    access?: string;
  };
  instructor?: {
    instructorId?: string;
    name?: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
  curriculum?: CourseModuleApiRecord[];
  resources?: CourseResourceApiRecord[];
};

export interface PaginatedCourses {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: CourseApiRecord[];
}

export type CoursesPageResult = {
  courses: Course[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};

export type CourseDetail = {
  course: Course;
  modules: Module[];
  resources: CourseResource[];
};
