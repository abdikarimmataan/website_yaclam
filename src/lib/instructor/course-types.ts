export type CourseLesson = {
  id?: string;
  title?: string;
  duration?: string;
  free?: boolean;
  videoUrl?: string;
  vimeoId?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type CourseModule = {
  title?: string;
  sortOrder?: number;
  isVisible?: boolean;
  lessons?: CourseLesson[];
};

export type CourseResource = {
  id?: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export type CourseResourceFormRow = CourseResource & {
  pendingFile?: File | null;
};

export type FormFieldOption = { value: string; label: string };

export type FormField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "select" | "stringList";
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
};
