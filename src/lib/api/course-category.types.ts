export type CourseCategoryApiRecord = {
  id?: string;
  _id?: string;
  name?: string;
  description?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type CourseCategoryPopulated = {
  id?: string;
  name?: string;
  description?: string;
  sortOrder?: number;
};

export type PaginatedCourseCategories = {
  data?: CourseCategoryApiRecord[];
  page?: number;
  pages?: number;
  rows?: number;
  pageSize?: number;
};
