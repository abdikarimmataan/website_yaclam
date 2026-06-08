import type { ContactCmsConfig, ContactCmsView, ContactInfoSection, ContactInfoView } from "@/lib/api/contact-cms.types";

const PAGE_FALLBACK = {
  title: "Get in touch",
  subtitle: "Questions about courses, scholarships or partnerships? We'd love to hear from you.",
  emptyStateText: "Contact details are not available right now.",
};

const INFO_FALLBACKS = {
  email: { icon: "Mail", title: "Email", description: "hello@yaclam.com" },
  phone: { icon: "Phone", title: "Phone", description: "+353 1 234 5678" },
  location: {
    icon: "MapPin",
    title: "Location",
    description: "Dublin, Ireland · Serving learners worldwide",
  },
} as const;

function contactInfoFromSection(
  section: ContactInfoSection | undefined,
  fallback: (typeof INFO_FALLBACKS)[keyof typeof INFO_FALLBACKS]
): ContactInfoView {
  return {
    isVisible: section?.isVisible !== false,
    icon: section?.icon?.trim() || fallback.icon,
    title: section?.title?.trim() || fallback.title,
    description: section?.description?.trim() || fallback.description,
  };
}

export function contactCmsFromConfig(config: ContactCmsConfig | null): ContactCmsView {
  if (!config) {
    return {
      isVisible: true,
      ...PAGE_FALLBACK,
      email: contactInfoFromSection(undefined, INFO_FALLBACKS.email),
      phone: contactInfoFromSection(undefined, INFO_FALLBACKS.phone),
      location: contactInfoFromSection(undefined, INFO_FALLBACKS.location),
    };
  }

  const page = config.pageSection ?? {};
  const title = page.title?.trim() || config.title?.trim() || PAGE_FALLBACK.title;
  const subtitle = page.subtitle?.trim() || config.subtitle?.trim() || PAGE_FALLBACK.subtitle;
  const emptyStateText =
    config.emptyStateText?.trim() || PAGE_FALLBACK.emptyStateText;

  return {
    isVisible: config.isVisible !== false && page.isVisible !== false,
    title,
    subtitle,
    emptyStateText,
    email: contactInfoFromSection(config.emailSection, INFO_FALLBACKS.email),
    phone: contactInfoFromSection(config.phoneSection, INFO_FALLBACKS.phone),
    location: contactInfoFromSection(config.locationSection, INFO_FALLBACKS.location),
  };
}
