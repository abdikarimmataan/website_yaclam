import type { HomeButton, HomeConfig, HomeStat } from "@/lib/api/home.types";

export const HERO_COPY = {
  heroVerseArabic: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
  heroVerseTranslation: "Are those who know equal to those who do not know?",
  heroTitle: "Learn Skills. Build Careers. Create Opportunities.",
  heroSubtitle:
    "Master practical skills, earn certificates, discover scholarships, and advance your career through expert-led Somali-language education.",
} as const;

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

function pickText(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function heroButton(api: HomeButton | undefined, fallback: HomeButton): HomeButton {
  const label = pickText(api?.label, fallback.label);
  const url = pickText(api?.url, fallback.url);
  return {
    label,
    url,
    style: api?.style,
    isVisible: api?.isVisible !== false && Boolean(label),
  };
}

function heroStats(api: HomeStat[] | undefined): HomeStat[] {
  const rows = api?.length
    ? api.filter((s) => s.isVisible !== false && (s.value?.trim() || s.label?.trim()))
    : DEFAULT_HERO_STATS;
  return rows.length ? rows : DEFAULT_HERO_STATS;
}

/** Merge CMS home row with public-site fallbacks (per field, like home sections). */
export function heroFromConfig(config: HomeConfig | null) {
  if (!config) {
    return {
      verseAr: HERO_COPY.heroVerseArabic,
      verseEn: HERO_COPY.heroVerseTranslation,
      title: HERO_COPY.heroTitle,
      subtitle: HERO_COPY.heroSubtitle,
      primary: DEFAULT_HERO_PRIMARY,
      secondary: DEFAULT_HERO_SECONDARY,
      showStats: true,
      stats: DEFAULT_HERO_STATS,
      learnerText: undefined as string | undefined,
      badge: undefined as string | undefined,
    };
  }

  const learnerText = config.heroLearnerCountText?.trim() || undefined;
  const badge = config.heroBadgeText?.trim() || undefined;

  return {
    verseAr: pickText(config.heroVerseArabic, HERO_COPY.heroVerseArabic),
    verseEn: pickText(config.heroVerseTranslation, HERO_COPY.heroVerseTranslation),
    title: pickText(config.heroTitle, HERO_COPY.heroTitle),
    subtitle: pickText(config.heroSubtitle, HERO_COPY.heroSubtitle),
    primary: heroButton(config.heroPrimaryButton, DEFAULT_HERO_PRIMARY),
    secondary: heroButton(config.heroSecondaryButton, DEFAULT_HERO_SECONDARY),
    showStats: config.statsIsVisible !== false,
    stats: heroStats(config.stats),
    learnerText,
    badge,
  };
}
