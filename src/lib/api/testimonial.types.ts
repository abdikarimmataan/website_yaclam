export type TestimonialApiRecord = {
  id: string;
  name: string;
  role?: string;
  text?: string;
  description?: string;
  initials?: string;
  profileImage?: string;
  location?: string;
  sortOrder?: number;
  isVisible?: boolean;
  created_at?: string;
  updated_at?: string;
};

export interface PaginatedTestimonials {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: TestimonialApiRecord[];
}
