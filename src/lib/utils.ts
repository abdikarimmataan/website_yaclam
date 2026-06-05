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

/** First paragraph from multi-line text (overview, description, etc.). */
export function firstParagraph(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.split(/\r?\n\s*\r?\n/)[0]?.trim() || trimmed.split(/\r?\n/)[0]?.trim() || trimmed;
}
