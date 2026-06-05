import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, BadgeCheck } from "lucide-react";
import { getRoadmapDetail } from "@/lib/api/roadmap.service";
import { cmsUrl } from "@/lib/api/cms";
import { Icon } from "@/lib/icon-map";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getRoadmapDetail(slug);
  return { title: detail ? `${detail.roadmap.title} Roadmap` : "Roadmap" };
}

export default async function RoadmapDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getRoadmapDetail(slug);
  if (!detail) notFound();

  const { roadmap: r, skillsRequired, cta } = detail;

  return (
    <div>
      <div className="dark-band py-12 text-white">
        <div className="container">
          <div className="mb-4 flex items-center gap-1.5 text-[13px] text-white/50">
            <Link href="/roadmaps" className="hover:text-gold">Roadmaps</Link>
            <ChevronRight size={13} /> <span>{r.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid h-[60px] w-[60px] place-items-center rounded-2xl bg-white/15 text-gold"><Icon name={r.icon} size={30} /></div>
            <div>
              <h1 className="text-[clamp(28px,4vw,42px)] font-semibold">{r.title}</h1>
              <p className="mt-1 max-w-2xl text-[16px] text-white/80">{r.description}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="section container">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-4 text-[22px] font-semibold text-navy">Skills you&apos;ll master</h2>
            <div className="mb-9 flex flex-wrap gap-2">
              {r.skills.map((s) => <span key={s} className="rounded-full bg-navy px-3.5 py-1.5 text-[13px] font-semibold text-white">{s}</span>)}
            </div>

            <h2 className="mb-4 text-[22px] font-semibold text-navy">Learning path</h2>
            <div className="overflow-hidden rounded-2xl border border-line">
              {r.steps.map((step, i) => (
                <div key={`${step.title}-${i}`} className="flex items-start justify-between gap-4 border-b border-surface-2 p-5 last:border-b-0">
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-extrabold text-gold">{i + 1}</span>
                    <div>
                      <div className="font-semibold text-navy">{step.title}</div>
                      <div className="mt-0.5 text-[14px] text-ink-3">{step.detail}</div>
                    </div>
                  </div>
                  <BadgeCheck size={18} className="mt-1 shrink-0 text-royal" />
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-6 shadow-soft">
              <h4 className="mb-4 font-sans text-[15px] font-bold text-navy">Role snapshot</h4>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Market demand</span><span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-extrabold text-[#047857]">{r.demand}</span></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Salary range</span><b className="text-navy">{r.salary}</b></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Time to job-ready</span><b className="text-navy">{r.months} months</b></div>
              <div className="flex justify-between border-t border-surface-2 py-2.5 text-[14px]"><span className="text-ink-3">Skills required</span><b className="text-navy">{skillsRequired}</b></div>
              <Link href={cmsUrl(cta.url)} className="btn btn-gold mt-5 w-full">
                {cta.label} <ArrowRight size={17} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
