import Link from "next/link";
import { BlogCard } from "@/components/shared/blog-card";
import { Pagination } from "@/components/shared/pagination";
import type { BlogCategory } from "@/lib/api/blog.types";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BlogList({
  categories,
  posts,
  page,
  pages,
  activeCategory,
  emptyStateText,
}: {
  categories: BlogCategory[];
  posts: BlogPost[];
  page: number;
  pages: number;
  activeCategory: string;
  emptyStateText: string;
}) {
  const categoryQuery = activeCategory !== "all" ? { cat: activeCategory } : undefined;

  return (
    <section className="section container">
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={cn(
            "rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition",
            activeCategory === "all"
              ? "border-navy bg-navy text-white"
              : "bg-white text-ink-2 hover:border-royal hover:text-royal"
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?cat=${encodeURIComponent(category.slug)}`}
            className={cn(
              "rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition",
              activeCategory === category.slug
                ? "border-navy bg-navy text-white"
                : "bg-white text-ink-2 hover:border-royal hover:text-royal"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
          <p className="text-[17px] font-semibold text-navy">{emptyStateText}</p>
          <Link href="/blog" className="btn btn-outline btn-sm mt-6">
            View all posts
          </Link>
        </div>
      )}

      <Pagination
        page={page}
        pages={pages}
        basePath="/blog"
        queryParams={categoryQuery}
        className="mt-12"
      />
    </section>
  );
}
