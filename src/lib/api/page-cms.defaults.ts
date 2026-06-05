import type { PageCmsConfig, PageCmsKey, PageCmsView } from "@/lib/api/page-cms.types";

type PageCmsFallback = Omit<PageCmsView, "isVisible">;

export const PAGE_CMS_FALLBACKS: Record<PageCmsKey, PageCmsFallback> = {
  course: {
    title: "Explore Courses",
    subtitle:
      "Practical, job-ready skills taught in Somali. Filter by topic, price and level to find your next course.",
    emptyStateText: "No courses found.",
  },
  roadmap: {
    title: "Career Roadmaps",
    subtitle: "Pick a destination. We give you the salary outlook, the skills, and a guided sequence to get there.",
    emptyStateText: "No roadmaps found.",
  },
  scholarship: {
    title: "Scholarship Portal",
    subtitle:
      "Funded study opportunities worldwide — eligibility, benefits and deadlines, explained for Somali applicants.",
    emptyStateText: "No scholarships found.",
  },
  blog: {
    title: "Yaclam Blog",
    subtitle:
      "Guides, roadmaps and insights on skills, careers, scholarships and study abroad — written for Somali learners.",
    emptyStateText: "No posts found.",
  },
  about: {
    title: "About Yaclam",
    subtitle:
      "The largest Somali-language learning ecosystem — built to make world-class education accessible in the language learners understand best.",
    emptyStateText: "",
  },
  contact: {
    title: "Get in touch",
    subtitle: "Questions about courses, scholarships or partnerships? We'd love to hear from you.",
    emptyStateText: "",
  },
};

export function pageCmsFromConfig(config: PageCmsConfig | null, key: PageCmsKey): PageCmsView {
  const fallback = PAGE_CMS_FALLBACKS[key];
  if (!config) {
    return { isVisible: true, ...fallback };
  }

  const title = config.title?.trim() || fallback.title;

  return {
    isVisible: config.isVisible !== false,
    title,
    subtitle: config.subtitle?.trim() || fallback.subtitle,
    emptyStateText: config.emptyStateText?.trim() || fallback.emptyStateText,
  };
}
