"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

function apply(mode: Mode) {
  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Mode) || "system";
    setMode(saved);
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem("theme") as Mode) === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const choose = (m: Mode) => {
    setMode(m);
    localStorage.setItem("theme", m);
    apply(m);
  };

  const opts: { id: Mode; icon: typeof Sun; label: string }[] = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ];

  // Avoid hydration mismatch: render a neutral placeholder until mounted.
  if (!mounted) {
    return <div className={cn("h-9 w-[108px] rounded-full border border-line", className)} aria-hidden />;
  }

  return (
    <div
      className={cn("inline-flex items-center gap-0.5 rounded-full border border-line bg-white p-0.5", className)}
      role="radiogroup"
      aria-label="Theme"
    >
      {opts.map((o) => {
        const active = mode === o.id;
        return (
          <button
            key={o.id}
            onClick={() => choose(o.id)}
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full transition",
              active ? "bg-navy text-gold" : "text-ink-3 hover:text-navy"
            )}
          >
            <o.icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
