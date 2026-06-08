"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import type { CourseLesson, CourseModule } from "@/lib/instructor/course-types";
import { buildCurriculumPayload } from "@/lib/instructor/curriculum";
import {
  getInstructorCourseById,
  saveInstructorCurriculum,
  uploadInstructorLessonVideo,
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

function emptyLesson(mi: number, li: number, prefix: string): CourseLesson {
  return {
    id: `${prefix}-m${mi + 1}-l${li + 1}`,
    title: "",
    duration: "",
    free: false,
    videoUrl: "",
    sortOrder: li,
    isVisible: true,
  };
}

export function CourseCurriculumEditor({ courseId, courseTitle, onBack, onSaved }: Props) {
  const [curriculum, setCurriculum] = useState<CourseModule[]>([]);
  const [prefix, setPrefix] = useState("course");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const record = await getInstructorCourseById(courseId);
      setCurriculum(Array.isArray(record.curriculum) ? record.curriculum : []);
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
    const { payload, errors: e } = buildCurriculumPayload(curriculum);
    if (!payload) {
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      await saveInstructorCurriculum(courseId, payload);
      toast.success("Curriculum saved.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadVideo = async (mi: number, li: number, file: File) => {
    const key = `${mi}-${li}`;
    setUploading(key);
    try {
      const res = await uploadInstructorLessonVideo(courseId, mi, li, file);
      if (res.videoUrl) {
        setCurriculum((prev) =>
          prev.map((mod, i) =>
            i !== mi
              ? mod
              : {
                  ...mod,
                  lessons: (mod.lessons ?? []).map((lesson, j) =>
                    j === li ? { ...lesson, videoUrl: res.videoUrl } : lesson
                  ),
                }
          )
        );
        if (res.course?.curriculum) setCurriculum(res.course.curriculum);
      }
      toast.success("Video uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
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
                <input
                  className="field-input flex-1 bg-[#0b1126] text-[#e8ecf8]"
                  placeholder="Module title *"
                  value={String(mod.title ?? "")}
                  onChange={(e) =>
                    setCurriculum((p) =>
                      p.map((m, i) => (i === mi ? { ...m, title: e.target.value } : m))
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setCurriculum((p) => p.filter((_, i) => i !== mi))}
                  className="text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {(mod.lessons ?? []).map((lesson, li) => (
                <div key={li} className="mb-3 rounded-lg border border-[#1f2a4a] bg-[#0b1126] p-3">
                  <input
                    className="field-input mb-2 w-full"
                    placeholder="Lesson title *"
                    value={String(lesson.title ?? "")}
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
                    className="field-input mb-2 w-full"
                    placeholder="Duration e.g. 12:30"
                    value={String(lesson.duration ?? "")}
                    onChange={(e) =>
                      setCurriculum((p) =>
                        p.map((m, i) =>
                          i !== mi
                            ? m
                            : {
                                ...m,
                                lessons: (m.lessons ?? []).map((l, j) =>
                                  j === li ? { ...l, duration: e.target.value } : l
                                ),
                              }
                        )
                      )
                    }
                  />
                  {lesson.videoUrl && (
                    <p className="mb-1 text-xs text-emerald-400">Video attached</p>
                  )}
                  <input
                    type="file"
                    accept="video/mp4"
                    className="text-xs text-ink-3"
                    disabled={uploading === `${mi}-${li}`}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadVideo(mi, li, f);
                    }}
                  />
                </div>
              ))}
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
