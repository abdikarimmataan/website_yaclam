import Link from "next/link";
import { ScholarshipCard } from "@/components/shared/scholarship-card";
import { Pagination } from "@/components/shared/pagination";
import {
  getScholarshipsPage,
  SCHOLARSHIPS_PAGE_SIZE,
} from "@/lib/api/scholarship.service";

export const metadata = { title: "Scholarship Portal" };

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let result = await getScholarshipsPage(requestedPage, SCHOLARSHIPS_PAGE_SIZE);
  if (requestedPage > result.pages && result.pages > 0) {
    result = await getScholarshipsPage(result.pages, SCHOLARSHIPS_PAGE_SIZE);
  }

  const { scholarships, page, pages, rows, pageSize } = result;
  const start = rows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = rows === 0 ? 0 : Math.min(page * pageSize, rows);

  return (
    <div>
      <div className="dark-band py-14 text-white">
        <div className="container">
          <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">Scholarship Portal</h1>
          <p className="max-w-xl text-[17px] text-white/72">
            Funded study opportunities worldwide — eligibility, benefits and deadlines, explained for Somali applicants.
          </p>
        </div>
      </div>

      <section className="section container">
        {rows > 0 ? (
          <p className="mb-8 text-[14px] text-ink-3">
            Showing <b className="text-navy">{start}</b>–<b className="text-navy">{end}</b> of{" "}
            <b className="text-navy">{rows}</b> scholarships
            {pages > 1 ? (
              <>
                {" "}
                · Page <b className="text-navy">{page}</b> of <b className="text-navy">{pages}</b>
              </>
            ) : null}
          </p>
        ) : null}

        {scholarships.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => (
              <ScholarshipCard key={String(s.id)} s={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
            <p className="text-[17px] font-semibold text-navy">No scholarships yet</p>
            <p className="mt-2 text-[14px] text-ink-3">
              Published scholarships from the CMS will appear here.
            </p>
            <Link href="/" className="btn btn-outline btn-sm mt-6">
              Back to home
            </Link>
          </div>
        )}

        <Pagination page={page} pages={pages} className="mt-12" />

        <p className="mt-10 rounded-xl border border-line bg-surface p-4 text-[13px] text-ink-3">
          Note: deadlines shown are typical annual windows and vary each cycle. Always confirm the current deadline on the official programme website before applying.
        </p>
      </section>
    </div>
  );
}
