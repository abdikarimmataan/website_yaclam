import type { CourseLessonFormRow, CourseModule } from "@/lib/instructor/course-types";
import { sanitizeCurriculumForApi } from "@/lib/instructor/course-form";

export type LessonVideoTarget = {
  moduleIndex: number;
  lessonIndex: number;
  lessonId?: string;
};

export type CurriculumSavePayload = {
  curriculum: CourseModule[];
  lessonVideoTargets: LessonVideoTarget[];
  files: File[];
};

function lessonHasVideo(lesson: CourseLessonFormRow): boolean {
  return Boolean(String(lesson.videoUrl ?? "").trim() || lesson.pendingVideoFile);
}

export type CurriculumValidationResult = {
  errors: Record<string, string>;
  toastMessages: string[];
};

export function validateCurriculumForm(curriculum: CourseModule[]): CurriculumValidationResult {
  const errors: Record<string, string> = {};
  const toastMessages: string[] = [];

  if (curriculum.length === 0) {
    toastMessages.push("Add at least one module before saving.");
  }

  curriculum.forEach((mod, moduleIndex) => {
    const modTitle = String(mod.title ?? "").trim() || `Module ${moduleIndex + 1}`;

    if (!String(mod.title ?? "").trim()) {
      errors[`module-${moduleIndex}-title`] = "Module title is required";
      toastMessages.push(`Module ${moduleIndex + 1}: title is required.`);
    }

    const lessons = mod.lessons ?? [];

    if (lessons.length === 0) {
      toastMessages.push(`"${modTitle}" has no lessons. Add a lesson or remove the module.`);
    }

    lessons.forEach((lesson, lessonIndex) => {
      const lessonTitle = String(lesson.title ?? "").trim() || `Lesson ${lessonIndex + 1}`;

      if (!String(lesson.title ?? "").trim()) {
        errors[`module-${moduleIndex}-lesson-${lessonIndex}-title`] = "Lesson title is required";
        toastMessages.push(`"${modTitle}" › ${lessonTitle}: lesson title is required.`);
      }

      if (!lessonHasVideo(lesson as CourseLessonFormRow)) {
        errors[`module-${moduleIndex}-lesson-${lessonIndex}-video`] =
          "Lesson video is required. Upload a video or remove this lesson.";
        toastMessages.push(
          `"${modTitle}" › "${lessonTitle}": video is required. Upload a video or remove this lesson.`
        );
      }
    });
  });

  return { errors, toastMessages };
}

export function buildCurriculumPayload(curriculum: CourseModule[]): {
  payload: CurriculumSavePayload | null;
  errors: Record<string, string>;
  toastMessages: string[];
} {
  const { errors, toastMessages } = validateCurriculumForm(curriculum);
  if (Object.keys(errors).length) return { payload: null, errors, toastMessages };

  const lessonVideoTargets: LessonVideoTarget[] = [];
  const files: File[] = [];

  curriculum.forEach((mod, moduleIndex) => {
    (mod.lessons ?? []).forEach((lesson, lessonIndex) => {
      const row = lesson as CourseLessonFormRow;
      if (!row.pendingVideoFile) return;
      lessonVideoTargets.push({
        moduleIndex,
        lessonIndex,
        lessonId: String(row.id ?? "").trim() || undefined,
      });
      files.push(row.pendingVideoFile);
    });
  });

  const sanitized = sanitizeCurriculumForApi(
    curriculum.map((mod) => ({
      ...mod,
      lessons: (mod.lessons ?? []).map((lesson) => {
        const { pendingVideoFile: _pending, ...rest } = lesson as CourseLessonFormRow;
        return rest;
      }),
    }))
  );

  return {
    payload: { curriculum: sanitized, lessonVideoTargets, files },
    errors: {},
    toastMessages: [],
  };
}
