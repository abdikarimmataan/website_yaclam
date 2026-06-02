import { Search } from "lucide-react";

const students = [
  { name: "Hodan Abdi", course: "Power BI Mastery", progress: 78, joined: "May 2026", initials: "HA" },
  { name: "Yuusuf Maxamed", course: "Forex Foundations", progress: 42, joined: "May 2026", initials: "YM" },
  { name: "Sahra Ibrahim", course: "AI & Prompt Engineering", progress: 91, joined: "Apr 2026", initials: "SI" },
  { name: "Cabdullahi Kahin", course: "Power BI Mastery", progress: 15, joined: "Apr 2026", initials: "CK" },
  { name: "Ifrah Omar", course: "SQL for Analysts", progress: 63, joined: "Mar 2026", initials: "IO" },
];

export default function InstructorStudents() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Students</h1>
      <p className="mb-6 text-ink-3">Everyone enrolled across your courses.</p>
      <div className="mb-5 flex max-w-sm items-center gap-2.5 rounded-xl border border-line bg-white px-4">
        <Search size={18} className="text-ink-3" />
        <input placeholder="Search students…" className="flex-1 bg-transparent py-3 text-[14px] outline-none" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[2fr_2fr_1.4fr_1fr] gap-3 border-b border-line bg-surface px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-ink-3 md:grid">
          <span>Student</span><span>Course</span><span>Progress</span><span>Joined</span>
        </div>
        {students.map((s) => (
          <div key={s.name} className="grid grid-cols-1 gap-2 border-b border-surface-2 px-5 py-4 last:border-b-0 md:grid-cols-[2fr_2fr_1.4fr_1fr] md:items-center md:gap-3">
            <span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[12px] font-bold text-gold">{s.initials}</span><span className="font-semibold text-navy">{s.name}</span></span>
            <span className="text-[14px] text-ink-2">{s.course}</span>
            <span className="flex items-center gap-2"><span className="h-2 w-24 overflow-hidden rounded-md bg-surface-2"><span className="block h-full rounded-md bg-gradient-to-r from-royal to-gold" style={{ width: `${s.progress}%` }} /></span><span className="text-[12px] font-bold text-royal">{s.progress}%</span></span>
            <span className="text-[13px] text-ink-3">{s.joined}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
