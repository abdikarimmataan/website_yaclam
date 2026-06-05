import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ExternalLink, Calendar, MapPin, CheckCircle2, FileText, GraduationCap,
} from "lucide-react";
import { ScholarshipFlag } from "@/components/shared/scholarship-flag";
import {
  getScholarshipDetail,
  scholarshipExternalUrl,
} from "@/lib/api/scholarship.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getScholarshipDetail(slug);
  return { title: detail ? detail.scholarship.name : "Scholarship" };
}

export default async function ScholarshipDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getScholarshipDetail(slug);
  if (!detail) notFound();

  const { scholarship: s, cta } = detail;
  const ctaHref = scholarshipExternalUrl(cta.url);

  return (
    <div>
      <div className="dark-band py-12 text-white">
        <div className="container">
          <div className="mb-4 flex items-center gap-1.5 text-[13px] text-white/50">
            <Link href="/scholarships" className="hover:text-gold">Scholarships</Link>
            <ChevronRight size={13} /> <span>{s.name}</span>
          </div>
          <div className="flex items-start gap-5">
            <ScholarshipFlag flag={s.flag} name={s.name} className="text-[56px] leading-none" imageClassName="h-14 w-20" />
            <div>
              <span className={`inline-flex rounded-md px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wide ${s.funding === "Full" ? "bg-success text-white" : "bg-gold text-navy"}`}>{s.funding} Funding</span>
              <h1 className="mt-3 text-[clamp(28px,4vw,42px)] font-semibold">{s.name}</h1>
              <div className="mt-3 flex flex-wrap gap-5 text-[14px] text-white/80">
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {s.country}</span>
                <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> {s.level}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar size={15} /> {s.deadline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section container">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-3 text-[26px] font-semibold text-navy">Overview</h2>
            <p className="mb-9 text-[16px] leading-relaxed text-ink-2">{s.overview}</p>

            <h2 className="mb-4 text-[22px] font-semibold text-navy">Benefits</h2>
            <ul className="mb-9 grid gap-3 sm:grid-cols-2">
              {s.benefits.map((b) => (
                <li key={b} className="flex gap-2.5 rounded-xl border border-line bg-surface p-3.5 text-[14.5px] text-ink-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" /> {b}</li>
              ))}
            </ul>

            <h2 className="mb-4 text-[22px] font-semibold text-navy">Eligibility</h2>
            <ul className="mb-9 flex flex-col gap-2.5">
              {s.eligibility.map((e) => (
                <li key={e} className="flex gap-2.5 text-[15px] text-ink-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-royal" /> {e}</li>
              ))}
            </ul>

            <h2 className="mb-4 text-[22px] font-semibold text-navy">Documents required</h2>
            <div className="flex flex-wrap gap-2">
              {s.documents.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-ink-2"><FileText size={13} /> {d}</span>
              ))}
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-6 shadow-soft">
              <h4 className="mb-4 font-sans text-[15px] font-bold text-navy">Quick facts</h4>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Provider</span><b className="text-right text-navy">{s.provider}</b></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Country</span><b className="text-navy">{s.country}</b></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Level</span><b className="text-right text-navy">{s.level}</b></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Funding</span><b className="text-navy">{s.funding}</b></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Deadline</span><b className="text-right text-navy">{s.deadline}</b></div>
              <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-5 w-full">
                {cta.label} <ExternalLink size={16} />
              </a>
              <p className="mt-3 text-center text-[12px] text-ink-3">Confirm the live deadline on the official site.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
