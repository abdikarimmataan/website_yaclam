import { COURSE_FORM_FIELDS } from "@/lib/instructor/course-form-config";
import type { CourseModule } from "@/lib/instructor/course-types";
import type { CourseApiRecord } from "@/lib/api/course.types";
import type { FormField } from "@/lib/instructor/course-types";

function emptyFormValues(): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  COURSE_FORM_FIELDS.forEach((f) => {
    if (f.type === "boolean") form[f.key] = false;
    else if (f.type === "number") form[f.key] = "";
    else form[f.key] = "";
  });
  return form;
}

function getFieldId(record: CourseApiRecord): string {
  const f = record.fieldId;
  if (!f) return "";
  if (typeof f === "string") return f;
  return String(f.id ?? "");
}

function parseOutcomes(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v ?? "").trim()).filter(Boolean);
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function sanitizeCurriculumForApi(curriculum: unknown): CourseModule[] {
  if (!Array.isArray(curriculum) || curriculum.length === 0) return [];
  return curriculum
    .map((raw, moduleIndex) => {
      const mod = raw as CourseModule;
      const title = String(mod.title ?? "").trim();
      const lessons = (mod.lessons ?? [])
        .map((lesson, lessonIndex) => {
          const lessonTitle = String(lesson.title ?? "").trim();
          if (!lessonTitle) return null;
          return {
            id: String(lesson.id ?? `lesson-${moduleIndex + 1}-${lessonIndex + 1}`).trim(),
            title: lessonTitle,
            duration: String(lesson.duration ?? ""),
            free: !!lesson.free,
            videoUrl: String(lesson.videoUrl ?? ""),
            vimeoId: String(lesson.vimeoId ?? ""),
            sortOrder: Number.isFinite(Number(lesson.sortOrder)) ? Number(lesson.sortOrder) : lessonIndex,
            isVisible: lesson.isVisible !== false,
          };
        })
        .filter(Boolean);
      if (!title && lessons.length === 0) return null;
      return {
        title: title || `Module ${moduleIndex + 1}`,
        sortOrder: Number.isFinite(Number(mod.sortOrder)) ? Number(mod.sortOrder) : moduleIndex,
        isVisible: mod.isVisible !== false,
        lessons,
      };
    })
    .filter(Boolean) as CourseModule[];
}

export function courseRecordToForm(record: CourseApiRecord | null): Record<string, unknown> {
  if (!record) {
    return {
      ...emptyFormValues(),
      isPublished: true,
      isVisible: true,
      status: true,
      certificate: true,
      "instructor.instructorId": "",
      "instructor.name": "",
      "instructor.role": "",
      "instructor.bio": "",
      "instructor.avatar": "",
    };
  }

  const form = emptyFormValues();
  const raw = record as Record<string, unknown>;

  COURSE_FORM_FIELDS.forEach((field) => {
    if (!field.key.includes(".")) {
      const top = raw[field.key];
      if (top !== undefined && top !== null) form[field.key] = top;
      return;
    }
    const keys = field.key.split(".");
    let value: unknown = raw;
    for (const k of keys) {
      if (value && typeof value === "object") value = (value as Record<string, unknown>)[k];
      else {
        value = undefined;
        break;
      }
    }
    if (value !== undefined && value !== null) form[field.key] = value;
  });

  if (record.thumbnail) form.thumbnail = record.thumbnail;

  const fieldId = getFieldId(record);
  if (fieldId) form.fieldId = fieldId;

  const instructorId = String(record.instructor?.instructorId ?? "").trim();
  if (instructorId) form["instructor.instructorId"] = instructorId;
  if (record.instructor?.name) form["instructor.name"] = record.instructor.name;
  if (record.instructor?.role) form["instructor.role"] = record.instructor.role;
  if (record.instructor?.bio) form["instructor.bio"] = record.instructor.bio;
  if (record.instructor?.avatar) form["instructor.avatar"] = record.instructor.avatar;

  if (record.overview?.outcomes?.length) {
    form["overview.outcomes"] = record.overview.outcomes.join(", ");
  }

  form.status = record.status !== false;
  return form;
}

function validateFields(form: Record<string, unknown>, fields: FormField[]): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((field) => {
    if (!field.required) return;
    const val = form[field.key];
    if (val === undefined || val === null || String(val).trim() === "") {
      errors[field.key] = `${field.label} is required`;
    }
  });
  return errors;
}

function coerceFieldValue(field: FormField, raw: unknown): unknown {
  if (field.type === "boolean") return raw === true || raw === "true";
  if (field.type === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  return String(raw ?? "").trim();
}

function setNested(obj: Record<string, unknown>, key: string, value: unknown) {
  const parts = key.split(".");
  let cur: Record<string, unknown> = obj;
  parts.forEach((part, i) => {
    if (i === parts.length - 1) cur[part] = value;
    else {
      if (!cur[part] || typeof cur[part] !== "object") cur[part] = {};
      cur = cur[part] as Record<string, unknown>;
    }
  });
}

export function buildCoursePayload(
  form: Record<string, unknown>,
  editing: boolean
): { payload: Record<string, unknown> | null; errors: Record<string, string> } {
  const errors = validateFields(form, COURSE_FORM_FIELDS.filter((f) => f.key === "title"));
  const fieldId = String(form.fieldId ?? "").trim();
  if (!fieldId && !editing) errors.fieldId = "Field is required";
  if (Object.keys(errors).length) return { payload: null, errors };

  const payload: Record<string, unknown> = {};
  COURSE_FORM_FIELDS.forEach((field) => {
    if (field.key === "title" && !String(form.title ?? "").trim()) return;
    const val = coerceFieldValue(field, form[field.key]);
    if (field.key.includes(".")) setNested(payload, field.key, val);
    else payload[field.key] = val;
  });

  payload.fieldId = fieldId;
  payload.title = String(form.title ?? "").trim();

  const outcomes = parseOutcomes(form["overview.outcomes"]);
  payload.overview = {
    headline: String(form["overview.headline"] ?? "").trim() || "Build smarter, not harder",
    description: String(form["overview.description"] ?? "").trim() || String(payload.description ?? ""),
    outcomes,
  };

  payload.details = {
    skillLevel: String(payload.level ?? "Beginner"),
    language: String(payload.language ?? "Somali"),
    durationHours: Number(payload.durationHours ?? 0),
    lessonCount: Number(payload.lessonCount ?? 0),
    certificate: form.certificate !== false,
    access: String(payload.access ?? "1 Year"),
  };

  const instructor = {
    instructorId: String(form["instructor.instructorId"] ?? "").trim() || null,
    name: String(form["instructor.name"] ?? ""),
    role: String(form["instructor.role"] ?? "Practitioner-instructor"),
    bio: String(form["instructor.bio"] ?? ""),
    avatar: String(form["instructor.avatar"] ?? ""),
  };
  payload.instructor = instructor;
  if (instructor.name) payload.instructorName = instructor.name;
  if (instructor.instructorId) payload.instructorId = instructor.instructorId;

  if (!editing) {
    payload.isPublished = form.isPublished !== false;
    payload.isVisible = form.isVisible !== false;
  }

  delete payload.status;
  delete payload.badges;
  delete payload.ctaButton;
  delete payload.wishlistButton;

  return { payload, errors: {} };
}
