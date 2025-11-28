// app/(marketing)/tools/page.tsx

import Link from "next/link";
import {
  Scissors,
  Grid3x3,
  ArrowRight,
  PenTool,
  Type,
  Pilcrow,
  Frame,
  LayoutGrid,
} from "lucide-react";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import MinimalHeader from "@/components/shared/minimal-header";

const tools = [
  {
    id: "06",
    name: "Grid Planner",
    description:
      "Curate your feed visually. Drag and drop photos to plan your perfect grid layout. Auto-saves to your device.",
    href: "/tools/instagram-grid-planner",
    icon: LayoutGrid,
    category: "Instagram",
  },
  {
    id: "05",
    name: "Screenshot Studio",
    description:
      "Wrap raw screenshots in aesthetic gradients and frames. Add shadows and rounded corners for a professional look.",
    href: "/tools/screenshot-studio",
    icon: Frame,
    category: "Design",
  },
  {
    id: "01",
    name: "Carousel Splitter",
    description:
      "Seamlessly slice panoramic images into swipeable carousel slides. Optimized for retention.",
    href: "/tools/instagram-carousel-splitter",
    icon: Scissors,
    category: "Instagram",
  },
  {
    id: "02",
    name: "Grid Maker",
    description:
      "Transform single images into 3x3, 3x4, or 3x5 profile grids. Includes gap compensation logic.",
    href: "/tools/instagram-grid-maker",
    icon: Grid3x3,
    category: "Instagram",
  },
  {
    id: "03",
    name: "Title Checker",
    description:
      "Analyze video titles for truncation and impact. Preview how your content appears in YouTube search and mobile feeds.",
    href: "/tools/youtube-title-checker",
    icon: Type,
    category: "YouTube",
  },
  {
    id: "04",
    name: "Text Formatter",
    description:
      "Convert standard text into bold, italic, or script Unicode variants to bypass platform formatting limitations.",
    href: "/tools/linkedin-text-formatter",
    icon: Pilcrow,
    category: "LinkedIn",
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif">
      <MinimalHeader />

      <main className="grow">
        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between border-b-4 border-double border-foreground pb-8 mb-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-2 py-1 font-bold">
                  Section C
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                  Utilities & Resources
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter">
                The Tool
                <br />
                Shed.
              </h1>
            </div>

            <div className="md:text-right max-w-xs">
              <p className="font-serif text-lg leading-relaxed text-foreground/80">
                Specialized instruments for the digital publisher. Open access.
                No subscription required.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block no-underline hover:no-underline focus:no-underline active:no-underline border-2 border-foreground bg-surface p-0 relative group"
                >
                  <div className="flex items-center justify-between border-b-2 border-foreground p-4 bg-background-editorial group-hover:bg-brand-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest border border-foreground px-1.5 py-0.5">
                        No. {tool.id}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">
                        {tool.category}
                      </span>
                    </div>
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>

                  <div className="p-8 md:p-12">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase leading-[0.9] tracking-tight mb-6 text-foreground group-hover:text-brand-primary transition-colors">
                      {tool.name}
                    </h2>
                    <p className="font-serif text-lg text-foreground/70 leading-relaxed mb-8">
                      {tool.description}
                    </p>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-brand-primary">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}

            <div className="border-2 border-dashed border-foreground/30 bg-background-editorial p-8 md:p-12 flex flex-col justify-center items-center text-center opacity-60">
              <div className="mb-4 p-4 rounded-full border-2 border-foreground/10 bg-surface">
                <PenTool className="w-8 h-8 text-foreground/40" />
              </div>
              <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground/40 mb-2">
                Under Construction
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                More utilities arriving in Vol. 2
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
