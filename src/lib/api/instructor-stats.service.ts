import { api } from "@/api/http";

const BASE = "/course/instructor";

export type InstructorTopCourse = {
  id: string;
  title: string;
  students: number;
  rating: number;
};

export type InstructorOverview = {
  instructorName: string;
  totalStudents: number;
  publishedCourses: number;
  avgRating: number;
  reviewCount: number;
  topCourses: InstructorTopCourse[];
};

export type InstructorStudentRow = {
  id: string;
  name: string;
  course: string;
  joined?: string;
  avatar?: string;
};

export type InstructorReviewRow = {
  id: string;
  name: string;
  avatar?: string;
  course: string;
  rating: number;
  text: string;
  created_at?: string;
};

export async function getInstructorOverview(): Promise<InstructorOverview | null> {
  try {
    return await api.get<InstructorOverview>(`${BASE}/overview`);
  } catch {
    return null;
  }
}

export async function getInstructorStudents(): Promise<InstructorStudentRow[]> {
  try {
    const res = await api.get<{ students: InstructorStudentRow[] }>(`${BASE}/students`);
    return Array.isArray(res.students) ? res.students : [];
  } catch {
    return [];
  }
}

export async function getInstructorReviews(): Promise<{
  avgRating: number;
  reviewCount: number;
  reviews: InstructorReviewRow[];
}> {
  try {
    return await api.get(`${BASE}/reviews`);
  } catch {
    return { avgRating: 0, reviewCount: 0, reviews: [] };
  }
}
