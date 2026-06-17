import { MyCoursesClient } from "@/components/dashboard/my-courses-client";

export const metadata = { title: "My Courses" };

export default function MyCourses() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">My Courses</h1>
      <p className="mb-7 text-ink-3">Courses you have purchased or enrolled in.</p>
      <MyCoursesClient />
    </div>
  );
}
