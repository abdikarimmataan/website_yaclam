import type { CourseLesson, CourseModule } from "@/lib/instructor/course-types";
import { resolveLessonType } from "@/lib/lesson-media";

function lessonLabel(lesson: CourseLesson, fallback: string) {
  return String(lesson.title ?? "").trim() || fallback;
}

export function describeLessonTypeSwitch(args: {
  lessonTitle: string;
  fromType: "video" | "link";
  toType: "video" | "link";
  videoUrl?: string;
  linkUrl?: string;
  pendingVideoName?: string;
}): string {
  const { lessonTitle, fromType, toType, videoUrl, linkUrl, pendingVideoName } = args;
  const lines = [
    `Lesson: ${lessonTitle}`,
    `Change: ${fromType === "video" ? "Uploaded video" : "Video link"} -> ${toType === "video" ? "Uploaded video" : "Video link"}`,
    "",
  ];

  if (toType === "link") {
    if (pendingVideoName) lines.push(`Will remove new video file "${pendingVideoName}" (not saved yet).`);
    if (videoUrl) {
      lines.push(`Will remove uploaded video: ${videoUrl.split("/").pop()}`);
      lines.push("The uploaded MP4 will be deleted from the server when you save.");
    }
    lines.push("Students will watch the external video link after save.");
  } else {
    if (linkUrl) lines.push(`Will remove video link: ${linkUrl}`);
    lines.push("You will need to upload an MP4 for this lesson.");
  }

  return lines.join("\n");
}

export function collectCurriculumSaveImpacts(initial: CourseModule[], current: CourseModule[]): string[] {
  const initialRows = new Map<string, { lessonType: "video" | "link"; videoUrl: string; linkUrl: string; title: string }>();

  initial.forEach((mod, mi) => {
    (mod.lessons ?? []).forEach((lesson, li) => {
      const id = String(lesson.id ?? `${mi}-${li}`);
      initialRows.set(id, {
        title: lessonLabel(lesson, `Lesson ${li + 1}`),
        lessonType: resolveLessonType(lesson),
        videoUrl: String(lesson.videoUrl ?? "").trim(),
        linkUrl: String(lesson.linkUrl ?? "").trim(),
      });
    });
  });

  const impacts: string[] = [];
  current.forEach((mod, mi) => {
    (mod.lessons ?? []).forEach((lesson, li) => {
      const id = String(lesson.id ?? `${mi}-${li}`);
      const before = initialRows.get(id);
      if (!before) return;

      const lessonType = resolveLessonType(lesson);
      const videoUrl = String(lesson.videoUrl ?? "").trim();
      const linkUrl = String(lesson.linkUrl ?? "").trim();
      const typeChanged = before.lessonType !== lessonType;
      const videoRemoved = Boolean(before.videoUrl) && !videoUrl && lessonType === "link";
      const linkRemoved = Boolean(before.linkUrl) && !linkUrl && lessonType === "video";
      if (!typeChanged && !videoRemoved && !linkRemoved) return;

      const parts = [lessonLabel(lesson, before.title)];
      if (typeChanged) {
        parts.push(
          `${before.lessonType === "video" ? "uploaded video" : "video link"} -> ${lessonType === "video" ? "uploaded video" : "video link"}`
        );
      }
      if (videoRemoved) parts.push(`removes uploaded video ${before.videoUrl.split("/").pop()}`);
      if (linkRemoved) parts.push(`removes link ${before.linkUrl}`);
      if (lessonType === "link" && linkUrl) parts.push(`new link: ${linkUrl}`);
      impacts.push(parts.join(" — "));
    });
  });

  return impacts;
}
