"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, BookOpen, Heart, ShoppingCart, Settings,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuthSession } from "@/components/auth/use-auth-session";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  // { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { session } = useAuthSession();
  const initials = session?.initials ?? "S";
  const displayName = session?.displayName ?? "Student";
  return (
    <aside className="border-b border-line bg-surface p-4 md:border-b-0 md:border-r md:p-6">
      <div className="mb-5 hidden items-center gap-2.5 px-2 md:flex">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-navy to-royal text-sm font-bold text-gold">
          {initials}
        </span>
        <div>
          <div className="text-[14px] font-bold text-navy">{displayName}</div>
          <div className="text-[12px] text-ink-3">Student</div>
        </div>
      </div>
      <nav className="flex gap-1.5 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
        {items.map((s) => {
          const active = pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-[14.5px] font-semibold transition md:py-3",
                active ? "bg-navy text-white [&_svg]:text-gold" : "text-ink-2 hover:bg-white hover:text-navy"
              )}
            >
              <s.icon size={18} /> {s.label}
            </Link>
          );
        })}
      </nav>
      <LogoutButton className="mt-4 hidden w-full items-center justify-center gap-2 rounded-[10px] border border-line px-3.5 py-2.5 text-[13.5px] font-semibold text-ink-3 transition hover:border-danger/30 hover:text-danger md:flex" />
    </aside>
  );
}
