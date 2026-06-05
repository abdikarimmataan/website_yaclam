const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Format ISO dates as "Dec 30, 2026"; pass through human-readable strings. */
export function formatDisplayDate(value?: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const month = parsed.getUTCMonth();
    const day = parsed.getUTCDate();
    const year = parsed.getUTCFullYear();
    if (month >= 0 && month < 12 && day >= 1) {
      return `${MONTH_SHORT[month]} ${day}, ${year}`;
    }
  }

  return trimmed;
}
