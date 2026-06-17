import { InstructorSidebar } from "@/components/dashboard/instructor-sidebar";
import { AuthGate } from "@/components/auth/auth-gate";

export const metadata = { title: "Instructor" };

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate role="instructor">
      <div className="instructor-shell grid min-h-[calc(100vh-72px)] grid-cols-1 md:grid-cols-[240px_1fr]">
        <InstructorSidebar />
        <div className="instructor-main min-w-0 p-4 sm:p-6 md:p-9">{children}</div>
      </div>
    </AuthGate>
  );
}
