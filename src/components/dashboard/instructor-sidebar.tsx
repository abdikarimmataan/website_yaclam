"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Star, Wallet, ArrowLeft } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuthSession } from "@/components/auth/use-auth-session";
import { cn } from "@/lib/utils";

const items = [
  { href: "/instructor", label: "Overview", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/instructor/students", label: "Students", icon: Users },
  { href: "/instructor/reviews", label: "Reviews", icon: Star },
  { href: "/instructor/earnings", label: "Earnings", icon: Wallet },
];

export function InstructorSidebar() {
  const pathname = usePathname();
  const session = useAuthSession();
  const initials = session?.initials ?? "I";
  const displayName = session?.displayName ?? "Instructor";
  return (
    <aside className="border-b border-line bg-navy p-4 text-white md:border-b-0 md:border-r md:border-white/10 md:p-6">
      <div className="mb-4 flex items-center gap-2.5 px-2 md:mb-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold text-sm font-bold text-navy">
          {initials}
        </span>
        <div>
          <div className="text-[14px] font-bold">{displayName}</div>
          <div className="text-[12px] text-white/55">Instructor</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((s) => {
          const active = pathname === s.href;
          return (
            <Link key={s.href} href={s.href} className={cn("flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14.5px] font-semibold transition md:py-3", active ? "bg-white/15 text-gold" : "text-white/75 hover:bg-white/10 hover:text-white")}>
              <s.icon size={18} /> {s.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/dashboard" className="mt-4 hidden items-center gap-2.5 rounded-[10px] border border-dashed border-white/20 px-3.5 py-3 text-[13.5px] font-semibold text-gold transition hover:border-gold lg:flex">
        <ArrowLeft size={16} /> Student view
      </Link>
      <LogoutButton className="mt-3 hidden w-full items-center justify-center gap-2 rounded-[10px] border border-white/15 px-3.5 py-2.5 text-[13.5px] font-semibold text-white/70 transition hover:border-white/30 hover:text-white lg:flex" />
    </aside>
  );
}
