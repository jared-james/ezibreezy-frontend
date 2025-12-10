import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import {
  Newspaper,
  PenTool,
  Grid3X3,
  Users,
  Target,
  Scissors,
  Feather,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About EziBreezy | The Editorial Social Media Content Planner",
  description:
    "We are building the operating system for publishers. A visual social media scheduler designed to replace spreadsheet calendars and chaotic workflows.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About EziBreezy",
    description: "The story behind the editorial desk for social media.",
    url: "https://www.ezibreezy.com/about",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "The EziBreezy Editorial Mission",
      },
    ],
    type: "website",
  },
};

export default function AboutPage() {
  // Organization Schema to establish Entity Identity with Google
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EziBreezy",
    url: "https://www.ezibreezy.com",
    logo: "https://www.ezibreezy.com/icon.png",
    sameAs: [
      "https://twitter.com/ezibreezy_app",
      "https://www.instagram.com/ezibreezy_app",
      "https://www.linkedin.com/company/ezibreezy",
    ],
    foundingDate: "2025",
    description:
      "The editorial operating system for modern social media publishers.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif">
      <WebPageJsonLd
        title="About EziBreezy | The Editorial Social Media Content Planner"
        description="We are building the operating system for publishers. A visual social media scheduler designed to replace spreadsheet calendars."
        url="https://www.ezibreezy.com/about"
      />

      {/* Inject Organization Schema manually */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <LandingPageHeader />

      <main className="grow">
        {/* HERO SECTION */}
        <section className="relative px-6 pt-12 pb-24 border-b-2 border-foreground">
          <div className="mx-auto w-full max-w-7xl">
            {/* Header Meta */}
            <div className="mb-8 flex items-center justify-between border-b-4 border-double border-foreground pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-brand-primary text-brand-primary-foreground px-2 py-1 font-mono text-[10px] uppercase tracking-widest font-bold">
                  Our Mission
                </span>
                <span className="hidden sm:inline font-mono text-xs uppercase tracking-widest text-foreground/60">
                  Est. 2025
                </span>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                Vol. 01 — The Manifesto
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              <div className="lg:col-span-8">
                <h1 className="font-serif text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                  Stop posting. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                    Start Publishing.
                  </span>
                </h1>
                <p className="font-serif text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-3xl">
                  Social media shouldn't feel like a data entry job. We are
                  building the workspace that treats your content with the
                  respect it deserves.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-end">
                <div className="border-l-4 border-foreground pl-6 py-2">
                  <p className="font-mono text-xs uppercase tracking-widest text-foreground/60 mb-2">
                    The Problem
                  </p>
                  <p className="font-serif italic text-lg text-foreground">
                    "Creativity dies in spreadsheets. You cannot visualize a
                    brand aesthetic inside a cell block."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NARRATIVE SECTION */}
        <section className="relative px-6 py-24">
          <div className="mx-auto w-full max-w-4xl">
            {/* Cut Line Decoration */}
            <div className="mb-16 flex items-center gap-2 text-foreground/40">
              <Scissors className="h-4 w-4 -rotate-90" />
              <div className="flex-1 border-b border-dashed border-foreground/40" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                The Origin Story
              </span>
            </div>

            <div className="prose prose-lg prose-stone mx-auto font-serif text-foreground/90">
              <p className="lead text-2xl font-medium mb-8">
                <span className="float-left text-6xl font-black mr-3 mt-[-10px] font-serif">
                  T
                </span>
                he tools available to creators today are built for{" "}
                <em>scheduling</em>, not <strong>creating</strong>. They assume
                you already have the image, the caption, and the strategy ready
                to go.
              </p>

              <p>
                But the hard part isn't picking a time slot—it's the messy
                process before that. The ideation. The drafting. The visual
                planning.
              </p>

              <p>
                For years, we managed brands using a Frankenstein monster of
                tools: Google Sheets for calendars, Dropbox for assets, Slack
                for approvals, and a scheduler just to push the button. It was
                chaotic. It was uninspiring.
              </p>

              <div className="my-12 p-8 border-2 border-dashed border-brand-primary bg-surface-hover relative">
                <div className="absolute -top-3 left-6 bg-brand-primary text-brand-primary-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest font-bold">
                  Core Belief
                </div>
                <p className="text-xl font-bold text-center italic text-brand-primary">
                  "We believe that high-quality content comes from clarity, not
                  chaos."
                </p>
              </div>

              <p>
                That is why we built EziBreezy. It is not just a scheduler; it
                is an <strong>Editorial Desk</strong>. A workspace designed to
                respect the creative process while giving you the power of a
                publishing house.
              </p>
            </div>
          </div>
        </section>

        {/* VALUES GRID */}
        <section className="bg-foreground text-background-editorial py-24 px-6 border-t-2 border-foreground">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Our Editorial Standards
              </h2>
              <div className="h-1 w-24 bg-brand-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="group border border-background-editorial/20 p-8 hover:bg-background-editorial/5 transition-colors">
                <div className="w-12 h-12 rounded-full border border-brand-primary/50 flex items-center justify-center mb-6 text-brand-primary">
                  <Grid3X3 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">
                  Visual First
                </h3>
                <p className="font-serif text-background-editorial/70 leading-relaxed">
                  You can't plan a grid in a spreadsheet. We build tools that
                  let you see your brand the way your audience sees it.
                </p>
              </div>

              {/* Value 2 */}
              <div className="group border border-background-editorial/20 p-8 hover:bg-background-editorial/5 transition-colors">
                <div className="w-12 h-12 rounded-full border border-brand-primary/50 flex items-center justify-center mb-6 text-brand-primary">
                  <Feather className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">
                  Craft over Clickbait
                </h3>
                <p className="font-serif text-background-editorial/70 leading-relaxed">
                  We don't chase "hacks." We build for consistency, quality, and
                  sustainable growth. No algorithm chasing, just good
                  storytelling.
                </p>
              </div>

              {/* Value 3 */}
              <div className="group border border-background-editorial/20 p-8 hover:bg-background-editorial/5 transition-colors">
                <div className="w-12 h-12 rounded-full border border-brand-primary/50 flex items-center justify-center mb-6 text-brand-primary">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">
                  Open Access
                </h3>
                <p className="font-serif text-background-editorial/70 leading-relaxed">
                  Our utilities (like the Grid Planner) are free because we
                  believe basic creative tools shouldn't be paywalled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM / FOOTER NOTE */}
        <section className="px-6 py-24 bg-background-editorial">
          <div className="mx-auto w-full max-w-2xl text-center">
            <Newspaper className="w-12 h-12 mx-auto mb-6 text-foreground/20" />

            <h2 className="font-serif text-3xl font-bold mb-6">
              Built by Creators, for Creators.
            </h2>

            <p className="font-serif text-lg text-foreground/70 mb-10">
              We are a small, independent team obsessed with design and
              workflow. We don't answer to VC boards; we answer to the people
              who use our tools every day.
            </p>

            <div className="inline-flex items-center justify-center gap-8 border-t border-b border-foreground/10 py-6 w-full">
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-foreground">
                  100%
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  Bootstrapped
                </p>
              </div>
              <div className="w-px h-12 bg-foreground/10" />
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-foreground">
                  24/7
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                  Obsession
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </div>
  );
}
