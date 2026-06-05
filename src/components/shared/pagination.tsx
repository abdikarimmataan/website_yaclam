import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

function buildPageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  return [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
}

export function Pagination({ page, pages, basePath = "/scholarships", className }: PaginationProps) {
  if (pages <= 1) return null;

  const nums = buildPageNumbers(page, pages);
  const prev = Math.max(1, page - 1);
  const next = Math.min(pages, page + 1);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      aria-label="Pagination"
    >
      <Link
        href={pageHref(basePath, prev)}
        aria-disabled={page <= 1}
        className={cn(
          "btn btn-outline btn-sm inline-flex items-center gap-1",
          page <= 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft size={16} /> Previous
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        {nums.map((n, i) => {
          const prevNum = nums[i - 1];
          const showEllipsis = i > 0 && prevNum != null && n - prevNum > 1;
          return (
            <span key={n} className="flex items-center gap-1.5">
              {showEllipsis ? (
                <span className="px-1 text-[13px] text-ink-3" aria-hidden>
                  …
                </span>
              ) : null}
              <Link
                href={pageHref(basePath, n)}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-[13px] font-semibold transition",
                  n === page
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-ink-2 hover:border-royal hover:text-royal"
                )}
              >
                {n}
              </Link>
            </span>
          );
        })}
      </div>

      <Link
        href={pageHref(basePath, next)}
        aria-disabled={page >= pages}
        className={cn(
          "btn btn-outline btn-sm inline-flex items-center gap-1",
          page >= pages && "pointer-events-none opacity-40"
        )}
      >
        Next <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
