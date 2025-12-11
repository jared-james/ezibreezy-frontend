// app/(marketing)/features/twitter-scheduler/complementary-tools.tsx

import Link from "next/link";
import { Scissors, Sparkles, Image as ImageIcon } from "lucide-react";

export default function ComplementaryTools() {
  return (
    <section className="mb-24 relative">
      {/* "Cut Here" Line Visual */}
      <div className="flex items-center gap-3 text-foreground/30 mb-2 pl-1">
        <Scissors className="w-4 h-4 -rotate-90" />
        <span className="font-mono text-[9px] uppercase tracking-widest">
          Detach & Keep
        </span>
      </div>

      {/* Main Container - The "Coupon" */}
      <div className="border-2 border-dashed border-foreground/20 bg-background-editorial p-8 relative overflow-hidden">
        {/* Subtle texture background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10">
          <h3 className="font-serif text-2xl font-bold mb-8">
            The Utility Drawer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tool 1: Screenshot Studio */}
            <Link
              href="/tools/screenshot-studio"
              className="group relative bg-white border border-foreground/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--random-blue)] hover:border-foreground"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-hover border border-foreground/10 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold font-serif text-lg mb-1 group-hover:text-brand-primary transition-colors">
                    Screenshot Studio
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Turn screenshots into aesthetic Twitter assets. Add
                    backgrounds, padding, and shadows.
                  </p>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-foreground/0 border-r-foreground/0 group-hover:border-t-brand-primary/20 group-hover:border-r-brand-primary/20 transition-all" />
            </Link>

            {/* Tool 2: Image Resizer */}
            <Link
              href="/tools/social-image-resizer"
              className="group relative bg-white border border-foreground/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--random-blue)] hover:border-foreground"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-hover border border-foreground/10 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-serif text-lg mb-1 group-hover:text-brand-primary transition-colors">
                    Image Resizer
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Crop photos perfectly for the X feed (16:9). Avoid awkward
                    cropping in the timeline.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
