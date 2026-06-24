import type { FooterColumn, FooterConfig, FooterContent, FooterLogo, FooterSocials } from "@/lib/api/footer.types";

const DEFAULT_LOGO: FooterLogo = {
  isVisible: true,
  text: { mark: "ي", name: "Yaclam", highlight: ".", isVisible: true },
};

const DEFAULT_SOCIALS: FooterSocials = {
  facebook: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  instagram: "",
  whatsapp: "",
};

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Learn",
    isVisible: true,
    links: [
      { label: "All Courses", url: "/courses", isVisible: true },
      { label: "Career Roadmaps", url: "/roadmaps", isVisible: true },
      { label: "Scholarships", url: "/scholarships", isVisible: true },
      { label: "Blog", url: "/blog", isVisible: true },
    ],
  },
  {
    title: "Company",
    isVisible: true,
    links: [
      { label: "About", url: "/about", isVisible: true },
      { label: "Contact", url: "/contact", isVisible: true },
      { label: "Become Instructor", url: "/register", isVisible: true },
      { label: "Dashboard", url: "/dashboard", isVisible: true },
    ],
  },
  {
    title: "Support",
    isVisible: true,
    links: [
      { label: "Help Center", url: "/contact", isVisible: true },
      { label: "FAQ", url: "/about", isVisible: true },
      { label: "Privacy Policy", url: "/about", isVisible: true },
      { label: "Terms of Service", url: "/about", isVisible: true },
    ],
  },
];

const DEFAULT_FOOTER: FooterContent = {
  description:
    "Empowering Somali learners worldwide through accessible, high-quality education in the language they understand best. Learn without limits.",
  copyright: `© ${new Date().getFullYear()} Yaclam (يعلم). All rights reserved.`,
  tagline: "Made for the Somali ummah · Learn Without Limits.",
  columns: DEFAULT_COLUMNS,
};

export type FooterViewModel = {
  isVisible: boolean;
  logo: FooterLogo;
  socials: FooterSocials;
  description: string;
  copyright: string;
  tagline: string;
  columns: FooterColumn[];
};

function mapColumns(columns: FooterColumn[] | undefined): FooterColumn[] {
  return (columns ?? [])
    .filter((col) => col.isVisible !== false && col.title)
    .map((col) => ({
      title: col.title,
      isVisible: col.isVisible !== false,
      links: (col.links ?? []).filter((link) => link.isVisible !== false && link.label),
    }))
    .filter((col) => col.links.length > 0);
}

/** Map GET /footer/getAll row → footer UI (fallbacks only when API unavailable). */
export function footerFromConfig(config: FooterConfig | null): FooterViewModel {
  if (!config) {
    return {
      isVisible: true,
      logo: DEFAULT_LOGO,
      socials: DEFAULT_SOCIALS,
      description: DEFAULT_FOOTER.description,
      copyright: DEFAULT_FOOTER.copyright,
      tagline: DEFAULT_FOOTER.tagline,
      columns: DEFAULT_COLUMNS,
    };
  }

  const f = config.footer;
  const logo = config.logo ?? DEFAULT_LOGO;
  const text = logo.text ?? DEFAULT_LOGO.text!;
  const columns = mapColumns(f?.columns);

  return {
    isVisible: config.isVisible !== false,
    logo: {
      isVisible: logo.isVisible !== false,
      text: {
        mark: text.mark ?? DEFAULT_LOGO.text!.mark,
        name: text.name ?? DEFAULT_LOGO.text!.name,
        highlight: text.highlight ?? DEFAULT_LOGO.text!.highlight,
        isVisible: text.isVisible !== false,
      },
    },
    socials: { ...DEFAULT_SOCIALS, ...config.socials },
    description: f?.description ?? DEFAULT_FOOTER.description,
    copyright: f?.copyright ?? DEFAULT_FOOTER.copyright,
    tagline: f?.tagline ?? DEFAULT_FOOTER.tagline,
    columns: columns.length > 0 ? columns : DEFAULT_COLUMNS,
  };
}
