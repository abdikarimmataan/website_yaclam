"use client";

import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";

const modules = [
  { t: "Getting Started", lessons: ["Welcome & course overview", "Setting up your environment", "How to get the most from this course"] },
  { t: "Core Concepts", lessons: ["Foundations explained simply", "Hands-on walkthrough", "Common mistakes to avoid", "Practice exercise"] },
  { t: "Real-World Project", lessons: ["Project brief", "Building step by step", "Debugging & refining", "Final review"] },
  { t: "Career & Next Steps", lessons: ["Building your portfolio", "Interview preparation", "Certificate & what's next"] },
];

export function Curriculum() {
  const [open, setOpen] = useState(0);
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      {modules.map((m, i) => (
        <div key={i} className="border-b border-surface-2 last:border-b-0">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between bg-surface px-5 py-4 text-left font-semibold text-navy"
          >
            <span>{m.t} · {m.lessons.length} lessons</span>
            <ChevronDown size={18} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-3.5 pt-1.5">
              {m.lessons.map((l) => (
                <div key={l} className="flex items-center gap-2.5 py-2 text-[14px] text-ink-2">
                  <Play size={14} className="text-royal" /> {l}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
