export interface HomeButton {
  label: string;
  url: string;
  style?: string;
  isVisible?: boolean;
}

export interface HomeStat {
  label: string;
  value: string;
  isVisible?: boolean;
}

export interface HomeConfig {
  id: string;
  isVisible?: boolean;
  del_status?: string;
  heroBadgeText?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBrandMark?: string;
  heroVerseArabic?: string;
  heroVerseTranslation?: string;
  heroPrimaryButton?: HomeButton;
  heroSecondaryButton?: HomeButton;
  heroLearnerCountText?: string;
  heroShowLearnerAvatars?: boolean;
  heroIsVisible?: boolean;
  stats?: HomeStat[];
  statsIsVisible?: boolean;
  featuredCoursesBadgeText?: string;
  featuredCoursesTitle?: string;
  featuredCoursesSubtitle?: string;
  featuredCoursesLimit?: number;
  featuredCoursesIsVisible?: boolean;
  featuredViewAllButton?: HomeButton;
  freeCoursesTitle?: string;
  freeCoursesSubtitle?: string;
  freeCoursesLimit?: number;
  freeCoursesIsVisible?: boolean;
  freeViewAllButton?: HomeButton;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterEmailPlaceholder?: string;
  newsletterIsVisible?: boolean;
  newsletterSubmitButton?: HomeButton;
}

export interface PaginatedHome {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: HomeConfig[];
}
