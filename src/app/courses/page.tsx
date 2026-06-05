import Link from "next/link";
import { CourseCard } from "@/components/shared/course-card";
import { Pagination } from "@/components/shared/pagination";
import { getPageCmsConfig } from "@/lib/api/page-cms.service";
import { getCoursesPage, COURSES_PAGE_SIZE } from "@/lib/api/course.service";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("course");
  return { title: cms.title };
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ page: pageParam }, cms] = await Promise.all([
    searchParams,
    getPageCmsConfig("course"),
  ]);
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let result = await getCoursesPage(requestedPage, COURSES_PAGE_SIZE);
  if (requestedPage > result.pages && result.pages > 0) {
    result = await getCoursesPage(result.pages, COURSES_PAGE_SIZE);
  }

  const { courses, page, pages } = result;

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

      <section className="section container">
        {courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={String(c.id)} c={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
            <p className="text-[17px] font-semibold text-navy">{cms.emptyStateText}</p>
            <Link href="/" className="btn btn-outline btn-sm mt-6">
              Back to home
            </Link>
          </div>
        )}

        <Pagination page={page} pages={pages} basePath="/courses" className="mt-14" />
      </section>
    </div>
  );
}
