"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import type { FooterViewModel } from "@/lib/api/footer.defaults";

const HIDE_PREFIXES = ["/learn", "/dashboard", "/instructor", "/login", "/register"];

export function FooterGate({ data }: { data: FooterViewModel }) {
  const pathname = usePathname();
  if (!data.isVisible) return null;
  if (HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;
  return <Footer data={data} />;
}
