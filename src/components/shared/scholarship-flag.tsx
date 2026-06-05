import { uploadUrl } from "@/lib/api/cms";
import { cn } from "@/lib/utils";

export function ScholarshipFlag({
  flag,
  name,
  className,
  imageClassName,
}: {
  flag: string;
  name?: string;
  className?: string;
  imageClassName?: string;
}) {
  const src = uploadUrl(flag);

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} flag` : "Country flag"}
        className={cn("h-8 w-11 rounded object-cover", imageClassName)}
      />
    );
  }

  return <span className={className}>{flag || "🌍"}</span>;
}
