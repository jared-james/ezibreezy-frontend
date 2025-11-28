// app/(marketing)/tools/page.tsx
// Tools directory - showcases all available tools

import Link from "next/link";
import { Scissors, Grid3x3, ArrowRight } from "lucide-react";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";

const tools = [
  {
    name: "Instagram Carousel Splitter",
    description:
      "Split your images into carousel-ready segments. Perfect for creating engaging multi-slide posts.",
    href: "/tools/instagram-carousel-splitter",
    icon: Scissors,
    category: "Instagram",
  },
  {
    name: "Instagram Grid Maker",
    description:
      "Transform your images into stunning grid layouts. Create cohesive, professional Instagram feeds.",
    href: "/tools/instagram-grid-maker",
    icon: Grid3x3,
    category: "Instagram",
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground">
      <LandingPageHeader />

      <main className="grow relative">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
          {/* Page Header */}
          <div className="mb-12 border-b-4 border-double border-foreground pb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="eyebrow mb-3 font-bold tracking-[0.25em]">
                  The Tool Shed
                </p>
                <h1 className="font-serif text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
                  Creative <br />
                  Utilities
                </h1>
              </div>
              <div className="hidden md:block font-mono text-xs uppercase tracking-wider text-foreground/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                  {tools.length} Tools Available
                </div>
              </div>
            </div>
            <p className="font-serif text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed">
              Free, browser-based tools to streamline your content creation
              workflow. No signup required.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative bg-surface border-2 border-foreground/20 hover:border-foreground transition-all duration-300 overflow-hidden"
                >
                  {/* Category Tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/40 border border-foreground/20 bg-background-editorial px-2 py-1">
                      {tool.category}
                    </span>
                  </div>

                  <div className="p-8 space-y-4">
                    {/* Icon */}
                    <div className="w-16 h-16 border-2 border-dashed border-foreground/30 bg-background-editorial/50 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all duration-300">
                      <Icon className="w-8 h-8 text-foreground/60 group-hover:text-brand-primary transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h2 className="font-serif text-2xl font-bold leading-tight group-hover:text-brand-primary transition-colors">
                        {tool.name}
                      </h2>
                      <p className="font-serif text-sm text-foreground/60 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Arrow CTA */}
                    <div className="pt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40 group-hover:text-brand-primary transition-colors">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>
              );
            })}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 p-8 border-2 border-dashed border-foreground/20 bg-surface/50 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/60 mb-2">
              More Tools Coming Soon
            </p>
            <p className="font-serif text-sm text-foreground/50 italic">
              We&rsquo;re constantly building new utilities to help creators
              work smarter, not harder.
            </p>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
