"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Star, Wallet, ArrowLeft } from "lucide-react";
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
  return (
    <aside className="border-b border-line bg-navy p-4 text-white md:border-b-0 md:border-r md:border-white/10 md:p-6">
      <div className="mb-5 hidden items-center gap-2.5 px-2 md:flex">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold font-bold text-navy">AM</span>
        <div>
          <div className="text-[14px] font-bold">Abdikarim Mataan</div>
          <div className="text-[12px] text-white/55">Instructor</div>
        </div>
      </div>
      <nav className="flex gap-1.5 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
        {items.map((s) => {
          const active = pathname === s.href;
          return (
            <Link key={s.href} href={s.href} className={cn("flex shrink-0 items-center gap-3 whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-[14.5px] font-semibold transition md:py-3", active ? "bg-white/15 text-gold" : "text-white/75 hover:bg-white/10 hover:text-white")}>
              <s.icon size={18} /> {s.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/dashboard" className="mt-4 hidden items-center gap-2.5 rounded-[10px] border border-dashed border-white/20 px-3.5 py-3 text-[13.5px] font-semibold text-gold transition hover:border-gold md:flex">
        <ArrowLeft size={16} /> Student view
      </Link>
    </aside>
  );
}
