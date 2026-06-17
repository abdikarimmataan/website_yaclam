"use client";

import { X } from "lucide-react";
import type { CourseApiRecord } from "@/lib/api/course.types";
import { getCourseFieldName, getCourseLabel } from "@/lib/api/instructor-course.service";
import { uploadUrl } from "@/lib/api/cms";

type Props = {
  open: boolean;
  loading: boolean;
  record: CourseApiRecord | null;
  onClose: () => void;
};

export function CoursePreviewModal({ open, loading, record, onClose }: Props) {
  if (!open) return null;

  const thumb = record?.thumbnail ? uploadUrl(record.thumbnail) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#1f2a4a] bg-[#0f1631] shadow-xl">
        <div className="flex items-start justify-between border-b border-[#1f2a4a] px-5 py-4">
          <h2 className="text-lg font-bold text-navy">Course preview</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-ink-3 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          {loading ? (
            <p className="text-ink-3">Loading…</p>
          ) : record ? (
            <>
              {thumb && (
                <img src={thumb} alt="" className="h-40 w-full rounded-xl object-cover" />
              )}
              <div>
                <h3 className="text-xl font-bold text-navy">{getCourseLabel(record)}</h3>
                <p className="mt-1 text-sm text-ink-3">Field: {getCourseFieldName(record)}</p>
              </div>
              {record.shortDescription && (
                <p className="text-sm text-ink-2">{record.shortDescription}</p>
              )}
              {record.description && (
                <p className="text-sm text-ink-3">{record.description}</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs text-ink-3">
                <span>Level: {record.level ?? "—"}</span>
                <span>Language: {record.language ?? "—"}</span>
                <span>Price: {record.isFree ? "Free" : `$${record.price ?? 0}`}</span>
                <span>Featured: {record.isFeatured ? "Yes" : "No"}</span>
              </div>
              {record.overview?.outcomes?.length ? (
                <div>
                  <p className="mb-2 text-sm font-semibold text-navy">Outcomes</p>
                  <ul className="list-inside list-disc text-sm text-ink-3">
                    {record.overview.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-ink-3">No data</p>
          )}
        </div>
      </div>
    </div>
  );
}
