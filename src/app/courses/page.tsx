import { CoursesExplorer } from "@/components/home/courses-explorer";
import { courses } from "@/lib/data/courses";

export const metadata = { title: "Explore Courses" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  return (
    <div>
      <div className="dark-band py-14 text-white">
        <div className="container">
          <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">Explore Courses</h1>
          <p className="max-w-xl text-[17px] text-white/72">
            Practical, job-ready skills taught in Somali. Filter by topic, price and level to find your next course.
          </p>
        </div>
      </div>
      <section className="section container">
        <CoursesExplorer courses={courses} initialCat={cat ?? "all"} />
      </section>
    </div>
  );
}
