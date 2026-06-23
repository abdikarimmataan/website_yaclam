export type LessonType = "video" | "link";

export function resolveLessonType(
  lesson: { lessonType?: string; linkUrl?: string; videoUrl?: string } | null | undefined
): LessonType {
  if (lesson?.lessonType === "link") return "link";
  if (lesson?.lessonType === "video") return "video";

  const linkUrl = String(lesson?.linkUrl ?? "").trim();
  const videoUrl = String(lesson?.videoUrl ?? "").trim();
  if (linkUrl && !videoUrl) return "link";
  return "video";
}

export type LessonPlayback =
  | { mode: "link"; url: string }
  | { mode: "vimeo"; vimeoId: string }
  | { mode: "upload"; url: string }
  | { mode: "none" };

export function resolveLessonPlayback(
  lesson: { lessonType?: string; linkUrl?: string; videoUrl?: string; vimeoId?: string } | null | undefined,
  videoSrc?: string | null
): LessonPlayback {
  const linkUrl = String(lesson?.linkUrl ?? "").trim();
  const vimeoId = String(lesson?.vimeoId ?? "").trim();
  const type = resolveLessonType(lesson);

  if (type === "link" && linkUrl) return { mode: "link", url: linkUrl };
  if (vimeoId) return { mode: "vimeo", vimeoId };
  if (videoSrc) return { mode: "upload", url: videoSrc };
  if (linkUrl) return { mode: "link", url: linkUrl };
  return { mode: "none" };
}

export function isValidExternalLessonUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      const embedMatch = parsed.pathname.match(/^\/embed\/([^/?#]+)/);
      if (embedMatch) return embedMatch[1];
      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shortsMatch) return shortsMatch[1];
    }
  } catch {
    return null;
  }
  return null;
}

export function parseVimeoVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
    const match = parsed.pathname.match(/\/(\d+)(?:\/|$)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function externalLessonEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeId = parseYouTubeVideoId(trimmed);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
  }

  const vimeoId = parseVimeoVideoId(trimmed);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`;
  }

  if (isValidExternalLessonUrl(trimmed)) return trimmed;
  return null;
}
