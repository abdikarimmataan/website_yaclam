import { Suspense } from "react";
import { CoursesExplorer } from "@/components/home/courses-explorer";
import { getPageCmsConfig } from "@/lib/api/page-cms.service";
import { getAllCoursesForExplorer } from "@/lib/api/course.service";
import { getCoursesDisplayStats } from "@/lib/api/course-display-stats";
import { getCourseFields, resolveCourseFieldFilter } from "@/lib/api/fields.service";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("course");
  return { title: cms.title };
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const [{ cat }, cms, courses, fields] = await Promise.all([
    searchParams,
    getPageCmsConfig("course"),
    getAllCoursesForExplorer(),
    getCourseFields(),
  ]);

  const activeCat = resolveCourseFieldFilter(fields, cat);
  const stats = await getCoursesDisplayStats(courses.map((c) => String(c.id)));

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
        <Suspense fallback={<div className="py-12 text-center text-ink-3">Loading courses…</div>}>
          <CoursesExplorer
            courses={courses}
            fields={fields}
            initialCat={activeCat}
            emptyStateText={cms.emptyStateText}
            displayStats={stats}
          />
        </Suspense>
      </section>
    </div>
  );
}
