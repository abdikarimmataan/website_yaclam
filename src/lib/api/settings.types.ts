export type SiteLogoPicture = {
  light?: string;
  dark?: string;
  alt?: string;
  isVisible?: boolean;
};

export type SiteLogoText = {
  mark?: string;
  name?: string;
  highlight?: string;
  isVisible?: boolean;
};

export type SiteSettings = {
  siteName?: string;
  siteNameArabic?: string;
  siteTagline?: string;
  logo?: {
    isVisible?: boolean;
    text?: SiteLogoText;
    picture?: SiteLogoPicture;
  };
};
