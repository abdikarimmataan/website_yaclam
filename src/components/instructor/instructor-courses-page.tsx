"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { CourseApiRecord } from "@/lib/api/course.types";
import {
  getCourseLabel,
  getInstructorCourses,
  getInstructorCourseById,
  updateInstructorCourseVisible,
} from "@/lib/api/instructor-course.service";
import { CourseFormEditor } from "@/components/instructor/course-form-editor";
import { InstructorCourseTable } from "@/components/instructor/course-table";
import { CourseCurriculumEditor } from "@/components/instructor/course-curriculum-editor";
import { CourseResourcesEditor } from "@/components/instructor/course-resources-editor";
import { CoursePreviewModal } from "@/components/instructor/course-preview-modal";
import { toast } from "@/lib/utils/toast";

type View = "list" | "form" | "curriculum" | "resources";

export function InstructorCoursesPage() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>("list");
  const [items, setItems] = useState<CourseApiRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [curriculumId, setCurriculumId] = useState<string | null>(null);
  const [curriculumTitle, setCurriculumTitle] = useState("");
  const [resourcesId, setResourcesId] = useState<string | null>(null);
  const [resourcesTitle, setResourcesTitle] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<CourseApiRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInstructorCourses({ page: 1, pageSize: 500 });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load courses");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const create = searchParams.get("create") === "1";
    const editId = searchParams.get("edit")?.trim();
    if (create) {
      setRecordId(null);
      setView("form");
    } else if (editId) {
      setRecordId(editId);
      setView("form");
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => getCourseLabel(item).toLowerCase().includes(q));
  }, [items, search]);

  useEffect(() => setPage(1), [search, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const backToList = () => {
    setView("list");
    setRecordId(null);
    setCurriculumId(null);
    setResourcesId(null);
  };

  const openCreate = () => {
    setRecordId(null);
    setView("form");
  };

  const openEdit = (item: CourseApiRecord) => {
    if (!item.id) return;
    setRecordId(String(item.id));
    setView("form");
  };

  const openShow = async (item: CourseApiRecord) => {
    if (!item.id) return;
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewRecord(null);
    setBusyId(String(item.id));
    try {
      setPreviewRecord(await getInstructorCourseById(String(item.id)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load preview");
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
      setBusyId(null);
    }
  };

  const openCurriculum = (item: CourseApiRecord) => {
    if (!item.id) return;
    setCurriculumId(String(item.id));
    setCurriculumTitle(getCourseLabel(item));
    setView("curriculum");
  };

  const openResources = (item: CourseApiRecord) => {
    if (!item.id) return;
    setResourcesId(String(item.id));
    setResourcesTitle(getCourseLabel(item));
    setView("resources");
  };

  const handleToggleVisible = async (item: CourseApiRecord) => {
    if (!item.id) return;
    const next = item.isVisible === false;
    if (!confirm(next ? "Show this course?" : "Hide this course?")) return;
    setBusyId(String(item.id));
    try {
      await updateInstructorCourseVisible(String(item.id), next);
      await fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleSaved = async () => {
    await fetchData();
    backToList();
  };

  if (view === "form") {
    return <CourseFormEditor recordId={recordId} onBack={backToList} onSaved={handleSaved} />;
  }

  if (view === "curriculum" && curriculumId) {
    return (
      <CourseCurriculumEditor
        courseId={curriculumId}
        courseTitle={curriculumTitle}
        onBack={backToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "resources" && resourcesId) {
    return (
      <CourseResourcesEditor
        courseId={resourcesId}
        courseTitle={resourcesTitle}
        onBack={backToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-[28px]">My Courses</h1>
          <p className="text-sm text-ink-3 sm:text-base">Create, edit and track your published courses.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-gold">
          <Plus size={17} /> New course
        </button>
      </div>

      <InstructorCourseTable
        loading={loading}
        items={paginated}
        search={search}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        filteredCount={filtered.length}
        busyId={busyId}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={openEdit}
        onShow={openShow}
        onCurriculum={openCurriculum}
        onResources={openResources}
        onToggleVisible={handleToggleVisible}
      />

      <CoursePreviewModal
        open={previewOpen}
        loading={previewLoading}
        record={previewRecord}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewRecord(null);
        }}
      />
    </div>
  );
}
