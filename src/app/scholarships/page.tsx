"use client";

import { useState } from "react";
import { scholarships } from "@/lib/data/scholarships";
import { ScholarshipCard } from "@/components/shared/scholarship-card";
import { cn } from "@/lib/utils";

const filters = ["All", "Full", "Partial", "Masters", "PhD", "Bachelor"];

export default function ScholarshipsPage() {
  const [f, setF] = useState("All");

  const list = scholarships.filter((s) => {
    if (f === "All") return true;
    if (f === "Full" || f === "Partial") return s.funding === f;
    return s.level.toLowerCase().includes(f.toLowerCase());
  });

  return (
    <div>
      <div className="dark-band py-14 text-white">
        <div className="container">
          <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">Scholarship Portal</h1>
          <p className="max-w-xl text-[17px] text-white/72">
            Funded study opportunities worldwide — eligibility, benefits and deadlines, explained for Somali applicants.
          </p>
        </div>
      </div>
      <section className="section container">
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((x) => (
            <button key={x} onClick={() => setF(x)} className={cn("rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition", f === x ? "border-navy bg-navy text-white" : "bg-white text-ink-2 hover:border-royal hover:text-royal")}>{x}</button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => <ScholarshipCard key={s.id} s={s} />)}
        </div>
        <p className="mt-10 rounded-xl border border-line bg-surface p-4 text-[13px] text-ink-3">
          Note: deadlines shown are typical annual windows and vary each cycle. Always confirm the current deadline on the official programme website before applying.
        </p>
      </section>
    </div>
  );
}
