"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useAuthSession } from "@/components/auth/use-auth-session";
import { CourseFormFields } from "@/components/instructor/course-form-fields";
import { CourseMediaPanel } from "@/components/instructor/course-media-panel";
import { CourseSectionNav } from "@/components/instructor/course-section-nav";
import { InstructorTokenPanel } from "@/components/instructor/instructor-token-panel";
import {
  COURSE_FORM_PANELS,
  getCoursePanelFields,
} from "@/lib/instructor/course-form-config";
import { buildCoursePayload, courseRecordToForm } from "@/lib/instructor/course-form";
import {
  deleteInstructorCourse,
  getFieldOptions,
  getInstructorCourseById,
  saveInstructorCourse,
  updateInstructorCourseStatus,
  type CourseUploadFiles,
} from "@/lib/api/instructor-course.service";
import type { Select2Option } from "@/components/shared/select2";
import { toast } from "@/lib/utils/toast";

type Props = {
  recordId: string | null;
  onBack: () => void;
  onSaved: () => void;
};

export function CourseFormEditor({ recordId, onBack, onSaved }: Props) {
  const session = useAuthSession();
  const editing = Boolean(recordId);
  const [activeId, setActiveId] = useState<string | null>(recordId);
  const [form, setForm] = useState<Record<string, unknown>>(courseRecordToForm(null));
  const [fieldId, setFieldId] = useState("");
  const [fieldOptions, setFieldOptions] = useState<Select2Option[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [uploadFiles, setUploadFiles] = useState<CourseUploadFiles>({});
  const [loading, setLoading] = useState(Boolean(recordId));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("media");

  const selectOptions: Select2Option[] = useMemo(
    () => fieldOptions.map((f) => ({ id: f.id, text: f.text, icon: f.icon })),
    [fieldOptions]
  );

  const sectionItems = useMemo(
    () => [
      { id: "media", title: "Media uploads", errorCount: errors.fieldId ? 1 : 0 },
      ...COURSE_FORM_PANELS.map((panel) => {
        const fields = getCoursePanelFields(panel);
        const errorCount = fields.filter((f) => errors[f.key]).length;
        if (!fields.length && panel.id !== "instructor") return null;
        return { id: panel.id, title: panel.title, errorCount };
      }).filter((item): item is { id: string; title: string; errorCount: number } => Boolean(item)),
    ],
    [errors]
  );

  const activePanel = COURSE_FORM_PANELS.find((p) => p.id === activeSection);

  useEffect(() => {
    getFieldOptions()
      .then((rows) =>
        setFieldOptions(rows.map((r) => ({ id: r.id, text: r.name, icon: r.icon })))
      )
      .catch(() => toast.error("Failed to load fields"))
      .finally(() => setLoadingFields(false));
  }, []);

  const applyInstructor = useCallback(() => {
    if (!session?.userId) return;
    setForm((prev) => ({
      ...prev,
      "instructor.instructorId": session.userId,
      "instructor.name": session.displayName,
    }));
  }, [session]);

  const load = useCallback(async () => {
    if (!recordId) {
      setActiveId(null);
      const empty = courseRecordToForm(null);
      setForm(empty);
      setFieldId("");
      setUploadFiles({});
      setLoading(false);
      applyInstructor();
      return;
    }
    setActiveId(recordId);
    setLoading(true);
    try {
      const record = await getInstructorCourseById(recordId);
      const next = courseRecordToForm(record);
      setForm(next);
      setFieldId(String(next.fieldId ?? ""));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [recordId, applyInstructor]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!recordId) applyInstructor();
  }, [recordId, applyInstructor]);

  const patch = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.fieldId;
      return next;
    });
  };

  const save = async () => {
    if (!session?.userId) {
      toast.error("Please sign in as instructor.");
      return;
    }
    const formData = {
      ...form,
      fieldId: fieldId.trim(),
      "instructor.instructorId": session.userId,
      "instructor.name": session.displayName,
    };
    const { payload, errors: formErrors } = buildCoursePayload(formData, editing);
    if (!payload) {
      setErrors(formErrors);
      const firstErrorKey = Object.keys(formErrors)[0];
      if (firstErrorKey === "fieldId") setActiveSection("media");
      else {
        const panel = COURSE_FORM_PANELS.find((p) =>
          getCoursePanelFields(p).some((f) => f.key === firstErrorKey)
        );
        if (panel) setActiveSection(panel.id);
      }
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    try {
      const saved = await saveInstructorCourse(activeId, payload, uploadFiles);
      const savedId = saved.id ? String(saved.id) : activeId;
      setActiveId(savedId);
      setUploadFiles({});
      if (savedId) await updateInstructorCourseStatus(savedId, form.status !== false);
      toast.success(editing ? "Course updated." : "Course created.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!activeId || !confirm("Delete this course?")) return;
    setDeleting(true);
    try {
      await deleteInstructorCourse(activeId);
      toast.success("Course deleted.");
      onSaved();
      onBack();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="button" onClick={onBack} className="btn btn-outline btn-sm w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to list
        </button>
        <h1 className="text-lg font-bold text-navy sm:text-xl">{editing ? "Edit Course" : "Create Course"}</h1>
        {activeId && (
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="btn btn-outline btn-sm ml-auto text-red-400"
          >
            <Trash2 className="h-4 w-4" /> {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-ink-3">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading course…
        </div>
      ) : (
        <div className="rounded-xl border border-[#1f2a4a] bg-[#0f1631]">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <aside className="border-b border-[#1f2a4a] p-3 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-4">
              <p className="mb-2 hidden text-[11px] font-bold uppercase tracking-wider text-ink-3 lg:block">
                Sections
              </p>
              <CourseSectionNav
                items={sectionItems}
                activeId={activeSection}
                onSelect={setActiveSection}
              />
            </aside>

            <div className="min-w-0 flex-1 p-4 sm:p-5">
              {activeSection === "media" ? (
                <CourseMediaPanel
                  embedded
                  fieldId={fieldId}
                  fieldOptions={selectOptions}
                  onFieldChange={(v) => {
                    setFieldId(v);
                    patch("fieldId", v);
                  }}
                  fieldError={errors.fieldId}
                  savedThumbnailUrl={String(form.thumbnail ?? "")}
                  thumbnailFile={uploadFiles.thumbnail ?? null}
                  videoFile={uploadFiles.video ?? null}
                  onThumbnailFileChange={(f) => setUploadFiles((p) => ({ ...p, thumbnail: f }))}
                  onVideoFileChange={(f) => setUploadFiles((p) => ({ ...p, video: f }))}
                  loadingFields={loadingFields}
                />
              ) : activePanel ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-navy">{activePanel.title}</h2>
                    {activePanel.description ? (
                      <p className="mt-1 text-xs text-ink-3">{activePanel.description}</p>
                    ) : null}
                  </div>
                  {activePanel.id === "instructor" ? <InstructorTokenPanel /> : null}
                  {getCoursePanelFields(activePanel).length > 0 ? (
                    <CourseFormFields
                      fields={getCoursePanelFields(activePanel)}
                      form={form}
                      errors={errors}
                      onChange={patch}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end border-t border-[#1f2a4a] p-4 sm:p-5">
            <button type="button" onClick={save} disabled={saving} className="btn btn-gold min-w-[140px]">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save course"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
