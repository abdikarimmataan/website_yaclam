import type { Course } from "@/lib/types";

export type CourseApiRecord = {
  id: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  level?: string;
  language?: string;
  duration?: string;
  color?: string;
  badge?: string;
  certificate?: boolean;
  access?: string;
  instructorName?: string;
  thumbnail?: string;
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
    name?: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
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
