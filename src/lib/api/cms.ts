const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000/api";

function apiOrigin(): string {
  return API_BASE.replace(/\/api\/?$/, "");
}

/** Resolve `/uploads/...` or absolute URLs for media served by the API server. */
export function uploadUrl(path: string | undefined): string | null {
  const trimmed = path?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/uploads/")) return `${apiOrigin()}${trimmed}`;
  return null;
}

/** Normalize legacy `.html` paths from the CMS to Next.js routes. */
export function cmsUrl(url: string | undefined): string {
  if (!url) return "/";
  return url.replace(/\.html$/i, "") || "/";
}

/** Render `**bold**` segments from CMS text as React-friendly parts. */
export function parseBoldSegments(text: string): { text: string; bold: boolean }[] {
  const parts: { text: string; bold: boolean }[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), bold: false });
    parts.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), bold: false });
  if (parts.length === 0) parts.push({ text, bold: false });
  return parts;
}
