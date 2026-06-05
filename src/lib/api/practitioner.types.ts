export type PractitionerApiRecord = {
  id: string;
  name: string;
  role?: string;
  initials?: string;
  bio?: string;
  coursesCount?: number;
  courses?: number;
  studentsCount?: string;
  students?: string;
  color?: string;
  sortOrder?: number;
  isVisible?: boolean;
  created_at?: string;
  updated_at?: string;
};

export interface PaginatedPractitioners {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: PractitionerApiRecord[];
}
