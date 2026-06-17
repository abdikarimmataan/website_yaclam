import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function formatStudents(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

/** Format course price for display (supports decimals like 0.10). */
export function formatCoursePrice(price: number) {
  const n = Number(price);
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

/** Format total curriculum video hours for cards and detail UI. */
export function formatCourseHours(hours: number) {
  const n = Number(hours);
  if (!Number.isFinite(n) || n <= 0) return "0h";
  if (n < 1) {
    const minutes = Math.max(1, Math.round(n * 60));
    return `${minutes}m`;
  }
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded}h`;
}

/** Format total curriculum video hours with "hours" label for detail pages. */
export function formatCourseHoursLabel(hours: number) {
  const n = Number(hours);
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n < 1) {
    const minutes = Math.max(1, Math.round(n * 60));
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  const rounded = Math.round(n * 10) / 10;
  const value = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${value} hour${rounded === 1 ? "" : "s"}`;
}

/** First paragraph from multi-line text (overview, description, etc.). */
export function firstParagraph(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.split(/\r?\n\s*\r?\n/)[0]?.trim() || trimmed.split(/\r?\n/)[0]?.trim() || trimmed;
}
