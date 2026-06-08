import { redirect } from "next/navigation";

export default function NewCourseRedirect() {
  redirect("/instructor/courses?create=1");
}
