"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeButton, HomeConfig } from "@/lib/api/home.types";
import { cmsUrl, parseBoldSegments } from "@/lib/api/cms";
import { heroFromConfig } from "@/lib/api/home.defaults";

function HeroCta({ btn, className }: { btn: HomeButton; className: string }) {
  if (btn.isVisible === false || !btn.label) return null;
  return (
    <Link href={cmsUrl(btn.url)} className={className}>
      {btn.label}
      {className.includes("btn-gold") ? <ArrowRight size={18} /> : null}
    </Link>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function HeroTitle({ title }: { title: string }) {
  const goldMatch = title.match(/^(.+?)\s+(Create Opportunities\.?)$/i);
  if (goldMatch) {
    return (
      <>
        {goldMatch[1]}{" "}
        <span className="text-gold">{goldMatch[2]}</span>
      </>
    );
  }
  return <>{title}</>;
}

export function Hero({ config }: { config?: HomeConfig | null }) {
  const {
    verseAr,
    verseEn,
    title,
    subtitle,
    primary,
    secondary,
    showStats,
    stats,
    learnerText,
    badge,
  } = heroFromConfig(config ?? null);

  return (
    <header className="hero-bg relative overflow-hidden text-white">
      <div className="hero-grid absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(201,168,76,.14), transparent 40%), radial-gradient(circle at 90% 80%, rgba(31,58,147,.5), transparent 45%)",
        }}
      />
      <div className="container relative py-[72px] text-center md:py-24">
        {badge ? (
          <motion.p {...fade(0)} className="mb-4 text-[13px] font-bold uppercase tracking-widest text-gold">
            {badge}
          </motion.p>
        ) : null}
        <motion.p {...fade(badge ? 0.04 : 0)} className="ar mx-auto mb-3.5 max-w-3xl text-[clamp(26px,4vw,40px)] leading-[1.7] text-gold">
          {verseAr}
        </motion.p>
        <motion.p {...fade(0.08)} className="mb-8 text-[15px] italic text-white/60">
          &ldquo;{verseEn}&rdquo;
        </motion.p>
        <motion.h1 {...fade(0.16)} className="mx-auto mb-5 max-w-4xl text-[clamp(36px,6vw,64px)] font-semibold">
          <HeroTitle title={title} />
        </motion.h1>
        <motion.p {...fade(0.24)} className="mx-auto mb-9 max-w-2xl text-[clamp(16px,2vw,19px)] text-white/80">
          {subtitle}
        </motion.p>
        <motion.div {...fade(0.32)} className="flex flex-wrap justify-center gap-3.5">
          {primary ? <HeroCta btn={primary} className="btn btn-gold" /> : null}
          {secondary ? <HeroCta btn={secondary} className="btn btn-ghost" /> : null}
        </motion.div>

        {learnerText ? (
          <motion.p {...fade(0.36)} className="mx-auto mt-8 max-w-lg text-[15px] text-white/70">
            {parseBoldSegments(learnerText).map((part, i) =>
              part.bold ? (
                <strong key={i} className="font-bold text-white">
                  {part.text}
                </strong>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </motion.p>
        ) : null}

        {showStats && stats.length > 0 ? (
          <motion.div
            {...fade(0.4)}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-4 rounded-[20px] border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm md:grid-cols-5"
          >
            {stats.map((s, i) => (
              <div key={`${s.label}-${i}`} className={`text-center ${i > 2 ? "hidden md:block" : ""}`}>
                <div className="font-display text-[clamp(24px,3vw,34px)] font-semibold text-white">{s.value}</div>
                <div className="mt-1 text-[12px] uppercase tracking-wider text-white/60">{s.label}</div>
              </div>
            ))}
          </motion.div>
        ) : null}
      </div>
    </header>
  );
}
