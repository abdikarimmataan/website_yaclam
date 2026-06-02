import { courses } from "@/lib/data/courses";
import { CourseCard } from "@/components/shared/course-card";

export const metadata = { title: "Wishlist" };

export default function Wishlist() {
  const saved = courses.filter((c) => ["ui-ux-design-with-figma", "machine-learning-foundations", "digital-marketing-complete-guide"].includes(c.slug));
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Wishlist</h1>
      <p className="mb-7 text-ink-3">Courses you saved for later.</p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {saved.map((c) => <CourseCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
