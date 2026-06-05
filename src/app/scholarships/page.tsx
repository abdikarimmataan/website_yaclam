import Link from "next/link";
import { ScholarshipCard } from "@/components/shared/scholarship-card";
import { Pagination } from "@/components/shared/pagination";
import { getPageCmsConfig } from "@/lib/api/page-cms.service";
import {
  getScholarshipsPage,
  SCHOLARSHIPS_PAGE_SIZE,
} from "@/lib/api/scholarship.service";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("scholarship");
  return { title: cms.title };
}

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ page: pageParam }, cms] = await Promise.all([
    searchParams,
    getPageCmsConfig("scholarship"),
  ]);
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let result = await getScholarshipsPage(requestedPage, SCHOLARSHIPS_PAGE_SIZE);
  if (requestedPage > result.pages && result.pages > 0) {
    result = await getScholarshipsPage(result.pages, SCHOLARSHIPS_PAGE_SIZE);
  }

  const { scholarships, page, pages } = result;

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
        {scholarships.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => (
              <ScholarshipCard key={String(s.id)} s={s} />
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

        <Pagination page={page} pages={pages} className="mt-12" />
      </section>
    </div>
  );
}
