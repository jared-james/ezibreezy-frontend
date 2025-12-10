// app/(marketing)/editorial/page.tsx

import { getAllArticles } from "./_posts";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Minus } from "lucide-react";
import { Metadata } from "next";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Editorial | EziBreezy",
  description:
    "Insights on social strategy, content workflow, and the future of publishing.",
};

export default function EditorialIndex() {
  const allArticles = getAllArticles();

  const featured = allArticles[0];
  const sidebar = allArticles.slice(1, 4);
  const grid = allArticles.slice(4);

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Editorial | EziBreezy"
        description="Insights on social strategy, content workflow, and the future of publishing."
        url="https://www.ezibreezy.com/editorial"
      />

      <LandingPageHeader />

      <main className="grow px-4 md:px-6 pb-24 max-w-[1400px] mx-auto w-full">
        {/* MASTHEAD */}
        <div className="border-b-2 border-dotted border-foreground/40 py-12 md:py-20 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60 mb-2">
                The Daily Dispatch
              </span>
              <h1 className="text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                Editorial
              </h1>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-right flex flex-col gap-1 opacity-70">
              <p>Vol. 01 — 2025</p>
              <p>Strategy / Craft / Theory</p>
            </div>
          </div>
        </div>

        {/* THE FRONT PAGE LAYOUT */}
        <div className="flex flex-col lg:flex-row border-t-2 border-dotted border-foreground/40">
          {/* LEFT: Lead Story */}
          {featured && (
            <div className="lg:w-7/12 border-b-2 lg:border-b-0 lg:border-r-2 border-dotted border-foreground/40 p-6 md:p-10">
              {/* Removed justify-between to fix the gap issue */}
              <div className="flex flex-col gap-8 h-full">
                {/* Header Group */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-foreground text-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest font-bold">
                      Lead Story
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                      {featured.publishedAt}
                    </span>
                  </div>

                  <Link
                    href={`/editorial/${featured.slug}`}
                    className="no-underline! hover:no-underline!"
                  >
                    {/* Reduced font size slightly for better balance */}
                    <h2 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight text-foreground hover:text-foreground/80 transition-colors">
                      {featured.title}
                    </h2>
                  </Link>
                </div>

                {/* Excerpt & CTA Group */}
                <div className="flex flex-col gap-6 items-start max-w-2xl mt-auto lg:mt-0">
                  {/* Cleaned up styles: No italics, no quotes, normal size */}
                  <p className="text-lg text-foreground/80 leading-relaxed font-serif">
                    {featured.excerpt}
                  </p>

                  <Link
                    href={`/editorial/${featured.slug}`}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold border-b border-foreground hover:border-brand-primary hover:text-brand-primary transition-colors pb-1 no-underline!"
                  >
                    Read Full Story <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: The Sidebar */}
          <div className="lg:w-5/12 flex flex-col">
            {sidebar.map((article, index) => (
              <div
                key={article.slug}
                className={cn(
                  "flex flex-col gap-3 flex-1 p-6 md:p-8",
                  index !== sidebar.length - 1
                    ? "border-b-2 border-dotted border-foreground/40"
                    : ""
                )}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                    <span>No. {String(index + 2).padStart(2, "0")}</span>
                    <Minus className="w-3 h-3 text-foreground/20" />
                    <span>{article.publishedAt}</span>
                  </div>
                </div>

                <Link
                  href={`/editorial/${article.slug}`}
                  className="no-underline! hover:no-underline!"
                >
                  <h3 className="text-2xl md:text-3xl font-bold leading-none text-foreground hover:text-foreground/70 transition-colors">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2 font-serif">
                  {article.excerpt}
                </p>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/editorial/${article.slug}`}
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-foreground/60 border-b border-transparent hover:border-brand-primary hover:text-brand-primary transition-all !no-underline"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: THE ARCHIVE GRID */}
        {grid.length > 0 && (
          <>
            <div className="border-t-2 border-dotted border-foreground/40 mt-12 pt-4 mb-8 flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-widest font-bold">
                From The Archive
              </span>
              <span className="h-px flex-1 bg-foreground/20 mx-4 border-b border-dotted border-foreground/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {grid.map((article, i) => (
                <div
                  key={article.slug}
                  className="border-t border-dotted border-foreground/30 pt-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                      {article.publishedAt}
                    </span>
                  </div>

                  <Link
                    href={`/editorial/${article.slug}`}
                    className="no-underline! hover:no-underline!"
                  >
                    <h3 className="text-xl font-bold leading-tight text-foreground hover:text-brand-primary transition-colors">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-foreground/60 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="border-y-2 border-dotted border-foreground/20 py-3 mt-24 flex justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          <span>End of Section 1</span>
          <span>EziBreezy © 2025</span>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
