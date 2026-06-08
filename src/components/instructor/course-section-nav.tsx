"use client";

import { cn } from "@/lib/utils";

export type CourseSectionItem = {
  id: string;
  title: string;
  errorCount?: number;
};

type Props = {
  items: CourseSectionItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function CourseSectionNav({ items, activeId, onSelect }: Props) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Course form sections">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition",
              active
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-transparent text-ink-2 hover:border-[#1f2a4a] hover:bg-white/5 hover:text-navy"
            )}
          >
            <span>{item.title}</span>
            {item.errorCount ? (
              <span className="shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-300">
                {item.errorCount}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
