import { getPageCmsConfig } from "@/lib/api/page-cms.service";
import {
  BLOG_PAGE_SIZE,
  findCategoryBySlug,
  getAllBlogCategories,
  getBlogPostsPage,
} from "@/lib/api/blog.service";
import { BlogList } from "@/app/blog/blog-list";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("blog");
  return { title: cms.title };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const [{ page: pageParam, cat }, cms] = await Promise.all([
    searchParams,
    getPageCmsConfig("blog"),
  ]);
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const categories = await getAllBlogCategories();
  const activeCategory = findCategoryBySlug(categories, cat);
  const categorySlug = activeCategory?.slug ?? (cat?.trim() && cat !== "all" ? cat : "all");

  let result = await getBlogPostsPage(
    requestedPage,
    BLOG_PAGE_SIZE,
    activeCategory?.id
  );
  if (requestedPage > result.pages && result.pages > 0) {
    result = await getBlogPostsPage(result.pages, BLOG_PAGE_SIZE, activeCategory?.id);
  }

  return (
    <div>
      {cms.isVisible ? (
        <div className="dark-band py-14 text-white">
          <div className="container">
            <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">{cms.title}</h1>
            <p className="max-w-xl text-[17px] text-white/72">{cms.subtitle}</p>
          </div>
        </div>
      ) : null}
      <BlogList
        categories={categories}
        posts={result.posts}
        page={result.page}
        pages={result.pages}
        activeCategory={categorySlug}
        emptyStateText={cms.emptyStateText}
      />
    </div>
  );
}
