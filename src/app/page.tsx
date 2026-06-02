import Link from "next/link";
import {
  ArrowRight, Globe, Award, Target, GraduationCap, Quote, ShieldCheck,
} from "lucide-react";
import { Hero } from "@/components/home/hero";
import { getHomeConfig } from "@/lib/api/home.service";
import { getHomeSectionsConfig } from "@/lib/api/home-sections.service";
import { cmsUrl } from "@/lib/api/cms";
import { sectionsFromConfig } from "@/lib/api/home-sections.defaults";
import { SectionHeading } from "@/components/shared/section-heading";
import { CourseCard } from "@/components/shared/course-card";
import { RoadmapCard } from "@/components/shared/roadmap-card";
import { Icon } from "@/lib/icon-map";
import { categories } from "@/lib/data/categories";
import { featuredCourses } from "@/lib/data/courses";
import { roadmaps } from "@/lib/data/roadmaps";
import { scholarships } from "@/lib/data/scholarships";
import { instructors } from "@/lib/data/instructors";
import { testimonials } from "@/lib/data/testimonials";

const why = [
  { icon: Globe, t: "Learn in Somali", d: "Complex skills explained in your mother tongue, with English technical terms — the way you actually understand best." },
  { icon: Award, t: "Verified Certificates", d: "Earn shareable certificates with QR verification to prove your skills to employers." },
  { icon: Target, t: "Career Roadmaps", d: "Clear, step-by-step paths from beginner to hired — no more guessing what to learn next." },
  { icon: GraduationCap, t: "Scholarship Access", d: "A live database of funded opportunities plus masterclasses on how to win them." },
];

