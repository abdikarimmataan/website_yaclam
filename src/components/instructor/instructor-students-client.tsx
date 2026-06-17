"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getInstructorStudents, type InstructorStudentRow } from "@/lib/api/instructor-stats.service";
import { initialsFromName } from "@/lib/auth/session";
import { uploadUrl } from "@/lib/api/cms";

function formatJoined(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function InstructorStudentsClient() {
  const [students, setStudents] = useState<InstructorStudentRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setStudents(await getInstructorStudents());
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (row) => row.name.toLowerCase().includes(q) || row.course.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Students</h1>
      <p className="mb-6 text-ink-3">Everyone enrolled across your courses.</p>
      <div className="mb-5 flex max-w-sm items-center gap-2.5 rounded-xl border border-line bg-white px-4">
        <Search size={18} className="text-ink-3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students…"
          className="flex-1 bg-transparent py-3 text-[14px] outline-none"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[2fr_2fr_1fr] gap-3 border-b border-line bg-surface px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-ink-3 md:grid">
          <span>Student</span>
          <span>Course</span>
          <span>Joined</span>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-center text-[14px] text-ink-3">Loading students…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-[14px] text-ink-3">No students found.</div>
        ) : (
          filtered.map((s) => {
            const avatar = uploadUrl(s.avatar);
            const initials = initialsFromName(s.name);
            return (
              <div
                key={s.id}
                className="grid grid-cols-1 gap-2 border-b border-surface-2 px-5 py-4 last:border-b-0 md:grid-cols-[2fr_2fr_1fr] md:items-center md:gap-3"
              >
                <span className="flex items-center gap-3">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt={s.name} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[12px] font-bold text-gold">
                      {initials}
                    </span>
                  )}
                  <span className="font-semibold text-navy">{s.name}</span>
                </span>
                <span className="text-[14px] text-ink-2">{s.course}</span>
                <span className="text-[13px] text-ink-3">{formatJoined(s.joined)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
