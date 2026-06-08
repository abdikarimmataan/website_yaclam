import { Suspense } from "react";
import { InstructorCoursesPage } from "@/components/instructor/instructor-courses-page";

export const metadata = { title: "My Courses" };

export default function InstructorCoursesRoute() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-ink-3">Loading courses…</div>
      }
    >
      <InstructorCoursesPage />
    </Suspense>
  );
}
