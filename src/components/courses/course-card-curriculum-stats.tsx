"use client";

import { useEffect, useState } from "react";
import { Clock, BookOpen } from "lucide-react";
import { getCourseVideoHours } from "@/lib/api/course-video-hours.service";
import { formatCourseHours } from "@/lib/utils";

type Props = {
  courseId: string;
  initialDurationHours?: number;
  initialLessonCount?: number;
};

export function CourseCardCurriculumStats({
  courseId,
  initialDurationHours,
  initialLessonCount,
}: Props) {
  const [durationHours, setDurationHours] = useState(initialDurationHours ?? 0);
  const [lessonCount, setLessonCount] = useState(initialLessonCount ?? 0);

  useEffect(() => {
    if (initialDurationHours !== undefined) setDurationHours(initialDurationHours);
    if (initialLessonCount !== undefined) setLessonCount(initialLessonCount);
  }, [initialDurationHours, initialLessonCount]);

  useEffect(() => {
    void (async () => {
      const data = await getCourseVideoHours(courseId);
      if (!data) return;
      setDurationHours(data.durationHours);
      setLessonCount(data.lessonCount);
    })();
  }, [courseId]);

  return (
    <div className="flex items-center gap-3.5 text-[12.5px] text-ink-3">
      <span className="inline-flex items-center gap-1.5">
        <Clock size={13} /> {formatCourseHours(durationHours)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <BookOpen size={13} /> {lessonCount} lessons
      </span>
    </div>
  );
}
