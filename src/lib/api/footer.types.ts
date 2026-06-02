export interface FooterLink {
  label: string;
  url: string;
  isVisible?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
  isVisible?: boolean;
}

export interface FooterLogoText {
  mark: string;
  name: string;
  highlight: string;
  isVisible?: boolean;
}

export interface FooterLogo {
  text?: FooterLogoText;
  isVisible?: boolean;
}

export interface FooterSocials {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
}

export interface FooterContent {
  description: string;
  copyright: string;
  tagline: string;
  columns: FooterColumn[];
}

export interface FooterConfig {
  id: string;
  siteName?: string;
  siteNameArabic?: string;
  logo?: FooterLogo;
  socials?: FooterSocials;
  footer?: FooterContent;
  isVisible?: boolean;
  del_status?: string;
}
