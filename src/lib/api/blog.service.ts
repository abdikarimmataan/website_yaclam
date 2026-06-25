import { api } from "@/api/http";
import type { BlogPost } from "@/lib/types";
import type {
  BlogCategory,
  BlogCategoryApiRecord,
  BlogPostApiRecord,
  BlogPostsPageResult,
  PaginatedBlogCategories,
  PaginatedBlogPosts,
} from "@/lib/api/blog.types";
import { slugify } from "@/lib/utils";

const POST_BASE = "/blog_post";
const CATEGORY_BASE = "/blog_category";

export const BLOG_PAGE_SIZE = 6;
export const BLOG_RELATED_COUNT = 3;

function isHtmlContent(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

export type BlogPostListParams = {
  page?: number;
  pageSize?: number;
  categoryId?: string;
};

function visibleCategories(rows: BlogCategoryApiRecord[]) {
  return rows.filter((c) => c.isVisible !== false);
}

function visiblePosts(rows: BlogPostApiRecord[]) {
  return rows.filter((p) => p.isVisible !== false && p.status === "published");
}

function postTimestamp(record: BlogPostApiRecord): number {
  const raw = record.publishedAt ?? record.publishedDate ?? record.updated_at ?? record.created_at;
  const time = raw ? new Date(String(raw)).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

export function sortBlogPostsByLatest(rows: BlogPostApiRecord[]): BlogPostApiRecord[] {
  return [...rows].sort((a, b) => postTimestamp(b) - postTimestamp(a));
}

function resolveCategory(record: BlogPostApiRecord) {
  const populated = record.categoryId;
  if (populated && typeof populated === "object") {
    return {
      name: populated.name?.trim() || record.category?.trim() || "General",
      id: populated.id,
      color: populated.color?.trim(),
    };
  }
  return {
    name: record.category?.trim() || "General",
    id: typeof populated === "string" ? populated : undefined,
    color: record.color?.trim(),
  };
}

export function toBlogPost(record: BlogPostApiRecord): BlogPost {
  const { name: category, id: categoryId, color: categoryColor } = resolveCategory(record);
  const title = record.title?.trim() || "Article";
  const rawContent = record.content?.trim() || "";
  const htmlContent = isHtmlContent(rawContent) ? rawContent : "";
  const body =
    htmlContent
      ? []
      : Array.isArray(record.body) && record.body.length
        ? record.body.map((p) => p.trim()).filter(Boolean)
        : rawContent
          ? rawContent
              .split(/\n\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
          : [];
  const dateRaw = record.publishedDate || record.publishedAt || record.created_at;

  return {
    id: record.id,
    slug: slugify(title),
    title,
    category,
    categoryId,
    author: record.authorName?.trim() || record.author?.trim() || "Yaclam",
    date: dateRaw ? String(dateRaw) : "",
    readTime: Number(record.readTime) > 0 ? Number(record.readTime) : 1,
    excerpt: record.excerpt?.trim() || body[0]?.slice(0, 200) || stripHtmlExcerpt(htmlContent),
    body,
    contentHtml: htmlContent || undefined,
    color: record.color?.trim() || categoryColor || "#1F3A93",
    coverImage: record.coverImage?.trim() || "",
  };
}

function stripHtmlExcerpt(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

export function toBlogCategory(record: BlogCategoryApiRecord): BlogCategory {
  const name = record.name?.trim() || "General";
  return {
    id: record.id,
    name,
    slug: slugify(name),
    color: record.color?.trim() || "#1F3A93",
  };
}

export async function getAllBlogPosts(
  params?: BlogPostListParams,
  opts?: { signal?: AbortSignal }
): Promise<PaginatedBlogPosts> {
  const q = new URLSearchParams();
  q.set("page", String(params?.page ?? 1));
  q.set("pageSize", String(params?.pageSize ?? 10));
  if (params?.categoryId) q.set("categoryId", params.categoryId);
  return api.get<PaginatedBlogPosts>(`${POST_BASE}/getAll?${q}`, { signal: opts?.signal });
}

export async function getAllBlogCategories(
  opts?: { signal?: AbortSignal }
): Promise<BlogCategory[]> {
  try {
    const res = await api.get<PaginatedBlogCategories>(
      `${CATEGORY_BASE}/getAll?page=1&pageSize=100`,
      { signal: opts?.signal }
    );
    if (!Array.isArray(res.data)) return [];
    return visibleCategories(res.data)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name))
      .map(toBlogCategory);
  } catch {
    return [];
  }
}

const EMPTY_BLOG_PAGE: BlogPostsPageResult = {
  posts: [],
  page: 1,
  pages: 1,
  rows: 0,
  pageSize: BLOG_PAGE_SIZE,
};

/** Paginated blog posts for /blog (latest first). */
export async function getBlogPostsPage(
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
  categoryId?: string
): Promise<BlogPostsPageResult> {
  try {
    const safePage = Math.max(1, page);
    const res = await getAllBlogPosts({ page: 1, pageSize: 500, categoryId });
    const allRows = Array.isArray(res.data) ? sortBlogPostsByLatest(visiblePosts(res.data)) : [];
    const rows = allRows.length;
    const pages = Math.max(1, Math.ceil(rows / pageSize));
    const currentPage = Math.min(safePage, pages);
    const start = (currentPage - 1) * pageSize;

    return {
      posts: allRows.slice(start, start + pageSize).map(toBlogPost),
      page: currentPage,
      pages,
      rows,
      pageSize,
    };
  } catch {
    return EMPTY_BLOG_PAGE;
  }
}

async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const record = await api.get<BlogPostApiRecord>(`${POST_BASE}/getById/${id}`);
    if (!record?.id || record.isVisible === false || record.status !== "published") {
      return null;
    }
    return toBlogPost(record);
  } catch {
    return null;
  }
}

export async function getBlogPostDetail(slug: string): Promise<BlogPost | null> {
  const byId = await fetchBlogPostById(slug);
  if (byId) return byId;

  try {
    const res = await getAllBlogPosts({ page: 1, pageSize: 500 });
    if (!Array.isArray(res.data)) return null;
    const match = sortBlogPostsByLatest(visiblePosts(res.data)).find(
      (row) => slugify(row.title?.trim() || "") === slug
    );
    return match ? toBlogPost(match) : null;
  } catch {
    return null;
  }
}

/** Latest posts in the same category for the detail page (excludes current post). */
export async function getRelatedBlogPosts(
  post: BlogPost,
  limit = BLOG_RELATED_COUNT
): Promise<BlogPost[]> {
  try {
    const res = await getAllBlogPosts({
      page: 1,
      pageSize: 500,
      categoryId: post.categoryId,
    });
    if (!Array.isArray(res.data)) return [];
    return sortBlogPostsByLatest(visiblePosts(res.data))
      .map(toBlogPost)
      .filter((p) => p.id !== post.id)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function findCategoryBySlug(categories: BlogCategory[], cat?: string): BlogCategory | null {
  const key = cat?.trim();
  if (!key || key.toLowerCase() === "all") return null;
  return (
    categories.find((c) => c.slug === key || slugify(c.name) === key || c.name === key) ?? null
  );
}
