"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Play, CheckCircle2, Lock, Circle,
  Star, Send, MessageSquare, FileText,
} from "lucide-react";
import type { Course, Module } from "@/lib/types";
import { VimeoPlayer } from "@/components/shared/vimeo-player";
import { cn } from "@/lib/utils";

type FlatLesson = Module["lessons"][number] & { moduleIndex: number };

const seedComments = [
  { name: "Faadumo A.", date: "3 days ago", text: "Casharkan aad buu u fiicnaa! Tusaalaha mashruuca ayaa wax walba caddeeyay.", initials: "FA", likes: 12 },
  { name: "Yuusuf M.", date: "1 week ago", text: "Quick question — can we get the source files for this lesson? Great explanation overall.", initials: "YM", likes: 4 },
];

export function CoursePlayer({ course, modules }: { course: Course; modules: Module[] }) {
  const flat: FlatLesson[] = modules.flatMap((m, mi) => m.lessons.map((l) => ({ ...l, moduleIndex: mi })));
  const [activeId, setActiveId] = useState(flat[0]?.id);
  const [openModule, setOpenModule] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"overview" | "resources" | "comments">("overview");

  const active = flat.find((l) => l.id === activeId) ?? flat[0];
  const activeIndex = flat.findIndex((l) => l.id === active.id);
  const progress = Math.round((completed.size / flat.length) * 100);

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

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1fr_360px]">
      {/* MAIN: video + details + comments */}
      <main className="order-2 lg:order-1">
        <div className="bg-navy-deep px-4 py-4 sm:px-8 sm:py-6">
          <VimeoPlayer vimeoId={active.vimeoId ?? ""} title={active.title} />
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
                <h3 className="mb-2 text-[18px] font-bold text-navy">About this lesson</h3>
                <p className="text-[15.5px] leading-[1.8] text-ink-2">
                  In this lesson we cover <b>{active.title.toLowerCase()}</b> with a hands-on, practical approach.
                  Follow along, pause where you need to, and rewatch any section. Everything is explained in Somali
                  with the English technical terms you&apos;ll see on the job.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {["Practical, project-based teaching", "Somali narration, English terms", "Lifetime access & rewatch", "Downloadable resources"].map((x) => (
                    <div key={x} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink-2"><CheckCircle2 size={17} className="shrink-0 text-success" /> {x}</div>
                  ))}
                </div>
              </div>
            )}

            {tab === "resources" && (
              <div className="max-w-2xl">
                <h3 className="mb-3 text-[18px] font-bold text-navy">Lesson resources</h3>
                <div className="flex flex-col gap-2.5">
                  {["Lesson slides (PDF)", "Starter project files (ZIP)", "Exercise solutions"].map((r) => (
                    <a key={r} href="#" className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3.5 text-[14.5px] text-ink-2 transition hover:border-royal">
                      <span className="flex items-center gap-2.5"><FileText size={17} className="text-royal" /> {r}</span>
                      <span className="text-[13px] font-semibold text-royal">Download</span>
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-ink-3">Resource files wire to Cloudflare R2 / your storage on the backend.</p>
              </div>
            )}

            {tab === "comments" && (
              <div className="max-w-2xl">
                <h3 className="mb-4 flex items-center gap-2 text-[18px] font-bold text-navy"><MessageSquare size={19} /> Discussion ({seedComments.length})</h3>
                <div className="mb-6 rounded-2xl border border-line bg-surface p-4">
                  <textarea rows={3} placeholder="Ask a question or share your thoughts…" className="field-input resize-none bg-white" />
                  <div className="mt-3 flex justify-end"><button className="btn btn-navy btn-sm">Post comment <Send size={14} /></button></div>
                </div>
                <div className="flex flex-col gap-4">
                  {seedComments.map((c) => (
                    <div key={c.name} className="rounded-2xl border border-line bg-white p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[13px] font-bold text-gold">{c.initials}</div>
                        <div><div className="text-[14px] font-bold text-navy">{c.name}</div><div className="text-[12px] text-ink-3">{c.date}</div></div>
                      </div>
                      <p className="text-[14.5px] text-ink-2">{c.text}</p>
                      <div className="mt-2.5 flex gap-4 text-[13px] text-ink-3">
                        <button className="flex items-center gap-1.5 hover:text-royal"><Star size={14} /> {c.likes}</button>
                        <button className="hover:text-royal">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-ink-3">Comments/reviews wire to your backend (PostgreSQL).</p>
              </div>
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
                    return (
                      <button
                        key={l.id}
                        onClick={() => setActiveId(l.id)}
                        className={cn("flex w-full items-start gap-3 px-5 py-2.5 text-left transition", isActive ? "bg-surface-2" : "hover:bg-surface")}
                      >
                        <span className="mt-0.5 shrink-0">
                          {done ? <CheckCircle2 size={17} className="text-success" /> : isActive ? <Play size={16} className="text-royal" /> : l.free ? <Circle size={16} className="text-ink-3" /> : <Lock size={14} className="text-ink-3" />}
                        </span>
                        <span className="flex-1">
                          <span className={cn("block text-[13.5px] leading-snug", isActive ? "font-semibold text-navy" : "text-ink-2")}>{l.title}</span>
                          <span className="text-[12px] text-ink-3">{l.duration}</span>
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
