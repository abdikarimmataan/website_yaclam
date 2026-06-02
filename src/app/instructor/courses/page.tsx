import Link from "next/link";
import { Plus, Pencil, Eye, BarChart3 } from "lucide-react";
import { courses } from "@/lib/data/courses";

export default function InstructorCourses() {
  const mine = courses.filter((c) => c.instructor === "Abdikarim Mataan").slice(0, 6);
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-navy">My Courses</h1>
          <p className="text-ink-3">Create, edit and track your published courses.</p>
        </div>
        <button className="btn btn-gold"><Plus size={17} /> New course</button>
      </div>
      <div className="grid gap-4">
        {mine.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4">
            <div className="h-16 w-24 shrink-0 rounded-xl thumb-pat" style={{ background: `linear-gradient(135deg, ${c.color}, #0D1B4B)` }} />
            <div className="min-w-[180px] flex-1">
              <h3 className="font-sans text-[16px] font-bold text-navy">{c.title}</h3>
              <p className="mt-0.5 text-[13px] text-ink-3">{c.students.toLocaleString()} students · {c.rating} rating · {c.free ? "Free" : `$${c.price}`}</p>
            </div>
            <span className="rounded-md bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#047857]">Published</span>
            <div className="flex gap-2">
              <Link href={`/learn/${c.slug}`} className="btn btn-outline btn-sm"><Eye size={14} /></Link>
              <button className="btn btn-outline btn-sm"><BarChart3 size={14} /></button>
              <button className="btn btn-navy btn-sm"><Pencil size={14} /> Edit</button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-line bg-white p-4 text-[13px] text-ink-3">Course create/edit forms &amp; lesson uploads (Vimeo/Bunny Stream) wire to the backend.</p>
    </div>
  );
}
