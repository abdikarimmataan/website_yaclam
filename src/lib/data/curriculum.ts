import type { Module } from "@/lib/types";

/*
 * Per-course curriculum with Vimeo-embedded lessons.
 * The Vimeo IDs below are public sample videos used as PLACEHOLDERS so the
 * player works out of the box. BACKEND NOTE: replace `vimeoId` values with the
 * real Bunny Stream / Vimeo IDs for each lesson (the player embeds by ID).
 */

const SAMPLE_VIMEO = ["76979871", "22439234", "1084537", "57266357", "148751763"];

const moduleTemplate: { title: string; lessons: { title: string; duration: string; free?: boolean }[] }[] = [
  {
    title: "Getting Started",
    lessons: [
      { title: "Welcome & how to use this course", duration: "04:12", free: true },
      { title: "Setting up your environment", duration: "08:24", free: true },
      { title: "Course resources & community", duration: "03:50" },
    ],
  },
  {
    title: "Core Concepts",
    lessons: [
      { title: "The fundamentals, explained simply", duration: "12:38" },
      { title: "Hands-on walkthrough", duration: "15:02" },
      { title: "Common mistakes to avoid", duration: "09:47" },
      { title: "Practice exercise", duration: "06:20" },
    ],
  },
  {
    title: "Building a Real Project",
    lessons: [
      { title: "Project brief & planning", duration: "07:15" },
      { title: "Building step by step — part 1", duration: "18:33" },
      { title: "Building step by step — part 2", duration: "16:09" },
      { title: "Debugging & refining", duration: "11:24" },
    ],
  },
  {
    title: "Career & Next Steps",
    lessons: [
      { title: "Building your portfolio", duration: "10:05" },
      { title: "Interview preparation", duration: "13:41" },
      { title: "Your certificate & what's next", duration: "05:28" },
    ],
  },
];

export function getCurriculum(slug: string): Module[] {
  // Deterministic Vimeo assignment so each lesson has a stable id/video.
  let counter = 0;
  return moduleTemplate.map((m, mi) => ({
    title: m.title,
    lessons: m.lessons.map((l, li) => {
      const vimeoId = SAMPLE_VIMEO[counter % SAMPLE_VIMEO.length];
      counter++;
      return {
        id: `${slug}-m${mi + 1}-l${li + 1}`,
        title: l.title,
        duration: l.duration,
        vimeoId,
        free: l.free,
      };
    }),
  }));
}

export const totalLessons = moduleTemplate.reduce((n, m) => n + m.lessons.length, 0);
