import Link from "next/link";
import { Sparkles, Target, Globe, ShieldCheck, Layers, ArrowRight } from "lucide-react";
import { getPageCmsConfig } from "@/lib/api/page-cms.service";

const mv = [
  { icon: Target, t: "Mission", d: "Empower Somali learners worldwide through accessible, high-quality education delivered in the language they understand best." },
  { icon: Globe, t: "Vision", d: "Become the largest Somali-language learning platform and digital education ecosystem globally." },
  { icon: ShieldCheck, t: "Values", d: "Quality without compromise, dignity in access, and lasting impact for communities." },
  { icon: Layers, t: "Ecosystem", d: "Courses, scholarships, roadmaps and certificates — everything in one trusted place." },
];

export async function generateMetadata() {
  const cms = await getPageCmsConfig("about");
  return { title: cms.title };
}

export default async function AboutPage() {
  const cms = await getPageCmsConfig("about");

  return (
    <div>
      {cms.isVisible ? (
        <div className="dark-band py-14 text-white">
          <div className="container">
            <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">{cms.title}</h1>
            <p className="max-w-xl text-[17px] text-white/72">{cms.subtitle}</p>
          </div>
        </div>
      ) : null}

      <section className="section container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> Our Story</span>
            <h2 className="mb-4.5 mt-3.5 text-[2.2rem] font-semibold text-navy">Knowledge, in your language.</h2>
            <p className="mb-4 text-[16.5px] leading-[1.75] text-ink-2">
              Yaclam (يعلم) exists because talent is everywhere, but access is not. Millions of Somali learners are held back not by ability, but by a lack of high-quality education in a language they fully understand.
            </p>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              We teach practical, job-ready skills — data, technology, finance, design — alongside the scholarship and career guidance learners need to turn knowledge into opportunity, wherever they are in the world.
            </p>
            <Link href="/register" className="btn btn-navy mt-6">Join Yaclam <ArrowRight size={17} /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {mv.map((m) => (
              <div key={m.t} className="rounded-2xl border border-line bg-white p-6">
                <div className="mb-3.5 grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold"><m.icon size={22} /></div>
                <h3 className="mb-2 font-sans text-[19px] font-bold text-navy">{m.t}</h3>
                <p className="text-[15px] text-ink-3">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-band text-white">
        <div className="container text-center">
          <p className="ar mb-4.5 text-[clamp(24px,4vw,34px)] text-gold">قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ</p>
          <p className="italic text-white/70">&ldquo;Are those who know equal to those who do not know?&rdquo;</p>
        </div>
      </section>
    </div>
  );
}
