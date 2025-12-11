// app/(marketing)/features/linkedin-scheduler/complementary-tools.tsx

import Link from "next/link";
import { Scissors } from "lucide-react";

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
          href="/tools/linkedin-text-formatter"
          className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
        >
          <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
            B
          </div>
          <div>
            <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
              Text Formatter
            </h4>
            <p className="text-xs text-foreground/60">
              Generate bold & italic text for headers.
            </p>
          </div>
        </Link>

        <Link
          href="/tools/social-image-resizer"
          className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
        >
          <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
            1.91
          </div>
          <div>
            <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
              Image Resizer
            </h4>
            <p className="text-xs text-foreground/60">
              Crop perfectly for LinkedIn (1.91:1).
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
