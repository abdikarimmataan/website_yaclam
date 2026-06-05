const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseMonthToken(token: string): number | null {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && asNumber >= 1 && asNumber <= 12) {
    return asNumber;
  }

  const short = trimmed.toLowerCase().slice(0, 3);
  const index = MONTH_SHORT.findIndex((label) => label.toLowerCase() === short);
  return index >= 0 ? index + 1 : null;
}

/** Format stored date (e.g. 2026/12/30) as "Dec 30, 2026". */
export function formatTimeToJobReady(value?: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  const match = trimmed.match(/^(\d{4})[/-]([^/]+)[/-](\d{1,2})$/);
  if (!match) return trimmed;

  const year = Number(match[1]);
  const month = parseMonthToken(match[2]);
  const day = Number(match[3]);
  if (!month || !Number.isFinite(day)) return trimmed;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return trimmed;
  }

  return `${MONTH_SHORT[month - 1]} ${day}, ${year}`;
}

export function roadmapTimelineLabel(record: {
  timeToJobReady?: string;
  timeToJobReadyDisplay?: string;
  months?: number;
}): string {
  const fromDate =
    formatTimeToJobReady(record.timeToJobReady) ||
    formatTimeToJobReady(record.timeToJobReadyDisplay) ||
    "";
  if (fromDate) return fromDate;

  const months = Number(record.months);
  if (Number.isFinite(months) && months > 0) return `${months} months`;

  return "—";
}
