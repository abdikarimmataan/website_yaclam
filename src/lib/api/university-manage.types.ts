import type { UniversityApiRecord, UniversityProgram } from "@/lib/api/university.types";

export type ManageNamedRef = {
  id: string;
  name?: string;
};

export type ManageOfferingApi = {
  id?: string;
  studyAreaId?: ManageNamedRef | null;
  disciplineId?: ManageNamedRef | null;
  categoryId?: ManageNamedRef | null;
  year?: string;
  languageIds?: ManageNamedRef[];
  feePerYear?: string;
  website?: string;
};

export type UniversityManageApiRecord = {
  id: string;
  universityId?: UniversityApiRecord;
  offerings?: ManageOfferingApi[];
  created_at?: string;
  updated_at?: string;
};

export type PaginatedUniversityManages = {
  data: UniversityManageApiRecord[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};

export type { UniversityProgram };
