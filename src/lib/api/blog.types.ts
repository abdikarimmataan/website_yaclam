import type { BlogPost } from "@/lib/types";

export type BlogCategoryPopulated = {
  id: string;
  name?: string;
  description?: string;
  color?: string;
};

export type BlogCategoryApiRecord = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type BlogPostApiRecord = {
  id: string;
  title: string;
  excerpt?: string;
  body?: string[];
  content?: string;
  category?: string;
  categoryId?: string | BlogCategoryPopulated;
  color?: string;
  readTime?: number;
  publishedDate?: string;
  publishedAt?: string;
  coverImage?: string;
  authorName?: string;
  author?: string;
  status?: string;
  isVisible?: boolean;
  created_at?: string;
  updated_at?: string;
};

export interface PaginatedBlogPosts {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: BlogPostApiRecord[];
}

export interface PaginatedBlogCategories {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: BlogCategoryApiRecord[];
}

export type BlogPostsPageResult = {
  posts: BlogPost[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  color: string;
};
