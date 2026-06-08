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

const BUTTON_STYLE_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "outline", label: "Outline" },
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
  { key: "price", label: "Price", type: "number", placeholder: "49" },
  { key: "originalPrice", label: "Original Price", type: "number", placeholder: "99" },
  { key: "isFree", label: "Free", type: "boolean" },
  { key: "isFeatured", label: "Featured", type: "boolean" },
  { key: "durationHours", label: "Duration Hours", type: "number", placeholder: "12" },
  { key: "lessonCount", label: "Lesson Count", type: "number", placeholder: "24" },
  { key: "rating", label: "Rating", type: "number", placeholder: "4.8" },
  { key: "reviewCount", label: "Review Count", type: "number", placeholder: "128" },
  { key: "studentCount", label: "Student Count", type: "number", placeholder: "1500" },
  { key: "sortOrder", label: "Sort Order", type: "number", placeholder: "1" },
  { key: "badges.premium.text", label: "Premium Badge Text", type: "text" },
  { key: "badges.premium.isVisible", label: "Premium Badge Visible", type: "boolean" },
  { key: "badges.free.text", label: "Free Badge Text", type: "text" },
  { key: "badges.free.isVisible", label: "Free Badge Visible", type: "boolean" },
  { key: "ctaButton.label", label: "CTA Button Label", type: "text" },
  { key: "ctaButton.url", label: "CTA Button URL", type: "text" },
  { key: "ctaButton.style", label: "CTA Button Style", type: "select", options: BUTTON_STYLE_OPTIONS },
  { key: "ctaButton.isVisible", label: "CTA Button Visible", type: "boolean" },
  { key: "wishlistButton.isVisible", label: "Wishlist Visible", type: "boolean" },
  { key: "isPublished", label: "Published", type: "boolean" },
  { key: "isVisible", label: "Visible", type: "boolean" },
  { key: "status", label: "Status", type: "boolean" },
];

export const COURSE_FORM_PANELS: CourseFormPanel[] = [
  {
    id: "basic",
    title: "Basic information",
    description: "Title and descriptions",
    fieldKeys: ["title", "shortDescription", "description", "level", "language", "duration", "color", "badge", "certificate", "access"],
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
  {
    id: "stats",
    title: "Course stats",
    fieldKeys: ["durationHours", "lessonCount", "rating", "reviewCount", "studentCount", "sortOrder"],
  },
  {
    id: "badges",
    title: "Badges & buttons",
    fieldKeys: [
      "badges.premium.text",
      "badges.premium.isVisible",
      "badges.free.text",
      "badges.free.isVisible",
      "ctaButton.label",
      "ctaButton.url",
      "ctaButton.style",
      "ctaButton.isVisible",
      "wishlistButton.isVisible",
    ],
  },
  {
    id: "settings",
    title: "Publish settings",
    fieldKeys: ["isPublished", "isVisible", "status"],
  },
];

const fieldMap = new Map(COURSE_FORM_FIELDS.map((f) => [f.key, f]));

export function getCoursePanelFields(panel: CourseFormPanel): FormField[] {
  return panel.fieldKeys.map((key) => fieldMap.get(key)).filter((f): f is FormField => Boolean(f));
}
