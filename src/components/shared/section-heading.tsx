import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow, title, sub, center, dark,
}: { eyebrow: string; title: string; sub?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <span className="eyebrow"><Sparkles size={14} /> {eyebrow}</span>
      <h2 className={cn("mb-3 mt-3.5 text-3xl font-semibold md:text-[2.6rem]", dark ? "text-white" : "text-navy")}>{title}</h2>
      {sub && <p className={cn("text-[17px]", dark ? "text-white/70" : "text-ink-3")}>{sub}</p>}
    </div>
  );
}
