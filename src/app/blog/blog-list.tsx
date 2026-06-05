"use client";

import { useState } from "react";
import { blogPosts, blogCategories } from "@/lib/data/blog";
import { BlogCard } from "@/components/shared/blog-card";
import { cn } from "@/lib/utils";

export function BlogList() {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...blogCategories];
  const list = cat === "All" ? blogPosts : blogPosts.filter((p) => p.category === cat);

  return (
    <section className="section container">
      <div className="mb-8 flex flex-wrap gap-2">
        {cats.map((x) => (
          <button
            key={x}
            onClick={() => setCat(x)}
            className={cn(
              "rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition",
              cat === x
                ? "border-navy bg-navy text-white"
                : "bg-white text-ink-2 hover:border-royal hover:text-royal"
            )}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <BlogCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
