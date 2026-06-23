import Link from "next/link";
import { Facebook, Youtube, Instagram, Twitter, Linkedin } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { cmsUrl } from "@/lib/api/cms";
import type { FooterViewModel } from "@/lib/api/footer.defaults";
import type { SiteSettings } from "@/lib/api/settings.types";

const SOCIAL_KEYS = [
  { key: "facebook" as const, Icon: Facebook, label: "Facebook" },
  { key: "twitter" as const, Icon: Twitter, label: "Twitter" },
  { key: "linkedin" as const, Icon: Linkedin, label: "LinkedIn" },
  { key: "youtube" as const, Icon: Youtube, label: "YouTube" },
  { key: "instagram" as const, Icon: Instagram, label: "Instagram" },
];

export function Footer({
  data,
  settings,
}: {
  data: FooterViewModel;
  settings?: SiteSettings | null;
}) {
  const logoText = data.logo.text;
  const showFooterTextLogo = data.logo.isVisible && logoText?.isVisible !== false;
  const settingsPicture =
    settings?.logo?.isVisible !== false &&
    settings?.logo?.picture?.isVisible !== false &&
    settings?.logo?.picture?.light?.trim();
  const showLogo = Boolean(showFooterTextLogo || settingsPicture);

  return (
    <footer className="bg-navy-deep pb-7 pt-16 text-white/65">
      <div className="container">
        <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            {showLogo ? (
              <SiteLogo
                settings={settings}
                fallbackText={logoText}
                variant="footer"
                className="mb-3.5"
              />
            ) : null}
            <p className="max-w-xs text-[14.5px] leading-7">{data.description}</p>
            <div className="mt-4 flex gap-3">
              {SOCIAL_KEYS.map(({ key, Icon, label }) => {
                const href = data.socials[key]?.trim();
                if (!href) return null;
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-[10px] bg-white/10 text-white transition hover:bg-gold hover:text-navy"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
          {data.columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-sans text-[14px] font-bold uppercase tracking-wider text-white">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={cmsUrl(link.url)} className="text-[14.5px] transition hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13.5px]">
          <span>{data.copyright}</span>
          <span>{data.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
