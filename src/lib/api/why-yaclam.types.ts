export interface WhyYaclamItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface PaginatedWhyYaclam {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: WhyYaclamItem[];
}
