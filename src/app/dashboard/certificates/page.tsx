import { Award, Download, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Certificates" };

const certs = [
  { title: "Python for Data Analysis", date: "12 May 2026", id: "YC-PY-2026-0481" },
  { title: "Scholarship Application Masterclass", date: "28 Mar 2026", id: "YC-SCH-2026-0192" },
];

export default function Certificates() {
  return (
    <div>
      <h1 className="mb-1 text-[28px] font-bold text-navy">Certificates</h1>
      <p className="mb-7 text-ink-3">Your verified certificates of completion.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {certs.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative flex items-center gap-4 bg-gradient-to-br from-navy to-royal p-6 text-white">
              <Award size={40} className="text-gold" />
              <div>
                <div className="text-[12px] uppercase tracking-wider text-white/60">Certificate of Completion</div>
                <div className="font-display text-[18px] font-semibold">{c.title}</div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[13px] text-success"><CheckCircle2 size={15} /> Verified · {c.id}</div>
              <div className="mt-1 text-[13px] text-ink-3">Issued {c.date}</div>
              <button className="btn btn-outline btn-sm mt-4 w-full"><Download size={14} /> Download PDF</button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-line bg-surface p-4 text-[13px] text-ink-3">Certificate generation &amp; QR verification wire to the backend.</p>
    </div>
  );
}
