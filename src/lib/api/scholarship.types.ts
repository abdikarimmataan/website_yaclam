import type { Scholarship } from "@/lib/types";

export type ScholarshipApiRecord = {
  id: string;
  name: string;
  title?: string;
  provider?: string;
  country?: string;
  level?: string;
  funding?: string;
  flag?: string;
  deadline?: string;
  amount?: string;
  website?: string;
  applicationUrl?: string;
  overview?: string;
  description?: string;
  benefits?: string[];
  eligibility?: string[];
  documents?: string[];
  sortOrder?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  isVisible?: boolean;
  created_at?: string;
  updated_at?: string;
  ctaButton?: {
    label?: string;
    url?: string;
    isVisible?: boolean;
  };
};

export interface PaginatedScholarships {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: ScholarshipApiRecord[];
}

export type ScholarshipDetailView = {
  scholarship: Scholarship;
  cta: { label: string; url: string };
};

export type ScholarshipsPageResult = {
  scholarships: Scholarship[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};
