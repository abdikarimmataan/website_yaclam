"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getCourseEnrollmentCount } from "@/lib/api/course-enrollment.service";

type Props = {
  courseId: string;
  initialCount?: number;
  className?: string;
};

export function CourseEnrollmentCount({
  courseId,
  initialCount = 0,
  className = "",
}: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    void getCourseEnrollmentCount(courseId).then((data) => {
      if (data) setCount(data.count);
    });
  }, [courseId]);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Users size={16} className="text-royal" />
      {count.toLocaleString()} Enrolled Students
    </span>
  );
}

export function CourseEnrollmentText({
  courseId,
  initialCount = 0,
}: {
  courseId: string;
  initialCount?: number;
}) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    void getCourseEnrollmentCount(courseId).then((data) => {
      if (data) setCount(data.count);
    });
  }, [courseId]);

  return <>{count.toLocaleString()}</>;
}
