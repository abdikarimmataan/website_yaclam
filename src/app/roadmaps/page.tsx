import Link from "next/link";
import { RoadmapCard } from "@/components/shared/roadmap-card";
import { Pagination } from "@/components/shared/pagination";
import { getRoadmapsPage, ROADMAPS_PAGE_SIZE } from "@/lib/api/roadmap.service";

export const metadata = { title: "Career Roadmaps" };

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let result = await getRoadmapsPage(requestedPage, ROADMAPS_PAGE_SIZE);
  if (requestedPage > result.pages && result.pages > 0) {
    result = await getRoadmapsPage(result.pages, ROADMAPS_PAGE_SIZE);
  }

  const { roadmaps, page, pages, rows, pageSize } = result;
  const start = rows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = rows === 0 ? 0 : Math.min(page * pageSize, rows);

  return (
    <div>
      <div className="dark-band py-14 text-white">
        <div className="container">
          <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">Career Roadmaps</h1>
          <p className="max-w-xl text-[17px] text-white/72">
            Pick a destination. We give you the salary outlook, the skills, and a guided sequence to get there.
          </p>
        </div>
      </div>

      <section className="section container">
        {rows > 0 ? (
          <p className="mb-8 text-[14px] text-ink-3">
            Showing <b className="text-navy">{start}</b>–<b className="text-navy">{end}</b> of{" "}
            <b className="text-navy">{rows}</b> roadmaps
            {pages > 1 ? (
              <>
                {" "}
                · Page <b className="text-navy">{page}</b> of <b className="text-navy">{pages}</b>
              </>
            ) : null}
          </p>
        ) : null}

        {roadmaps.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roadmaps.map((r) => (
              <RoadmapCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
            <p className="text-[17px] font-semibold text-navy">No roadmaps yet</p>
            <p className="mt-2 text-[14px] text-ink-3">
              Published roadmaps from the CMS will appear here.
            </p>
            <Link href="/" className="btn btn-outline btn-sm mt-6">
              Back to home
            </Link>
          </div>
        )}

        <Pagination page={page} pages={pages} basePath="/roadmaps" className="mt-12" />
      </section>
    </div>
  );
}
