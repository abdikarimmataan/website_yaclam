"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAuthSession } from "@/components/auth/use-auth-session";
import { redirectPathForRole } from "@/lib/auth/session";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/roadmaps", label: "Career Roadmaps" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { session, isLoggedIn } = useAuthSession();
  const dashboardHref = session ? redirectPathForRole(session.role) : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 text-[22px] font-extrabold tracking-tight text-navy">
          <span className="ar grid h-9 w-9 place-items-center rounded-[11px] bg-gradient-to-br from-navy to-royal text-[20px] text-gold">ي</span>
          <span>Yaclam<span className="text-gold">.</span></span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative text-[15px] font-semibold text-ink-2 transition-colors hover:text-navy",
                    active && "text-navy after:absolute after:-bottom-[26px] after:left-0 after:right-0 after:h-[3px] after:rounded after:bg-gold"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          {isLoggedIn ? (
            <Link href={dashboardHref} className="btn btn-navy btn-sm hidden lg:inline-flex">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden font-bold text-navy lg:inline">
                Log in
              </Link>
              <Link href="/register" className="btn btn-gold btn-sm hidden lg:inline-flex">
                Register
              </Link>
            </>
          )}
          <button className="grid place-items-center lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} className="text-navy" /> : <Menu size={24} className="text-navy" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="container flex flex-col gap-1 border-t border-line py-4 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-surface-2 px-1 py-3 font-semibold text-ink-2">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2.5 pt-3">
            {isLoggedIn ? (
              <Link href={dashboardHref} onClick={() => setOpen(false)} className="btn btn-navy btn-sm flex-1">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-outline btn-sm flex-1">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn btn-gold btn-sm flex-1">
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[14px] font-semibold text-ink-2">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
