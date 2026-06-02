import Link from "next/link";
import { Clock, BookOpen, Users, ChevronRight, Heart } from "lucide-react";
import type { Course } from "@/lib/types";
import { Icon } from "@/lib/icon-map";
import { categoryIcon } from "@/lib/data/categories";
import { Stars } from "./stars";
import { formatStudents } from "@/lib/utils";

export function CourseCard({ c }: { c: Course }) {
  return (
    <article className="card-base">
      <div className="thumb-pat relative grid h-[158px] place-items-center text-white" style={{ background: `linear-gradient(135deg, ${c.color}, #0D1B4B)` }}>
        <div className="relative grid h-[62px] w-[62px] place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <Icon name={categoryIcon(c.category)} size={28} />
        </div>
        {c.badge && (
          <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wide ${c.free ? "bg-success text-white" : "bg-gold text-navy"}`}>{c.badge}</span>
        )}
        <span className="absolute right-3 top-3 grid h-[34px] w-[34px] place-items-center rounded-full bg-white/90 text-ink-2"><Heart size={16} /></span>
      </div>
      <Link href={`/courses/${c.slug}`} className="flex flex-1 flex-col gap-2 p-[18px]">
        <span className="pill">{c.level}</span>
        <h3 className="font-sans text-lg font-bold leading-snug text-navy">{c.title}</h3>
        <div className="text-[13px] text-ink-3">by {c.instructor}</div>
        <div className="flex items-center gap-3.5 text-[12.5px] text-ink-3">
          <Stars rating={c.rating} />
          <span>({c.reviews})</span>
          <span className="inline-flex items-center gap-1.5"><Users size={13} /> {formatStudents(c.students)}</span>
        </div>
        <div className="flex items-center gap-3.5 text-[12.5px] text-ink-3">
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {c.hours}h</span>
          <span className="inline-flex items-center gap-1.5"><BookOpen size={13} /> {c.lessons} lessons</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-surface-2 pt-3.5">
          <span className={`font-display text-[22px] font-semibold ${c.free ? "text-success" : "text-navy"}`}>
            {c.free ? "Free" : `€${c.price}`}
            {!c.free && c.oldPrice && <span className="ml-1.5 text-sm font-medium text-ink-3 line-through">€{c.oldPrice}</span>}
          </span>
          <span className="btn btn-outline btn-sm">{c.free ? "Enroll" : "Details"} <ChevronRight size={15} /></span>
        </div>
      </Link>
    </article>
  );
}
