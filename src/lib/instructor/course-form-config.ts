import type { FormField } from "@/lib/instructor/course-types";

export type CourseFormPanel = {
  id: string;
  title: string;
  description?: string;
  fieldKeys: string[];
};

const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const LANGUAGE_OPTIONS = [
  { value: "Somali", label: "Somali" },
  { value: "English", label: "English" },
  { value: "Arabic", label: "Arabic" },
];

const ACCESS_OPTIONS = [
  { value: "1 Year", label: "1 Year" },
  { value: "Lifetime", label: "Lifetime" },
  { value: "6 Months", label: "6 Months" },
];

export const COURSE_FORM_FIELDS: FormField[] = [
  { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Introduction to Web Development" },
  { key: "shortDescription", label: "Short Description", type: "textarea", placeholder: "Brief summary for course cards" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Full course description" },
  { key: "level", label: "Level", type: "select", options: LEVEL_OPTIONS },
  { key: "language", label: "Language", type: "select", options: LANGUAGE_OPTIONS },
  { key: "duration", label: "Duration", type: "text", placeholder: "e.g. 8 weeks" },
  { key: "color", label: "Color", type: "text", placeholder: "e.g. #1F3A93" },
  { key: "badge", label: "Badge", type: "text", placeholder: "e.g. Bestseller" },
  { key: "certificate", label: "Certificate", type: "boolean" },
  { key: "access", label: "Access", type: "select", options: ACCESS_OPTIONS },
  { key: "overview.headline", label: "Overview Headline", type: "text", placeholder: "e.g. Build smarter, not harder" },
  { key: "overview.description", label: "Overview Description", type: "textarea" },
  { key: "overview.outcomes", label: "Learning Outcomes (comma separated)", type: "stringList", placeholder: "Outcome 1, Outcome 2" },
  { key: "price", label: "Price", type: "number", decimals: 2, placeholder: "0.10" },
  { key: "originalPrice", label: "Original Price", type: "number", decimals: 2, placeholder: "99.00" },
  { key: "isFree", label: "Free", type: "boolean" },
  { key: "isFeatured", label: "Featured", type: "boolean" },
];

export const COURSE_FORM_PANELS: CourseFormPanel[] = [
  {
    id: "basic",
    title: "Basic information",
    description: "Title and descriptions",
    fieldKeys: [
      "title",
      "shortDescription",
      "description",
      "level",
      "language",
      "duration",
      "color",
      "badge",
      "certificate",
      "access",
    ],
  },
  {
    id: "overview",
    title: "Overview",
    description: "Course overview shown on the detail page",
    fieldKeys: ["overview.headline", "overview.description", "overview.outcomes"],
  },
  { id: "instructor", title: "Instructor", fieldKeys: [] },
  {
    id: "pricing",
    title: "Pricing",
    fieldKeys: ["price", "originalPrice", "isFree", "isFeatured"],
  },
];

const fieldMap = new Map(COURSE_FORM_FIELDS.map((f) => [f.key, f]));

export function getCoursePanelFields(panel: CourseFormPanel): FormField[] {
  return panel.fieldKeys.map((key) => fieldMap.get(key)).filter((f): f is FormField => Boolean(f));
}
