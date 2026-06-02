import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, Users, Clock, BarChart3, GraduationCap, Languages,
  ShoppingCart, Heart, Play, CalendarClock, Mail, Award,
} from "lucide-react";
import { courses, getCourse } from "@/lib/data/courses";
import { getCurriculum } from "@/lib/data/curriculum";
import { categoryIcon } from "@/lib/data/categories";
import { Icon } from "@/lib/icon-map";
import { Stars } from "@/components/shared/stars";
import { CourseTabs } from "@/components/shared/course-tabs";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCourse(slug);
  return { title: c ? c.title : "Course" };
}

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const modules = getCurriculum(slug);
  const initials = course.instructor.split(" ").map((w) => w[0]).slice(0, 2).join("");

  const facts: [typeof Users, string, string][] = [
    [Users, "Students", course.students.toLocaleString()],
    [Languages, "Language", course.language],
    [Clock, "Duration", `${course.hours} hours`],
    [BarChart3, "Level", course.level],
    [CalendarClock, "Expiry Period", course.expiry],
    [Award, "Certificate", course.certificate ? "Yes" : "No"],
  ];

  return (
    <div className="bg-surface">
      <div className="container py-10">
        <div className="mb-6 flex items-center gap-1.5 text-[13px] text-ink-3">
          <Link href="/courses" className="hover:text-royal">Courses</Link>
          <ChevronRight size={13} /> <span className="text-navy">{course.title}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div>
            <h1 className="text-[clamp(28px,4vw,44px)] font-bold leading-tight text-navy">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">{course.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full font-bold text-white" style={{ background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }}>{initials}</div>
                <span className="font-semibold text-navy">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2"><Stars rating={course.rating} /><span className="text-[13px] text-ink-3">({course.reviews})</span></div>
              <div className="flex items-center gap-2 text-[14px] text-ink-2"><Languages size={16} className="text-ink-3" /> {course.language}</div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4 text-[14px] text-ink-2">
              <span className="flex items-center gap-2"><GraduationCap size={16} className="text-royal" /> Course Certificate</span>
              <span className="flex items-center gap-2"><Users size={16} className="text-royal" /> {course.students.toLocaleString()} Enrolled Students</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-royal" /> {course.hours} hours</span>
            </div>

            <div className="mt-8">
              <CourseTabs course={course} modules={modules} />
            </div>
          </div>

          {/* RIGHT — sticky purchase card */}
          <aside>
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="relative grid aspect-video place-items-center overflow-hidden text-white thumb-pat" style={{ background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }}>
                <div className="relative flex flex-col items-center gap-3">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <Icon name={categoryIcon(course.category)} size={30} />
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide">{course.level}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-end gap-2">
                  <span className={`font-display text-[34px] font-bold ${course.free ? "text-success" : "text-navy"}`}>{course.free ? "Free" : `$${course.price}`}</span>
                  {!course.free && course.oldPrice && <span className="mb-1.5 text-lg text-ink-3 line-through">${course.oldPrice}</span>}
                </div>

                <button className="btn btn-outline mb-2.5 w-full"><Heart size={16} /> Add to Wishlist</button>
                <Link href={`/learn/${course.slug}`} className="btn btn-gold w-full">
                  {course.free ? <>Start Learning <Play size={16} /></> : <>Buy Now <ShoppingCart size={16} /></>}
                </Link>

                <div className="mt-6 flex flex-col">
                  {facts.map(([I, k, v]) => (
                    <div key={k} className="flex items-center justify-between border-t border-surface-2 py-3 text-[14px]">
                      <span className="flex items-center gap-2.5 text-ink-3"><I size={17} className="text-ink-3" /> {k}</span>
                      <b className="text-navy">{v}</b>
                    </div>
                  ))}
                </div>

                {!course.free && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["WaafiPay", "EVC Plus", "Zaad", "PayPal", "Visa"].map((p) => (
                      <span key={p} className="rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink-2">{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
