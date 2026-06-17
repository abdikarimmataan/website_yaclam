import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AuthGate } from "@/components/auth/auth-gate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate role="student">
      <div className="grid min-h-[calc(100vh-72px)] md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        <div className="p-6 md:p-9">{children}</div>
      </div>
    </AuthGate>
  );
}
