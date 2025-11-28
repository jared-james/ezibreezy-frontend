// app/(marketing)/tools/instagram-grid-maker/components/info-section.tsx

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function InfoSection() {
  return (
    <div className="grid md:grid-cols-12 gap-12 pt-16 border-t-4 border-double border-foreground">
      <div className="md:col-span-7 space-y-8">
        <div className="inline-flex items-center gap-2 bg-foreground text-background-editorial px-3 py-1">
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            Editorial Note
          </span>
        </div>

        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
          Make your profile pop.
        </h2>

        <div className="space-y-6 text-lg font-serif leading-relaxed text-foreground/80">
          <p>
            Your Instagram profile is your portfolio. A structured grid layout
            turns a chaotic feed into a curated gallery, encouraging new
            visitors to hit that follow button.
          </p>
          <p>
            By splitting a large "hero" image across multiple tiles, you create
            a billboard effect that dominates the screen and showcases
            high-fidelity visuals without compression artifacts.
          </p>
        </div>
      </div>

      <div className="md:col-span-5 flex flex-col justify-end">
        <div className="border-l-2 border-t-2 border-foreground p-8 space-y-6">
          <div className="flex items-center gap-2 text-brand-primary">
            <Sparkles className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              Beyond the Grid
            </span>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold mb-3">
              Manage the entire narrative.
            </h3>
            <p className="text-sm font-serif text-foreground/80 leading-relaxed">
              EziBreezy isn't just for splitting images. It is a complete
              editorial workspace to draft, schedule, and publish your content
              across all platforms.
            </p>
          </div>

          <Link
            href="/auth/signup"
            className="group flex items-center justify-between w-full border-2 border-foreground bg-brand-primary text-white px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-foreground transition-colors"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
