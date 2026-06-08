import { toast } from "@/lib/utils/toast";

export type FormFieldLike = { key: string; label: string };

export type ValidationErrorItem = {
  key: string;
  label: string;
  message: string;
};

export function orderedValidationErrors(
  errors: Record<string, string>,
  fields: FormFieldLike[]
): ValidationErrorItem[] {
  const ordered: ValidationErrorItem[] = [];
  const seen = new Set<string>();

  for (const field of fields) {
    const message = errors[field.key];
    if (!message) continue;
    ordered.push({
      key: field.key,
      label: field.label,
      message,
    });
    seen.add(field.key);
  }

  for (const [key, message] of Object.entries(errors)) {
    if (seen.has(key)) continue;
    const field = fields.find((f) => f.key === key);
    ordered.push({
      key,
      label: field?.label ?? key,
      message,
    });
  }

  return ordered;
}

export function applyFormValidationFeedback(
  errors: Record<string, string>,
  fields: FormFieldLike[]
) {
  const items = orderedValidationErrors(errors, fields);
  if (!items.length) return false;

  toast.validationErrors(items);
  return true;
}
