import type {
  CtaSection,
  FeaturedCoursesSection,
  HomeSectionsConfig,
  RoadmapsSection,
  ScholarshipsSection,
  SectionButton,
  SectionText,
} from "@/lib/api/home-sections.types";

type SectionFallback = { eyebrow: string; title: string; subtitle: string };

export const DEFAULT_SECTION_CARD_COUNT = 5;

export function sectionCardLimit(value?: number, fallback = DEFAULT_SECTION_CARD_COUNT): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.floor(n);
}

export const SECTION_FALLBACKS = {
  field: {
    eyebrow: "Browse",
    title: "Find your field",
    subtitle: "Explore practical, job-ready skills across the disciplines that matter most.",
  },
  featured: {
    eyebrow: "Popular",
    title: "Featured courses",
    subtitle: "Hand-picked, top-rated programmes loved by thousands of learners.",
  },
  whyYaclam: {
    eyebrow: "Why Yaclam",
    title: "Education built for you",
    subtitle: "Everything you need to learn, get certified and move your career forward.",
  },
  roadmaps: {
    eyebrow: "Career Roadmaps",
    title: "Your path to a career",
    subtitle: "Salary data, in-demand skills and a guided learning sequence for every role.",
  },
  scholarships: {
    eyebrow: "Funded Futures",
    title: "Scholarships database",
    subtitle: "Fully and partially funded opportunities, updated and explained — apply with confidence.",
  },
  practitioners: {
    eyebrow: "Expert-led",
    title: "Learn from practitioners",
    subtitle: "Our instructors teach what they actually do — no theory without practice.",
  },
  testimonials: {
    eyebrow: "Learners",
    title: "Real outcomes",
    subtitle: "From first lesson to first job offer — here is what learners say.",
  },
} satisfies Record<string, SectionFallback>;

const BUTTON_FALLBACKS = {
  featuredViewAll: { text: "View all", url: "/courses", isVisible: true },
  allRoadmaps: { text: "All roadmaps", url: "/roadmaps", isVisible: true },
  browseScholarships: { text: "Browse all", url: "/scholarships", isVisible: true },
} satisfies Record<string, SectionButton>;

const CTA_FALLBACK: CtaSection = {
  title: "Your future is one decision away",
  subtitle:
    "Join thousands of Somali learners building skills, earning certificates and changing their lives. Start free today.",
  primaryButton: { text: "Create free account", url: "/register", isVisible: true },
  secondaryButton: { text: "Browse courses", url: "/courses", isVisible: true },
  isVisible: true,
};

function sectionText(section: SectionText | undefined, fallback: SectionFallback) {
  if (!section) {
    return { isVisible: true, cardNumberVisible: DEFAULT_SECTION_CARD_COUNT, ...fallback };
  }
  return {
    isVisible: section.isVisible !== false,
    eyebrow: section.eyebrow ?? fallback.eyebrow,
    title: section.title ?? fallback.title,
    subtitle: section.subtitle ?? fallback.subtitle,
    cardNumberVisible: sectionCardLimit(section.cardNumberVisible),
  };
}

function sectionButton(btn: SectionButton | undefined, fallback: SectionButton) {
  if (!btn) return fallback;
  return {
    isVisible: btn.isVisible !== false,
    text: btn.text ?? fallback.text,
    url: btn.url ?? fallback.url,
  };
}

function featuredFromSections(section: FeaturedCoursesSection | undefined) {
  const base = sectionText(section, SECTION_FALLBACKS.featured);
  return {
    ...base,
    viewAll: sectionButton(section?.viewAllButton, BUTTON_FALLBACKS.featuredViewAll),
  };
}

function roadmapsFromSections(section: RoadmapsSection | undefined) {
  const base = sectionText(section, SECTION_FALLBACKS.roadmaps);
  return {
    ...base,
    allRoadmaps: sectionButton(section?.allRoadmapsButton, BUTTON_FALLBACKS.allRoadmaps),
  };
}

function scholarshipsFromSections(section: ScholarshipsSection | undefined) {
  const base = sectionText(section, SECTION_FALLBACKS.scholarships);
  return {
    ...base,
    browseAll: sectionButton(section?.browseAllButton, BUTTON_FALLBACKS.browseScholarships),
  };
}

function ctaFromSections(sections: HomeSectionsConfig | null) {
  const cta = sections?.ctaSection;
  return {
    isVisible: cta?.isVisible !== false,
    title: cta?.title ?? CTA_FALLBACK.title,
    subtitle: cta?.subtitle ?? CTA_FALLBACK.subtitle,
    primary: sectionButton(cta?.primaryButton, CTA_FALLBACK.primaryButton!),
    secondary: sectionButton(cta?.secondaryButton, CTA_FALLBACK.secondaryButton!),
  };
}

export function sectionsFromConfig(sections: HomeSectionsConfig | null) {
  return {
    field: sectionText(sections?.fieldSection, SECTION_FALLBACKS.field),
    featured: featuredFromSections(sections?.featuredCoursesSection),
    whyYaclam: sectionText(sections?.whyYaclamSection, SECTION_FALLBACKS.whyYaclam),
    roadmaps: roadmapsFromSections(sections?.roadmapsSection),
    scholarships: scholarshipsFromSections(sections?.scholarshipsSection),
    practitioners: sectionText(sections?.practitionersSection, SECTION_FALLBACKS.practitioners),
    testimonials: sectionText(sections?.testimonialsSection, SECTION_FALLBACKS.testimonials),
    cta: ctaFromSections(sections),
  };
}
