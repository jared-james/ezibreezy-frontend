// app/(marketing)/tools/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { PenTool } from "lucide-react";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import MinimalHeader from "@/components/shared/minimal-header";
import {
  WebPageJsonLd,
  SoftwareApplicationJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free Social Media Tools & Utilities for Creators | EziBreezy",
  description:
    "A suite of open-access editorial tools. Split carousels, plan grids, format text, and generate mockups without a subscription. No sign-up required.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Free Social Media Tools & Utilities",
    description:
      "Specialized instruments for the digital publisher. Screenshot beautifier, carousel splitter, grid planner, and more.",
    url: "https://www.ezibreezy.com/tools",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Tools Directory",
      },
    ],
    type: "website",
  },
  keywords: [
    "social media tools",
    "free instagram tools",
    "content creator utilities",
    "social media scheduling tools",
    "instagram grid planner free",
    "screenshot beautifier",
  ],
};

const tools = [
  {
    id: "01",
    name: "Screenshot Studio",
    description: "Wrap raw screenshots in aesthetic gradients and frames.",
    href: "/tools/screenshot-studio",
    category: "Design",
  },
  {
    id: "02",
    name: "Carousel Splitter",
    description: "Seamlessly slice panoramic images into carousel slides.",
    href: "/tools/instagram-carousel-splitter",
    category: "Instagram",
  },
  {
    id: "03",
    name: "Grid Maker",
    description: "Transform single images into 3x3, 3x4, or 3x5 profile grids.",
    href: "/tools/instagram-grid-maker",
    category: "Instagram",
  },
  {
    id: "04",
    name: "Grid Planner",
    description: "Curate your feed visually. Drag and drop photos to plan.",
    href: "/tools/instagram-grid-planner",
    category: "Instagram",
  },
  {
    id: "05",
    name: "Font Generator",
    description: "Generate bold, italic, and script fonts for your Bio.",
    href: "/tools/instagram-font-generator",
    category: "Instagram",
  },
  {
    id: "06",
    name: "Text Formatter",
    description: "Convert standard text into bold, italic, or script variants.",
    href: "/tools/linkedin-text-formatter",
    category: "LinkedIn",
  },
  {
    id: "07",
    name: "Title Checker",
    description:
      "Analyze video titles for truncation and click-through impact.",
    href: "/tools/youtube-title-checker",
    category: "YouTube",
  },
  {
    id: "08",
    name: "Social Resizer",
    description:
      "Crop once, export for Instagram, X, and LinkedIn simultaneously.",
    href: "/tools/social-image-resizer",
    category: "Design",
  },
];

export default function ToolsPage() {
  return (
    <>
      <WebPageJsonLd
        title="Free Social Media Tools & Utilities"
        description="A curated list of free tools for content creators, including grid planners, font generators, and screenshot beautifiers."
        url="https://www.ezibreezy.com/tools"
      />
      <SoftwareApplicationJsonLd />
      <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif">
        <MinimalHeader />

        <main className="grow">
          <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between border-b-4 border-double border-foreground pb-8 mb-12">
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
                  Specialized instruments for the digital publisher. Open
                  access. No subscription required.
                </p>
              </div>
            </div>

            <div className="flex flex-col border-t-2 border-foreground">
              <div className="hidden md:grid grid-cols-12 gap-6 py-3 border-b border-foreground/20 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                <div className="col-span-1">ID</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-5">Utility Name</div>
                <div className="col-span-4">Description</div>
              </div>

              {tools.map((tool) => {
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-6 py-6 md:py-8 border-b border-foreground/20 hover:bg-surface transition-colors items-start no-underline hover:no-underline"
                  >
                    <div className="col-span-1 font-mono text-xs font-bold text-foreground/40 group-hover:text-brand-primary transition-colors pt-2">
                      #{tool.id}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <h2 className="font-serif text-2xl font-black uppercase tracking-tight text-foreground/30 group-hover:text-foreground/50 transition-colors whitespace-nowrap">
                        {tool.category}
                      </h2>
                    </div>

                    <div className="col-span-1 md:col-span-5">
                      <h2 className="font-serif text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-brand-primary transition-colors whitespace-nowrap">
                        {tool.name}
                      </h2>
                    </div>

                    <div className="col-span-1 md:col-span-4">
                      <p className="font-serif text-base text-foreground/70 leading-relaxed pr-4 pt-1">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                );
              })}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 md:py-8 border-b border-dashed border-foreground/30 opacity-50 bg-foreground/5 items-center cursor-not-allowed">
                <div className="col-span-1 font-mono text-xs font-bold text-foreground/40">
                  #--
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h2 className="font-serif text-2xl font-black uppercase tracking-tight text-foreground/20 whitespace-nowrap">
                    Upcoming
                  </h2>
                </div>
                <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                  <PenTool className="w-4 h-4 text-foreground/40" />
                  <h3 className="font-serif text-2xl font-black uppercase tracking-tight text-foreground/40 whitespace-nowrap">
                    More Soon
                  </h3>
                </div>
                <div className="col-span-1 md:col-span-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                    Utilities Vol. 2 In Development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <LandingPageFooter />
      </div>
    </>
  );
}
