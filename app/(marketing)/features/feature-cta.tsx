// app/(marketing)/features/feature-cta.tsx

// components/marketing/features/feature-cta.tsx

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCTAProps {
  icon: LucideIcon;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  issueNumber: string;
  editionName: string;
  className?: string;
}

export default function FeatureCTA({
  icon: Icon,
  titlePrefix,
  titleHighlight,
  description,
  ctaText = "Start Free Trial Today",
  ctaLink = "/auth/signup",
  issueNumber,
  editionName,
  className,
}: FeatureCTAProps) {
  return (
    <section className={cn("py-24 px-6 relative overflow-hidden", className)}>
      <div className="max-w-2xl mx-auto relative">
        {/* The "Masking Tape" Visual */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-foreground/5 rotate-[-2deg] backdrop-blur-[1px] z-20 pointer-events-none" />

        {/* The "News Clipping" Container */}
        <div className="relative bg-[#fffdf5] border-2 border-dashed border-foreground/30 p-12 md:p-16 text-center rotate-1 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
              <Icon className="w-8 h-8" />
            </div>
          </div>

          <h2 className="font-serif text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-6">
            {titlePrefix} <br />
            <span className="italic text-brand-primary">{titleHighlight}</span>
          </h2>

          <p className="font-serif text-lg text-foreground/70 mb-10 leading-relaxed">
            {description}
          </p>

          <Link
            href={ctaLink}
            className="group inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all hover:bg-brand-primary hover:text-white"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="mt-8 pt-8 border-t border-dotted border-foreground/20 flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-widest text-foreground/40">
            <span>Issue No. {issueNumber}</span>
            <span className="hidden sm:inline">•</span>
            <span>Est. 2025</span>
            <span className="hidden sm:inline">•</span>
            <span>{editionName}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
