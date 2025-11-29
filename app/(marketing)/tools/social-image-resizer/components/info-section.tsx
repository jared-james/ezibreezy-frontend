// app/(marketing)/tools/social-image-resizer/components/info-section.tsx

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
          Crop once. Post everywhere.
        </h2>

        <div className="space-y-6 text-lg font-serif leading-relaxed text-foreground/80">
          <p>
            Visual consistency creates authority. But managing aspect ratios for
            Instagram (4:5), Twitter (16:9), and LinkedIn (1.91:1) usually
            involves a mess of files and software.
          </p>
          <p>
            This tool centralizes your workflow. Upload your master asset, tweak
            the crop for each platform, and export pixel-perfect renditions
            instantly. No compression artifacts, no complex software.
          </p>
        </div>
      </div>

      <div className="md:col-span-5 flex flex-col justify-end">
        <div className="border-l-2 border-t-2 border-foreground p-8 space-y-6">
          <div className="flex items-center gap-2 text-brand-primary">
            <Sparkles className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              The Full Suite
            </span>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold mb-3">
              Ship content faster.
            </h3>
            <p className="text-sm font-serif text-foreground/80 leading-relaxed">
              EziBreezy provides the editorial tools you need to draft,
              visualize, and publish content that builds authority.
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
