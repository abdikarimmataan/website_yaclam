export type RoadmapStepApi = {
  title?: string;
  detail?: string;
  order?: number;
  isVisible?: boolean;
};

export type RoadmapApiRecord = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  skills?: string[];
  demand?: string;
  salary?: string;
  months?: number;
  skillsRequired?: number;
  steps?: RoadmapStepApi[];
  sortOrder?: number;
  isVisible?: boolean;
  isPublished?: boolean;
  ctaButton?: {
    label?: string;
    url?: string;
    isVisible?: boolean;
  };
};

export interface PaginatedRoadmaps {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: RoadmapApiRecord[];
}

import type { Roadmap } from "@/lib/types";

export type RoadmapDetail = {
  roadmap: Roadmap;
  skillsRequired: number;
  cta: { label: string; url: string };
};

export type RoadmapsPageResult = {
  roadmaps: Roadmap[];
  page: number;
  pages: number;
  rows: number;
  pageSize: number;
};