export default async function Home() {
  const [home, homeSections] = await Promise.all([getHomeConfig(), getHomeSectionsConfig()]);
  const s = sectionsFromConfig(homeSections);
  const featuredCoursesLimit = home?.featuredCoursesLimit ?? 6;
  const featuredCoursesList = featuredCourses.slice(0, featuredCoursesLimit);

  return (
    <>
      {home?.heroIsVisible !== false && <Hero config={home} />}

      {/* Categories */}
      {s.field.isVisible ? (
      <section className="section container">
        <SectionHeading center eyebrow={s.field.eyebrow} title={s.field.title} sub={s.field.subtitle} />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/courses?cat=${cat.id}`} className="group rounded-2xl border border-line bg-white p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-soft">
              <div className="mx-auto mb-3.5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-surface text-royal transition group-hover:bg-navy group-hover:text-gold">
                <Icon name={cat.icon} size={24} />
              </div>
              <div className="text-[14.5px] font-bold text-navy">{cat.name}</div>
              <div className="mt-1 text-[12.5px] text-ink-3">{cat.count} courses</div>
            </Link>
          ))}
        </div>
      </section>
      ) : null}

      {/* Featured courses */}
      {s.featured.isVisible ? (
        <section className="section border-t border-line">
          <div className="container">
            <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow={s.featured.eyebrow}
                title={s.featured.title}
                sub={s.featured.subtitle}
              />
              {s.featured.viewAll.isVisible !== false && s.featured.viewAll.text ? (
                <Link href={cmsUrl(s.featured.viewAll.url)} className="btn btn-outline btn-sm">
                  {s.featured.viewAll.text} <ArrowRight size={15} />
                </Link>
              ) : null}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCoursesList.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Why Yaclam */}
      {s.whyYaclam.isVisible ? (
      <section className="section container">
        <SectionHeading center eyebrow={s.whyYaclam.eyebrow} title={s.whyYaclam.title} sub={s.whyYaclam.subtitle} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((f) => (
            <div key={f.t}>
              <div className="mb-4 grid h-[54px] w-[54px] place-items-center rounded-[14px] bg-surface text-royal"><f.icon size={26} /></div>
              <h3 className="mb-2 font-sans text-lg font-bold text-navy">{f.t}</h3>
              <p className="text-[14.5px] text-ink-3">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
      ) : null}

      {/* Roadmaps */}
      {s.roadmaps.isVisible ? (
      <section className="section bg-surface">
        <div className="container">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={s.roadmaps.eyebrow} title={s.roadmaps.title} sub={s.roadmaps.subtitle} />
            {s.roadmaps.allRoadmaps.isVisible !== false && s.roadmaps.allRoadmaps.text ? (
              <Link href={cmsUrl(s.roadmaps.allRoadmaps.url)} className="btn btn-outline btn-sm">
                {s.roadmaps.allRoadmaps.text} <ArrowRight size={15} />
              </Link>
            ) : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roadmaps.slice(0, 4).map((r) => <RoadmapCard key={r.id} r={r} />)}
          </div>
        </div>
      </section>
      ) : null}

      {/* Scholarships (dark) */}
      {s.scholarships.isVisible ? (
      <section className="section dark-band text-white">
        <div className="container">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading dark eyebrow={s.scholarships.eyebrow} title={s.scholarships.title} sub={s.scholarships.subtitle} />
            {s.scholarships.browseAll.isVisible !== false && s.scholarships.browseAll.text ? (
              <Link href={cmsUrl(s.scholarships.browseAll.url)} className="btn btn-gold btn-sm">
                {s.scholarships.browseAll.text} <ArrowRight size={15} />
              </Link>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {scholarships.slice(0, 6).map((item) => (
              <Link key={item.id} href={`/scholarships/${item.slug}`} className="flex items-center gap-4 rounded-[14px] border border-white/15 bg-white/[0.06] p-[18px] transition hover:translate-x-1 hover:border-gold hover:bg-white/10">
                <span className="text-[30px]">{item.flag}</span>
                <div className="flex-1">
                  <div className="font-bold">{item.name}</div>
                  <div className="mt-0.5 text-[13px] text-white/60">{item.country} · {item.level} · {item.deadline}</div>
                </div>
                <span className="whitespace-nowrap rounded-md bg-gold px-2.5 py-1 text-[11px] font-extrabold text-navy">{item.funding}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* Instructors */}
      {s.practitioners.isVisible ? (
      <section className="section container">
        <SectionHeading center eyebrow={s.practitioners.eyebrow} title={s.practitioners.title} sub={s.practitioners.subtitle} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.slice(0, 4).map((i) => (
            <div key={i.id} className="rounded-2xl border border-line bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-soft">
              <div className="mx-auto mb-3.5 grid h-[72px] w-[72px] place-items-center rounded-full font-display text-2xl font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${i.color}, #0D1B4B)` }}>{i.initials}</div>
              <h3 className="font-sans text-[17px] font-bold text-navy">{i.name}</h3>
              <div className="mb-3 mt-1 text-[13.5px] text-ink-3">{i.role}</div>
              <div className="flex justify-center gap-4 text-[13px] text-ink-3">
                <span><b className="text-navy">{i.courses}</b> courses</span>
                <span><b className="text-navy">{i.students}</b> students</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      ) : null}

      {/* Testimonials */}
      {s.testimonials.isVisible ? (
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading center eyebrow={s.testimonials.eyebrow} title={s.testimonials.title} sub={s.testimonials.subtitle} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.name} className="rounded-2xl border border-line bg-white p-8">
                <Quote className="mb-3.5 text-gold" size={30} />
                <p className="mb-5 text-[15.5px] leading-relaxed text-ink-2">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="grid h-[46px] w-[46px] place-items-center rounded-full bg-navy font-bold text-gold">{t.initials}</div>
                  <div><div className="font-bold text-navy">{t.name}</div><div className="text-[13px] text-ink-3">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* CTA */}
      {s.cta.isVisible ? (
      <section className="section container">
        <div className="relative overflow-hidden rounded-[28px] px-8 py-16 text-center text-white" style={{ background: "radial-gradient(120% 140% at 50% 0, #26367a, #0D1B4B 60%)" }}>
          <ShieldCheck className="mx-auto mb-4 text-gold" size={34} />
          <h2 className="mb-3.5 text-3xl font-semibold md:text-[2.6rem]">{s.cta.title}</h2>
          <p className="mx-auto mb-7 max-w-xl text-[17px] text-white/80">{s.cta.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3.5">
            {s.cta.primary.isVisible !== false && s.cta.primary.text ? (
              <Link href={cmsUrl(s.cta.primary.url)} className="btn btn-gold">
                {s.cta.primary.text} <ArrowRight size={18} />
              </Link>
            ) : null}
            {s.cta.secondary.isVisible !== false && s.cta.secondary.text ? (
              <Link href={cmsUrl(s.cta.secondary.url)} className="btn btn-ghost">
                {s.cta.secondary.text}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}
    </>
  );
}
