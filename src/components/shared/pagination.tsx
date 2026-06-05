import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pages: number;
  basePath?: string;
  className?: string;
};

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function buildPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function PillNav({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled
        aria-label={label}
        className="inline-flex min-w-[72px] items-center justify-center rounded-full bg-surface-2 px-5 py-2.5 text-[14px] font-bold text-ink-3/50"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex min-w-[72px] items-center justify-center rounded-full bg-royal px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-navy"
    >
      {children}
    </Link>
  );
}

export function Pagination({ page, pages, basePath = "/scholarships", className }: PaginationProps) {
  if (pages <= 1) return null;

  const items = buildPageItems(page, pages);
  const prev = Math.max(1, page - 1);
  const next = Math.min(pages, page + 1);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-2 sm:gap-3", className)}
      aria-label="Pagination"
    >
      <PillNav href={pageHref(basePath, prev)} disabled={page <= 1} label="Previous page">
        Prev
      </PillNav>

      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${i}`}
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-[15px] font-medium text-ink-3"
              >
                …
              </span>
            );
          }

          const active = item === page;
          if (active) {
            return (
              <span
                key={item}
                aria-current="page"
                className="grid h-10 w-10 place-items-center rounded-full bg-royal text-[14px] font-bold text-white"
              >
                {item}
              </span>
            );
          }

          return (
            <Link
              key={item}
              href={pageHref(basePath, item)}
              className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-[14px] font-semibold text-ink-3 transition hover:bg-line hover:text-navy"
            >
              {item}
            </Link>
          );
        })}
      </div>

      <PillNav href={pageHref(basePath, next)} disabled={page >= pages} label="Next page">
        Next
      </PillNav>
    </nav>
  );
}
