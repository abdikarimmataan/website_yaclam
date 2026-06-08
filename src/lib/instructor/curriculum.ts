import type { CourseModule } from "@/lib/instructor/course-types";
import { sanitizeCurriculumForApi } from "@/lib/instructor/course-form";

export function validateCurriculumForm(curriculum: CourseModule[]): Record<string, string> {
  const errors: Record<string, string> = {};
  curriculum.forEach((mod, moduleIndex) => {
    if (!String(mod.title ?? "").trim()) {
      errors[`module-${moduleIndex}-title`] = "Module title is required";
    }
    (mod.lessons ?? []).forEach((lesson, lessonIndex) => {
      if (!String(lesson.title ?? "").trim()) {
        errors[`module-${moduleIndex}-lesson-${lessonIndex}-title`] = "Lesson title is required";
      }
    });
  });
  return errors;
}

export function buildCurriculumPayload(curriculum: CourseModule[]): {
  payload: CourseModule[] | null;
  errors: Record<string, string>;
} {
  const errors = validateCurriculumForm(curriculum);
  if (Object.keys(errors).length) return { payload: null, errors };
  return { payload: sanitizeCurriculumForApi(curriculum), errors: {} };
}
