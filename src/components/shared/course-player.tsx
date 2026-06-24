"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Play, CheckCircle2, Lock, Circle, Link2,
  FileText,
} from "lucide-react";
import type { Course, CourseResource, Module } from "@/lib/types";
import { ExternalVideoPlayer } from "@/components/shared/external-video-player";
import { VimeoPlayer } from "@/components/shared/vimeo-player";
import { uploadUrl } from "@/lib/api/cms";
import { resolveLessonType } from "@/lib/lesson-media";
import { CourseLearnDiscussion } from "@/components/courses/course-learn-discussion";
import { cn } from "@/lib/utils";

type FlatLesson = Module["lessons"][number] & { moduleIndex: number };

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CoursePlayer({
  course,
  modules,
  resources = [],
}: {
  course: Course;
  modules: Module[];
  resources?: CourseResource[];
}) {
  const flat: FlatLesson[] = modules.flatMap((m, mi) => m.lessons.map((l) => ({ ...l, moduleIndex: mi })));
  const [activeId, setActiveId] = useState(flat[0]?.id);
  const [openModule, setOpenModule] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"overview" | "resources" | "comments">("overview");
  const [videoFailed, setVideoFailed] = useState(false);

  const active = flat.find((l) => l.id === activeId) ?? flat[0];
  const activeIndex = active ? flat.findIndex((l) => l.id === active.id) : -1;
  const progress = flat.length > 0 ? Math.round((completed.size / flat.length) * 100) : 0;
  const vimeoId = String(active?.vimeoId ?? "").trim();
  const videoSrc = uploadUrl(active?.videoUrl);
  const isLinkLesson = active ? resolveLessonType(active) === "link" : false;
  const linkUrl = String(active?.linkUrl ?? "").trim();

  useEffect(() => {
    setVideoFailed(false);
  }, [active?.id, vimeoId, videoSrc]);

  const markDone = (id: string) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const go = (dir: 1 | -1) => {
    const ni = activeIndex + dir;
    if (ni >= 0 && ni < flat.length) {
      setActiveId(flat[ni].id);
      setOpenModule(flat[ni].moduleIndex);
    }
  };

  if (!active) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-navy">{course.title}</h1>
        <p className="mt-3 max-w-md text-[15px] text-ink-3">
          This course does not have any lessons published yet. Please check back later or contact the instructor.
        </p>
        <Link href={`/courses/${course.slug}`} className="btn btn-outline mt-8">
          Back to course
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1fr_360px]">
      {/* MAIN: video + details + comments */}
      <main className="order-2 lg:order-1">
        <div className="bg-navy-deep px-4 py-4 sm:px-8 sm:py-6">
          {isLinkLesson && linkUrl ? (
            <ExternalVideoPlayer url={linkUrl} title={active.title} />
          ) : vimeoId ? (
            <VimeoPlayer vimeoId={vimeoId} title={active.title} />
          ) : videoSrc && !videoFailed ? (
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              <video
                key={active.id}
                src={videoSrc}
                controls
                playsInline
                className="absolute inset-0 h-full w-full bg-black"
                style={{ objectFit: "contain" }}
                onError={() => setVideoFailed(true)}
              />
            </div>
          ) : (
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-white/90">
                <span className="text-[14px] font-semibold">
                  {videoSrc ? "Lesson video failed to load" : "Lesson video not available"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="container max-w-none px-4 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-bold text-navy sm:text-[26px]">{active.title}</h1>
              <p className="mt-1 text-[14px] text-ink-3">{course.title} · Lesson {activeIndex + 1} of {flat.length}</p>
            </div>
            <button
              onClick={() => markDone(active.id)}
              className={cn("btn btn-sm", completed.has(active.id) ? "btn-navy" : "btn-outline")}
            >
              <CheckCircle2 size={16} /> {completed.has(active.id) ? "Completed" : "Mark complete"}
            </button>
          </div>

          {/* nav buttons */}
          <div className="mt-4 flex gap-3">
            <button onClick={() => go(-1)} disabled={activeIndex === 0} className="btn btn-outline btn-sm disabled:opacity-40"><ChevronLeft size={16} /> Previous</button>
            <button onClick={() => go(1)} disabled={activeIndex === flat.length - 1} className="btn btn-gold btn-sm disabled:opacity-40">Next lesson <Play size={15} /></button>
          </div>

          {/* tabs */}
          <div className="mt-7 flex gap-1 border-b border-line">
            {([["overview", "Overview"], ["resources", "Resources"], ["comments", "Comments"]] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "relative px-4 py-3 text-[14.5px] font-semibold transition",
                  tab === id ? "text-navy after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded after:bg-gold" : "text-ink-3 hover:text-navy"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {tab === "overview" && (
              <div className="max-w-2xl">
                <h3 className="mb-2 text-[18px] font-bold text-navy">
                  {course.overviewHeadline?.trim() || "About this course"}
                </h3>
                <p className="text-[15.5px] leading-[1.8] text-ink-2">
                  {course.description?.trim() ||
                    `In this lesson we cover ${active.title.toLowerCase()} with a hands-on, practical approach.`}
                </p>
                {course.outcomes.length > 0 ? (
                  <>
                    <h4 className="mb-3 mt-6 text-[16px] font-bold text-navy">What you&apos;ll master</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {course.outcomes.map((outcome) => (
                        <div
                          key={outcome}
                          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink-2"
                        >
                          <CheckCircle2 size={17} className="shrink-0 text-success" /> {outcome}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      `Lesson: ${active.title}`,
                      course.language ? `Language: ${course.language}` : "Somali narration, English terms",
                      course.certificate ? "Course certificate included" : "Certificate not included",
                      course.expiry ? `Access: ${course.expiry}` : "Lifetime access & rewatch",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink-2"
                      >
                        <CheckCircle2 size={17} className="shrink-0 text-success" /> {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "resources" && (
              <div className="max-w-2xl">
                <h3 className="mb-3 text-[18px] font-bold text-navy">Course resources</h3>
                {resources.length === 0 ? (
                  <p className="text-[14px] text-ink-3">No downloadable resources have been added yet.</p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {resources.map((resource) => {
                      const href = uploadUrl(resource.fileUrl);
                      const sizeLabel = formatFileSize(resource.fileSize);
                      return (
                        <a
                          key={resource.id}
                          href={href ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-[14.5px] text-ink-2 transition hover:border-royal",
                            !href && "pointer-events-none opacity-60"
                          )}
                        >
                          <span className="min-w-0">
                            <span className="flex items-center gap-2.5">
                              <FileText size={17} className="shrink-0 text-royal" />
                              <span className="font-medium text-navy">{resource.title}</span>
                            </span>
                            {resource.description ? (
                              <span className="mt-1 block pl-[27px] text-[13px] text-ink-3">
                                {resource.description}
                              </span>
                            ) : null}
                          </span>
                          <span className="shrink-0 text-right text-[13px] font-semibold text-royal">
                            {sizeLabel ? `${sizeLabel} · ` : ""}Download
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === "comments" && (
              <CourseLearnDiscussion courseId={String(course.id)} lessonId={active.id} />
            )}
          </div>
        </div>
      </main>

      {/* SIDEBAR: course content / lessons list */}
      <aside className="order-1 border-b border-line bg-white lg:order-2 lg:border-b-0 lg:border-l">
        <div className="border-b border-line p-5">
          <Link href={`/courses/${course.slug}`} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-3 hover:text-royal"><ChevronLeft size={15} /> Back to course</Link>
          <h2 className="font-sans text-[16px] font-bold text-navy">Course content</h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-md bg-surface-2"><div className="h-full rounded-md bg-gradient-to-r from-royal to-gold transition-all" style={{ width: `${progress}%` }} /></div>
            <span className="text-[13px] font-bold text-royal">{progress}%</span>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {modules.map((m, mi) => (
            <div key={m.title} className="border-b border-surface-2">
              <button onClick={() => setOpenModule(openModule === mi ? -1 : mi)} className="flex w-full items-center justify-between gap-2 px-5 py-3.5 text-left">
                <span className="text-[14px] font-bold text-navy">{m.title}</span>
                <ChevronDown size={17} className={cn("shrink-0 text-ink-3 transition-transform", openModule === mi && "rotate-180")} />
              </button>
              {openModule === mi && (
                <div className="pb-2">
                  {m.lessons.map((l) => {
                    const isActive = l.id === active.id;
                    const done = completed.has(l.id);
                    const isLink = resolveLessonType(l) === "link";
                    return (
                      <button
                        key={l.id}
                        onClick={() => setActiveId(l.id)}
                        className={cn("flex w-full items-start gap-3 px-5 py-2.5 text-left transition", isActive ? "bg-surface-2" : "hover:bg-surface")}
                      >
                        <span className="mt-0.5 shrink-0">
                          {done ? (
                            <CheckCircle2 size={17} className="text-success" />
                          ) : isActive ? (
                            isLink ? (
                              <Link2 size={16} className="text-royal" />
                            ) : (
                              <Play size={16} className="text-royal" />
                            )
                          ) : l.free ? (
                            <Circle size={16} className="text-ink-3" />
                          ) : (
                            <Lock size={14} className="text-ink-3" />
                          )}
                        </span>
                        <span className="flex-1">
                          <span className={cn("block text-[13.5px] leading-snug", isActive ? "font-semibold text-navy" : "text-ink-2")}>
                            {l.title}
                          </span>
                          <span className="text-[12px] text-ink-3">
                            {isLink ? "Link" : "Video"}
                            {l.duration ? ` · ${l.duration}` : ""}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
