"use client";

import { BookOpen, Eye, FileStack, Pencil } from "lucide-react";
import type { CourseApiRecord } from "@/lib/api/course.types";
import { getCourseFieldName, getCourseLabel } from "@/lib/api/instructor-course.service";

type Props = {
  loading: boolean;
  items: CourseApiRecord[];
  search: string;
  page: number;
  pageSize: number;
  totalPages: number;
  filteredCount: number;
  busyId: string | null;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (item: CourseApiRecord) => void;
  onShow: (item: CourseApiRecord) => void;
  onCurriculum: (item: CourseApiRecord) => void;
  onResources: (item: CourseApiRecord) => void;
  onToggleVisible: (item: CourseApiRecord) => void;
};

export function InstructorCourseTable({
  loading,
  items,
  search,
  page,
  pageSize,
  totalPages,
  filteredCount,
  busyId,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onShow,
  onCurriculum,
  onResources,
  onToggleVisible,
}: Props) {
  const startIdx = (page - 1) * pageSize;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="overflow-hidden rounded-xl border border-[#1f2a4a] bg-[#0f1631]">
      <div className="border-b border-[#1f2a4a] px-4 py-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter courses…"
          className="w-full max-w-xs rounded-lg border border-[#1f2a4a] bg-[#0b1126] px-3 py-2 text-xs text-[#e8ecf8] placeholder:text-[#6b7896] focus:border-royal focus:outline-none sm:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs">
          <thead>
            <tr className="border-b border-[#1f2a4a] text-left text-ink-3">
              {["No.", "Title", "Field", "Visible", "Actions"].map((h) => (
                <th key={h} className={`px-3 py-2 font-semibold ${h === "Actions" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-12 text-center text-ink-3">
                  Loading courses…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-12 text-center text-ink-3">
                  No courses found
                </td>
              </tr>
            ) : (
              items.map((item, i) => {
                const id = String(item.id ?? i);
                const visible = item.isVisible !== false;
                return (
                  <tr key={id} className="border-b border-[#1f2a4a] last:border-0 hover:bg-white/5">
                    <td className="px-3 py-2 tabular-nums text-ink-2">{startIdx + i + 1}</td>
                    <td className="px-3 py-2 font-medium text-navy">{getCourseLabel(item)}</td>
                    <td className="px-3 py-2 text-ink-3">{getCourseFieldName(item)}</td>
                    <td className="px-3 py-2">
                      <label className="inline-flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={visible}
                          disabled={busyId === id}
                          onChange={() => onToggleVisible(item)}
                          className="h-3.5 w-3.5 rounded"
                        />
                        <span className="text-ink-3">{visible ? "Visible" : "Hidden"}</span>
                      </label>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap justify-end gap-1 sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => onShow(item)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 font-semibold text-ink-2 hover:bg-white/10 disabled:opacity-50"
                        >
                          <Eye className="h-3.5 w-3.5" /> Show
                        </button>
                        <button
                          type="button"
                          onClick={() => onResources(item)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 font-semibold text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          <FileStack className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Resources</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onCurriculum(item)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 font-semibold text-violet-400 hover:bg-violet-500/10 disabled:opacity-50"
                        >
                          <BookOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Curriculum</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          disabled={busyId === id}
                          className="inline-flex items-center rounded p-1.5 text-gold hover:bg-gold/10 disabled:opacity-50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#1f2a4a] px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="rounded-md border border-[#1f2a4a] bg-[#0b1126] px-2 py-1 text-xs text-[#e8ecf8]"
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>Rows per page · {filteredCount} total</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => canPrev && onPageChange(page - 1)}
              className="rounded-md border border-[#1f2a4a] px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 text-xs text-ink-3">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => canNext && onPageChange(page + 1)}
              className="rounded-md border border-[#1f2a4a] px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
