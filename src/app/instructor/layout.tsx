import { InstructorSidebar } from "@/components/dashboard/instructor-sidebar";

export const metadata = { title: "Instructor" };

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-72px)] md:grid-cols-[240px_1fr]">
      <InstructorSidebar />
      <div className="bg-surface p-6 md:p-9">{children}</div>
    </div>
  );
}
