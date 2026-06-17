"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import type { CourseLessonFormRow, CourseModule } from "@/lib/instructor/course-types";
import { buildCurriculumPayload } from "@/lib/instructor/curriculum";
import {
  getInstructorCourseById,
  saveInstructorCurriculum,
} from "@/lib/api/instructor-course.service";
import { toast } from "@/lib/utils/toast";

type Props = {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
  onSaved: () => void;
};

function emptyModule(i: number): CourseModule {
  return { title: "", sortOrder: i, isVisible: true, lessons: [] };
}

function emptyLesson(mi: number, li: number, prefix: string): CourseLessonFormRow {
  return {
    id: `${prefix}-m${mi + 1}-l${li + 1}`,
    title: "",
    duration: "",
    free: false,
    videoUrl: "",
    sortOrder: li,
    isVisible: true,
    pendingVideoFile: null,
  };
}

function normalizeCurriculum(value: unknown): CourseModule[] {
  if (!Array.isArray(value)) return [];
  return value.map((mod) => ({
    ...(mod as CourseModule),
    lessons: ((mod as CourseModule).lessons ?? []).map((lesson) => ({
      ...lesson,
      pendingVideoFile: null,
    })),
  }));
}

export function CourseCurriculumEditor({ courseId, courseTitle, onBack, onSaved }: Props) {
  const [curriculum, setCurriculum] = useState<CourseModule[]>([]);
  const [prefix, setPrefix] = useState("course");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fileInputKeys, setFileInputKeys] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const record = await getInstructorCourseById(courseId);
      setCurriculum(normalizeCurriculum(record.curriculum));
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
    const { payload, errors: e, toastMessages } = buildCurriculumPayload(curriculum);
    if (!payload) {
      setErrors(e);
      toastMessages.forEach((msg) => toast.error(msg));
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      const saved = await saveInstructorCurriculum(courseId, payload);
      setCurriculum(normalizeCurriculum(saved.curriculum));
      toast.success("Curriculum saved.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const clearLessonVideo = (mi: number, li: number) => {
    setCurriculum((p) =>
      p.map((m, i) =>
        i !== mi
          ? m
          : {
              ...m,
              lessons: (m.lessons ?? []).map((lesson, j) =>
                j === li ? { ...lesson, videoUrl: "", pendingVideoFile: null } : lesson
              ),
            }
      )
    );
    const key = `${mi}-${li}`;
    setFileInputKeys((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack} className="btn btn-outline btn-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-navy">Curriculum — {courseTitle}</h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-ink-3">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-4">
          {curriculum.map((mod, mi) => (
            <div key={mi} className="rounded-xl border border-[#1f2a4a] bg-[#0f1631] p-4">
              <div className="mb-3 flex gap-2">
                <div className="flex-1">
                  <input
                    className="field-input w-full bg-[#0b1126] text-[#e8ecf8]"
                    placeholder="Module title *"
                    value={String(mod.title ?? "")}
                    onChange={(e) =>
                      setCurriculum((p) =>
                        p.map((m, i) => (i === mi ? { ...m, title: e.target.value } : m))
                      )
                    }
                  />
                  {errors[`module-${mi}-title`] && (
                    <p className="mt-1 text-xs text-red-400">{errors[`module-${mi}-title`]}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCurriculum((p) => p.filter((_, i) => i !== mi))}
                  className="text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {(mod.lessons ?? []).map((lesson, li) => {
                const row = lesson as CourseLessonFormRow;
                const videoUrl = String(row.videoUrl ?? "").trim();
                const pendingFile = row.pendingVideoFile ?? null;
                const hasSavedVideo = Boolean(videoUrl && !pendingFile);

                return (
                  <div key={li} className="mb-3 rounded-lg border border-[#1f2a4a] bg-[#0b1126] p-3">
                    <input
                      className="field-input mb-2 w-full"
                      placeholder="Lesson title *"
                      value={String(row.title ?? "")}
                      onChange={(e) =>
                        setCurriculum((p) =>
                          p.map((m, i) =>
                            i !== mi
                              ? m
                              : {
                                  ...m,
                                  lessons: (m.lessons ?? []).map((l, j) =>
                                    j === li ? { ...l, title: e.target.value } : l
                                  ),
                                }
                          )
                        )
                      }
                    />
                    <input
                      className="field-input mb-2 w-full cursor-default select-none bg-[#0b1126] text-gray-400"
                      placeholder="Auto from video"
                      value={String(row.duration ?? "")}
                      readOnly
                      title="Duration is set automatically from the selected video"
                    />

                    {hasSavedVideo ? (
                      <p className="mb-2 text-xs text-emerald-400">
                        Current video: {videoUrl.split("/").pop()} —{" "}
                        <button
                          type="button"
                          onClick={() => clearLessonVideo(mi, li)}
                          className="text-red-400 underline"
                        >
                          remove
                        </button>
                      </p>
                    ) : null}

                    {pendingFile ? (
                      <p className="mb-2 text-xs text-emerald-400">
                        New video selected: {pendingFile.name}
                      </p>
                    ) : null}

                    {!lessonHasVideo(row) && errors[`module-${mi}-lesson-${li}-video`] ? (
                      <p className="mb-1 text-xs text-red-400">
                        {errors[`module-${mi}-lesson-${li}-video`]}
                      </p>
                    ) : null}

                    <input
                      key={fileInputKeys[`${mi}-${li}`] ?? 0}
                      type="file"
                      accept="video/mp4"
                      className="text-xs text-ink-3"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setCurriculum((p) =>
                          p.map((m, i) =>
                            i !== mi
                              ? m
                              : {
                                  ...m,
                                  lessons: (m.lessons ?? []).map((l, j) =>
                                    j === li ? { ...l, pendingVideoFile: f } : l
                                  ),
                                }
                          )
                        );
                        setErrors({});
                        const key = `${mi}-${li}`;
                        setFileInputKeys((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));

                        if (f) {
                          const url = URL.createObjectURL(f);
                          const vid = document.createElement("video");
                          vid.preload = "metadata";
                          vid.onloadedmetadata = () => {
                            URL.revokeObjectURL(url);
                            const total = Math.floor(vid.duration || 0);
                            const mins = Math.floor(total / 60);
                            const secs = total % 60;
                            const formatted = `${mins}:${String(secs).padStart(2, "0")}`;
                            setCurriculum((p) =>
                              p.map((m, i) =>
                                i !== mi
                                  ? m
                                  : {
                                      ...m,
                                      lessons: (m.lessons ?? []).map((l, j) =>
                                        j === li ? { ...l, duration: formatted } : l
                                      ),
                                    }
                              )
                            );
                          };
                          vid.src = url;
                        }
                      }}
                    />
                    <p className="mt-1 text-[11px] text-ink-3">
                      MP4 · saved when you click Save curriculum
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setCurriculum((p) =>
                          p.map((m, i) =>
                            i !== mi
                              ? m
                              : { ...m, lessons: (m.lessons ?? []).filter((_, j) => j !== li) }
                          )
                        )
                      }
                      className="mt-2 text-xs text-red-400 hover:underline"
                    >
                      <Trash2 className="mr-1 inline h-3.5 w-3.5" />
                      Remove lesson
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  setCurriculum((p) =>
                    p.map((m, i) =>
                      i !== mi
                        ? m
                        : {
                            ...m,
                            lessons: [
                              ...(m.lessons ?? []),
                              emptyLesson(mi, (m.lessons ?? []).length, prefix),
                            ],
                          }
                    )
                  )
                }
                className="text-xs font-semibold text-gold"
              >
                <Plus className="inline h-3.5 w-3.5" /> Add lesson
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setCurriculum((p) => [...p, emptyModule(p.length)])}
            className="btn btn-outline btn-sm"
          >
            <Plus className="h-4 w-4" /> Add module
          </button>

          <div className="flex justify-end">
            <button type="button" onClick={save} disabled={saving} className="btn btn-gold">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save curriculum"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function lessonHasVideo(lesson: CourseLessonFormRow): boolean {
  return Boolean(String(lesson.videoUrl ?? "").trim() || lesson.pendingVideoFile);
}
