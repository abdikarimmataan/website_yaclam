"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import type { CourseResourceFormRow } from "@/lib/instructor/course-types";
import { buildResourcesPayload, emptyCourseResource } from "@/lib/instructor/resources";
import { getInstructorCourseById, saveInstructorResources } from "@/lib/api/instructor-course.service";
import { uploadUrl } from "@/lib/api/cms";
import { toast } from "@/lib/utils/toast";

type Props = {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
  onSaved: () => void;
};

export function CourseResourcesEditor({ courseId, courseTitle, onBack, onSaved }: Props) {
  const [resources, setResources] = useState<CourseResourceFormRow[]>([]);
  const [prefix, setPrefix] = useState("course");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const record = await getInstructorCourseById(courseId);
      const rows = (record.resources ?? []).map((r) => ({ ...r, pendingFile: null }));
      setResources(rows);
      setPrefix(String(record.id ?? courseId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    const { payload, errors: e } = buildResourcesPayload(resources);
    if (!payload) {
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      const saved = await saveInstructorResources(courseId, payload);
      setResources((saved.resources ?? []).map((r) => ({ ...r, pendingFile: null })));
      toast.success("Resources saved.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack} className="btn btn-outline btn-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-navy">Resources — {courseTitle}</h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-ink-3">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-4">
          {resources.length === 0 && (
            <p className="text-sm text-ink-3">No resources yet. Add a downloadable file.</p>
          )}

          {resources.map((row, index) => {
            const fileUrl = String(row.fileUrl ?? "").trim();
            const href = fileUrl ? uploadUrl(fileUrl) : null;
            return (
              <div key={row.id ?? index} className="rounded-xl border border-[#1f2a4a] bg-[#0f1631] p-4">
                <div className="mb-3 flex gap-2">
                  <input
                    className="field-input flex-1 bg-[#0b1126]"
                    placeholder="Resource title *"
                    value={String(row.title ?? "")}
                    onChange={(e) =>
                      setResources((p) =>
                        p.map((r, i) => (i === index ? { ...r, title: e.target.value } : r))
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setResources((p) => p.filter((_, i) => i !== index))}
                    className="text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  className="field-input mb-3 w-full min-h-[60px] bg-[#0b1126]"
                  placeholder="Description"
                  value={String(row.description ?? "")}
                  onChange={(e) =>
                    setResources((p) =>
                      p.map((r, i) => (i === index ? { ...r, description: e.target.value } : r))
                    )
                  }
                />
                {href && !row.pendingFile && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 inline-flex items-center gap-1 text-xs text-gold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Current file
                  </a>
                )}
                <input
                  type="file"
                  className="text-xs text-ink-3"
                  onChange={(e) =>
                    setResources((p) =>
                      p.map((r, i) =>
                        i === index ? { ...r, pendingFile: e.target.files?.[0] ?? null } : r
                      )
                    )
                  }
                />
                {errors[`resource-${index}-file`] && (
                  <p className="mt-1 text-xs text-red-400">{errors[`resource-${index}-file`]}</p>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setResources((p) => [...p, emptyCourseResource(p.length, prefix)])}
            className="btn btn-outline btn-sm"
          >
            <Plus className="h-4 w-4" /> Add resource
          </button>

          <div className="flex justify-end">
            <button type="button" onClick={save} disabled={saving} className="btn btn-gold">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save resources"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
