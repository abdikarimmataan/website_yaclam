import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditCourseRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/instructor/courses?edit=${id}`);
}
