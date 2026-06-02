export interface SectionText {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  isVisible?: boolean;
}

export interface SectionButton {
  text: string;
  url: string;
  isVisible?: boolean;
}

export interface FeaturedCoursesSection extends SectionText {
  viewAllButton?: SectionButton;
}

export interface RoadmapsSection extends SectionText {
  allRoadmapsButton?: SectionButton;
}

export interface ScholarshipsSection extends SectionText {
  browseAllButton?: SectionButton;
}

export interface CtaSection {
  title?: string;
  subtitle?: string;
  primaryButton?: SectionButton;
  secondaryButton?: SectionButton;
  isVisible?: boolean;
}

export interface HomeSectionsConfig {
  id: string;
  isVisible?: boolean;
  del_status?: string;
  fieldSection?: SectionText;
  featuredCoursesSection?: FeaturedCoursesSection;
  whyYaclamSection?: SectionText;
  roadmapsSection?: RoadmapsSection;
  scholarshipsSection?: ScholarshipsSection;
  practitionersSection?: SectionText;
  testimonialsSection?: SectionText;
  ctaSection?: CtaSection;
}
