// app/(marketing)/features/twitter-scheduler/complementary-tools.tsx

import Link from "next/link";
import { Scissors, Sparkles } from "lucide-react";

export default function ComplementaryTools() {
  return (
    <section className="bg-foreground/5 border border-foreground p-8 mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Scissors className="w-4 h-4" />
        <span className="font-mono text-xs uppercase tracking-widest font-bold">
          Complementary Tools
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/tools/screenshot-studio"
          className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
        >
          <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
              Screenshot Studio
            </h4>
            <p className="text-xs text-foreground/60">
              Turn screenshots into aesthetic Twitter assets.
            </p>
          </div>
        </Link>

        <Link
          href="/tools/social-image-resizer"
          className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
        >
          <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
            16:9
          </div>
          <div>
            <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
              Image Resizer
            </h4>
            <p className="text-xs text-foreground/60">
              Crop photos perfectly for the X feed.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
