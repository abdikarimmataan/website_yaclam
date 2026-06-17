"use client";

import type { FormField } from "@/lib/instructor/course-types";
import { Select2 } from "@/components/shared/select2";

type Props = {
  fields: FormField[];
  form: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
};

const inputClass =
  "field-input w-full bg-[#0b1126] text-[#e8ecf8] border-[#1f2a4a] focus:border-royal focus:ring-royal/20";

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function CourseFormFields({ fields, form, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const val = form[field.key];
        const error = errors[field.key];

        if (field.type === "boolean") {
          return (
            <label
              key={field.key}
              className="flex items-center gap-2 text-sm font-medium text-ink-2"
            >
              <input
                type="checkbox"
                checked={val === true}
                onChange={(e) => onChange(field.key, e.target.checked)}
                className="h-4 w-4 rounded border-[#1f2a4a]"
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "select" && field.options) {
          return (
            <div key={field.key}>
              <label className="field-label text-ink-2">
                {field.label}
                {field.required && " *"}
              </label>
              <Select2
                options={field.options.map((o) => ({ id: o.value, text: o.label }))}
                value={String(val ?? "")}
                onChange={(v) => onChange(field.key, v)}
                placeholder={field.placeholder ?? `Select ${field.label}`}
                allowClear={false}
                variant="dark"
              />
              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
          );
        }

        if (field.type === "textarea" || field.type === "stringList") {
          return (
            <div key={field.key}>
              <label className="field-label text-ink-2">
                {field.label}
                {field.required && " *"}
              </label>
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={String(val ?? "")}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.type === "stringList" ? 2 : 4}
              />
              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
          );
        }

        const isDecimal = field.type === "number" && field.decimals != null;

        return (
          <div key={field.key}>
            <label className="field-label text-ink-2">
              {field.label}
              {field.required && " *"}
            </label>
            <input
              type={isDecimal ? "text" : field.type === "number" ? "number" : "text"}
              inputMode={isDecimal ? "decimal" : undefined}
              className={inputClass}
              value={val === undefined || val === null ? "" : String(val)}
              onChange={(e) => {
                const raw = e.target.value;
                if (isDecimal) {
                  if (!raw.trim()) {
                    onChange(field.key, "");
                    return;
                  }
                  if (!/^-?\d*\.?\d*$/.test(raw)) return;
                  if (raw.endsWith(".") || raw === "-" || raw === "-.") {
                    onChange(field.key, raw);
                    return;
                  }
                  const n = Number(raw);
                  onChange(field.key, Number.isFinite(n) ? roundMoney(n) : raw);
                  return;
                }
                onChange(field.key, field.type === "number" ? raw : raw);
              }}
              placeholder={field.placeholder}
            />
            {isDecimal && (
              <p className="mt-1 text-xs text-ink-3">Up to {field.decimals} decimal places (e.g. 0.10)</p>
            )}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>
        );
      })}
    </div>
  );
}
