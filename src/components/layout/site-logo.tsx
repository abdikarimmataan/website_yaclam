import Link from "next/link";
import { uploadUrl } from "@/lib/api/cms";
import type { SiteLogoText, SiteSettings } from "@/lib/api/settings.types";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  settings?: SiteSettings | null;
  /** Footer CMS text when settings has no image logo. */
  fallbackText?: SiteLogoText | null;
  className?: string;
  imageClassName?: string;
  variant?: "navbar" | "footer";
};

function resolveText(
  text?: SiteLogoText | null,
  fallbackText?: SiteLogoText | null
): SiteLogoText | null {
  if (text && text.isVisible !== false && text.name) return text;
  if (fallbackText && fallbackText.isVisible !== false && fallbackText.name) {
    return fallbackText;
  }
  return null;
}

export function SiteLogo({
  settings,
  fallbackText,
  className,
  imageClassName,
  variant = "navbar",
}: SiteLogoProps) {
  const logo = settings?.logo;
  const showLogo = logo?.isVisible !== false;
  const picture = logo?.picture;
  const text = logo?.text;
  const showPicture = showLogo && picture?.isVisible !== false && picture?.light?.trim();
  const pictureSrc = uploadUrl(picture?.light);
  const resolvedText = resolveText(text, fallbackText);

  const textClasses =
    variant === "footer"
      ? "text-[22px] font-extrabold text-white"
      : "text-[22px] font-extrabold tracking-tight text-navy";

  const hasPicture = !!(showPicture && pictureSrc);
  const hasText = !!resolvedText;

  if (hasPicture || hasText) {
    return (
      <Link
        href="/"
        className={cn(
          "flex items-center",
          hasText && "gap-2.5",
          hasText && textClasses,
          className
        )}
      >
        {hasPicture && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pictureSrc}
            alt={picture?.alt?.trim() || resolvedText?.name || "Yaclam"}
            className={cn("h-9 w-auto max-w-[200px] object-contain", imageClassName)}
          />
        )}
        {hasText && (
          <span>
            {resolvedText.name || "Yaclam"}
            <span className="text-gold">{resolvedText.highlight || "."}</span>
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", textClasses, className)}>
      <span>
        Yaclam<span className="text-gold">.</span>
      </span>
    </Link>
  );
}
