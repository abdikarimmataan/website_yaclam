import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/data/courses";
import { getCurriculum } from "@/lib/data/curriculum";
import { CoursePlayer } from "@/components/shared/course-player";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCourse(slug);
  return { title: c ? `Learning · ${c.title}` : "Learning" };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const modules = getCurriculum(slug);
  return <CoursePlayer course={course} modules={modules} />;
}
