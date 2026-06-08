import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Users,
  Clock,
  BarChart3,
  GraduationCap,
  Languages,
  ShoppingCart,
  Heart,
  Play,
  CalendarClock,
  Award,
} from "lucide-react";
import { getCourseDetail } from "@/lib/api/course.service";
import { uploadUrl } from "@/lib/api/cms";
import { categoryIcon } from "@/lib/data/categories";
import { Icon } from "@/lib/icon-map";
import { Stars } from "@/components/shared/stars";
import { CourseTabs } from "@/components/shared/course-tabs";
import {
  CoursePreviewVideo,
  type PreviewSampleVideo,
} from "@/components/shared/course-preview-video";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCourseDetail(slug);
  return { title: detail ? detail.course.title : "Course" };
}

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCourseDetail(slug);
  if (!detail) notFound();

  const { course, modules } = detail;
  const initials = course.instructor
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  const iconName = course.categoryIcon?.trim() || categoryIcon(course.category);
  const previewVideoSrc = uploadUrl(course.previewVideoUrl);
  const thumbnailSrc = uploadUrl(course.thumbnail);
  const instructorAvatarSrc = uploadUrl(course.instructorAvatar);

  const previewSamples: PreviewSampleVideo[] = [];
  if (previewVideoSrc) {
    previewSamples.push({
      id: "preview",
      title: course.title,
      src: previewVideoSrc,
      poster: thumbnailSrc,
    });
  }
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!lesson.free) continue;
      const src = uploadUrl(lesson.videoUrl);
      if (!src || previewSamples.some((s) => s.src === src)) continue;
      previewSamples.push({
        id: lesson.id,
        title: lesson.title,
        src,
        poster: thumbnailSrc,
      });
    }
  }

  const facts: [typeof Users, string, string][] = [
    [Users, "Students", course.students.toLocaleString()],
    [Languages, "Language", course.language],
    [Clock, "Duration", course.hours ? `${course.hours} hours` : "—"],
    [BarChart3, "Level", course.level],
    [CalendarClock, "Expiry Period", course.expiry],
    [Award, "Certificate", course.certificate ? "Yes" : "No"],
  ];

  return (
    <div className="bg-surface">
      <div className="container py-10">
        <div className="mb-6 flex items-center gap-1.5 text-[13px] text-ink-3">
          <Link href="/courses" className="hover:text-royal">
            Courses
          </Link>
          <ChevronRight size={13} /> <span className="text-navy">{course.title}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h1 className="text-[clamp(28px,4vw,44px)] font-bold leading-tight text-navy">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5">
                {instructorAvatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={instructorAvatarSrc}
                    alt={course.instructor}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="grid h-9 w-9 place-items-center rounded-full font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${course.color}, #0D1B4B)`,
                    }}
                  >
                    {initials}
                  </div>
                )}
                <span className="font-semibold text-navy">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stars rating={course.rating} />
                <span className="text-[13px] text-ink-3">({course.reviews})</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-ink-2">
                <Languages size={16} className="text-ink-3" /> {course.language}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4 text-[14px] text-ink-2">
              <span className="flex items-center gap-2">
                <GraduationCap size={16} className="text-royal" /> Course Certificate
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-royal" />{" "}
                {course.students.toLocaleString()} Enrolled Students
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-royal" />{" "}
                {course.hours ? `${course.hours} hours` : "—"}
              </span>
            </div>

            <div className="mt-8">
              <CourseTabs course={course} modules={modules} />
            </div>
          </div>

          <aside>
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div
                className="relative grid aspect-video place-items-center overflow-hidden text-white thumb-pat"
                style={
                  previewSamples.length > 0
                    ? { background: "#0D1B4B" }
                    : { background: `linear-gradient(135deg, ${course.color}, #0D1B4B)` }
                }
              >
                {previewSamples.length > 0 ? (
                  <CoursePreviewVideo
                    poster={thumbnailSrc}
                    title={course.title}
                    samples={previewSamples}
                  />
                ) : (
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                      <Icon name={iconName} size={30} />
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide">
                      {course.level}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-end gap-2">
                  <span
                    className={`font-display text-[34px] font-bold ${
                      course.free ? "text-success" : "text-navy"
                    }`}
                  >
                    {course.free ? "Free" : `$${course.price}`}
                  </span>
                  {!course.free && course.oldPrice && (
                    <span className="mb-1.5 text-lg text-ink-3 line-through">
                      ${course.oldPrice}
                    </span>
                  )}
                </div>

                <button type="button" className="btn btn-outline mb-2.5 w-full">
                  <Heart size={16} /> Add to Wishlist
                </button>
                <Link href={`/learn/${course.slug}`} className="btn btn-gold w-full">
                  {course.free ? (
                    <>
                      Start Learning <Play size={16} />
                    </>
                  ) : (
                    <>
                      Buy Now <ShoppingCart size={16} />
                    </>
                  )}
                </Link>

                <div className="mt-6 flex flex-col">
                  {facts.map(([IconComponent, label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-t border-surface-2 py-3 text-[14px]"
                    >
                      <span className="flex items-center gap-2.5 text-ink-3">
                        <IconComponent size={17} className="text-ink-3" /> {label}
                      </span>
                      <b className="text-navy">{value}</b>
                    </div>
                  ))}
                </div>

                {!course.free && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["WaafiPay", "EVC Plus", "Zaad", "PayPal", "Visa"].map((payment) => (
                      <span
                        key={payment}
                        className="rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink-2"
                      >
                        {payment}
                      </span>
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
