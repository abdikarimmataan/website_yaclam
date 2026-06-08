import Link from "next/link";
import { Clock } from "lucide-react";
import { uploadUrl } from "@/lib/api/cms";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ p }: { p: BlogPost }) {
  const coverSrc = uploadUrl(p.coverImage);

  return (
    <article className="card-base">
      <div
        className="thumb-pat relative grid h-[150px] place-items-center overflow-hidden"
        style={coverSrc ? undefined : { background: `linear-gradient(135deg, ${p.color}, #0D1B4B)` }}
      >
        {coverSrc ? (
          <>
            <img src={coverSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy/45" />
          </>
        ) : null}
        <span className="relative rounded-md bg-white/15 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white">
          {p.category}
        </span>
      </div>
      <Link href={`/blog/${p.slug}`} className="flex flex-1 flex-col gap-2 p-[18px]">
        <h3 className="font-sans text-[17px] font-bold leading-snug text-navy">{p.title}</h3>
        <p className="text-[14px] leading-relaxed text-ink-3">{p.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t border-surface-2 pt-3.5 text-[12.5px] text-ink-3">
          <span>{p.author}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {p.readTime} min</span>
        </div>
      </Link>
    </article>
  );
}
