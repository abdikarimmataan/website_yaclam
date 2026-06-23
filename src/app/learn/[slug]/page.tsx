import { notFound } from "next/navigation";
import { getCourseDetail } from "@/lib/api/course.service";
import { CoursePlayer } from "@/components/shared/course-player";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCourseDetail(slug);
  return { title: detail ? `Learning · ${detail.course.title}` : "Learning" };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCourseDetail(slug);
  if (!detail) notFound();

  const { course, modules, resources } = detail;
  return <CoursePlayer course={course} modules={modules} resources={resources} />;
}
