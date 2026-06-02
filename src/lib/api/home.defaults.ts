import type { HomeButton, HomeConfig, HomeStat } from "@/lib/api/home.types";

export const DEFAULT_HERO_STATS: HomeStat[] = [
  { value: "10K+", label: "Learners", isVisible: true },
  { value: "50+", label: "Courses", isVisible: true },
  { value: "200+", label: "Scholarships", isVisible: true },
  { value: "50+", label: "Career Paths", isVisible: true },
  { value: "100+", label: "Certificates", isVisible: true },
];

export const DEFAULT_HERO_PRIMARY: HomeButton = {
  label: "Start Learning",
  url: "/register",
  isVisible: true,
};

export const DEFAULT_HERO_SECONDARY: HomeButton = {
  label: "Explore Courses",
  url: "/courses",
  isVisible: true,
};

export const DEFAULT_FEATURED = {
  badge: "Popular",
  title: "Featured courses",
  subtitle: "Hand-picked, top-rated programmes loved by thousands of learners.",
  limit: 6,
  viewAll: { label: "View all", url: "/courses", isVisible: true } satisfies HomeButton,
};

export function featuredFromHome(home: HomeConfig | null) {
  return {
    isVisible: home?.featuredCoursesIsVisible !== false,
    badge: home?.featuredCoursesBadgeText ?? DEFAULT_FEATURED.badge,
    title: home?.featuredCoursesTitle ?? DEFAULT_FEATURED.title,
    subtitle: home?.featuredCoursesSubtitle ?? DEFAULT_FEATURED.subtitle,
    limit: home?.featuredCoursesLimit ?? DEFAULT_FEATURED.limit,
    viewAll: home?.featuredViewAllButton ?? DEFAULT_FEATURED.viewAll,
  };
}
