export type UniversityRef = {
  id?: string;
  name?: string;
  code?: string;
  flag?: string;
};

export type UniversityLocationRef = UniversityRef & {
  countryId?: UniversityRef;
};

export type UniversityLanguageRef = UniversityRef & {
  countryId?: UniversityRef;
};

export type UniversityProgram = {
  course: string;
  field: string;
  level: string;
  duration: string;
  language: string;
  tuition: string;
  link: string;
};

export type UniversityApiRecord = {
  id: string;
  name?: string;
  slug?: string;
  country?: string;
  region?: string;
  city?: string;
  flag?: string;
  ranking?: string;
  programs?: UniversityProgram[];
  locationId?: string | UniversityLocationRef;
  year?: string | null;
  languageIds?: Array<string | UniversityLanguageRef>;
  feePerYear?: string;
  website?: string;
  sortOrder?: number;
  isPublished?: boolean;
  isVisible?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type University = {
  id: string;
  slug: string;
  name: string;
  location: string;
  country: string;
  region: string;
  city: string;
  flag: string;
  ranking: string;
  year: string;
  languages: string[];
  feePerYear: string;
  website: string;
  programs: UniversityProgram[];
};

export type PaginatedUniversities = {
  data: UniversityApiRecord[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};

export type UniversitiesPageResult = {
  universities: University[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};
