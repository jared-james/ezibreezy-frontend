// app/(marketing)/features/feature-hero.tsx

// components/marketing/features/feature-hero.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureHeroProps {
  headline: ReactNode;
  copy: ReactNode;
  ctaText: string;
  ctaLink: string;
  visual: ReactNode;
  figLabel?: string; // e.g. "Fig 1. The Visual Canvas"
  className?: string;
}

export default function FeatureHero({
  headline,
  copy,
  ctaText,
  ctaLink,
  visual,
  figLabel,
  className,
}: FeatureHeroProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16",
        className
      )}
    >
      {/* LEFT COLUMN: Visual Wrapper */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          {/* Background Texture */}
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          {/* The "Paper" Container with Shadow */}
          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_var(--random-blue)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              {/* Optional Figure Label */}
              {figLabel && (
                <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-widest opacity-40 text-right pointer-events-none">
                  {figLabel}
                </div>
              )}

              {/* The Unique Visual Content */}
              {visual}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Editorial Copy */}
      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          {headline}
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          {copy}
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href={ctaLink}
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            {ctaText}{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
