"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { FormField } from "@/lib/instructor/course-types";
import { CourseFormFields } from "@/components/instructor/course-form-fields";

type Props = {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  form: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
  defaultOpen?: boolean;
  children?: ReactNode;
};

export function CollapsiblePanel({
  id,
  title,
  description,
  fields,
  form,
  errors,
  onChange,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const errorCount = useMemo(
    () => fields.filter((f) => errors[f.key]).length,
    [fields, errors]
  );

  useEffect(() => {
    if (errorCount > 0) setOpen(true);
  }, [errorCount]);

  if (!fields.length && !children) return null;

  return (
    <div
      className={`rounded-xl border ${
        errorCount ? "border-red-400/50" : "border-[#1f2a4a]"
      } bg-[#0f1631]`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-white/5"
      >
        {open ? <ChevronDown className="h-4 w-4 text-ink-3" /> : <ChevronRight className="h-4 w-4 text-ink-3" />}
        <span className="text-sm font-semibold text-navy">{title}</span>
        {errorCount > 0 && (
          <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300">
            {errorCount} error{errorCount > 1 ? "s" : ""}
          </span>
        )}
      </button>
      {open && (
        <div className="border-t border-[#1f2a4a] px-4 pb-4 pt-3">
          {description && <p className="mb-3 text-xs text-ink-3">{description}</p>}
          {children}
          {fields.length > 0 && (
            <CourseFormFields fields={fields} form={form} errors={errors} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  );
}
