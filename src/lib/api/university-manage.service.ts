import { api } from "@/api/http";
import type {
  ManageOfferingApi,
  PaginatedUniversityManages,
  UniversityManageApiRecord,
} from "@/lib/api/university-manage.types";
import { toUniversity } from "@/lib/api/university.service";
import type { University, UniversityProgram } from "@/lib/api/university.types";

const BASE = "/university_manages";

function namedRefName(ref?: { name?: string } | null): string {
  return ref?.name?.trim() || "";
}

export function offeringToProgram(
  offering: ManageOfferingApi,
  fallbackWebsite = ""
): UniversityProgram {
  const language = (offering.languageIds || [])
    .map((row) => row?.name?.trim())
    .filter(Boolean)
    .join(" / ");
  const website = offering.website?.trim() || fallbackWebsite.trim();

  return {
    course: namedRefName(offering.studyAreaId),
    field: namedRefName(offering.disciplineId),
    level: namedRefName(offering.categoryId),
    duration: offering.year?.trim() || "",
    language,
    tuition: offering.feePerYear?.trim() || "",
    link: website,
  };
}

export function manageRecordToUniversity(record: UniversityManageApiRecord): University | null {
  const universityRecord = record.universityId;
  if (!universityRecord) return null;
  if (universityRecord.isVisible === false || universityRecord.isPublished === false) return null;

  const base = toUniversity({ ...universityRecord, programs: [] });
  const programs = (record.offerings || [])
    .map((offering) => offeringToProgram(offering, base.website))
    .filter((program) => program.course && program.level);

  if (!programs.length) return null;

  const first = programs[0];
  return {
    ...base,
    year: first.duration || base.year,
    feePerYear: first.tuition || base.feePerYear,
    website: first.link || base.website,
    programs,
  };
}

export async function getAllUniversityManages(
  pageSize = 500
): Promise<UniversityManageApiRecord[]> {
  const res = await api.get<PaginatedUniversityManages>(
    `${BASE}/getAll?page=1&pageSize=${pageSize}`
  );
  return Array.isArray(res.data) ? res.data : [];
}

export async function getUniversitiesFromManage(): Promise<University[]> {
  try {
    const records = await getAllUniversityManages();
    return records
      .map(manageRecordToUniversity)
      .filter((university): university is University => university != null);
  } catch {
    return [];
  }
}
