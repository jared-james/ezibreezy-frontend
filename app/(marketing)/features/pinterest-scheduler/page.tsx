// app/(marketing)/features/pinterest-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  Pin,
  Layout,
  Link as LinkIcon,
  Sparkles,
  BarChart3,
  Eye,
  MousePointer2,
  Bookmark,
  Users,
  Image as ImageIcon,
  Video,
  Type,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { PinterestIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Pinterest Scheduler | Board Management & Pin Planner",
  description:
    "The visual workspace for Pinterest. Schedule Pins, manage Boards, and drive long-tail traffic from one editorial desk.",
  alternates: {
    canonical: "/features/pinterest-scheduler",
  },
  openGraph: {
    title: "Pinterest Scheduler | EziBreezy",
    description: "The curator's archive. Schedule, organize, and inspire.",
    url: "https://www.ezibreezy.com/features/pinterest-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Pinterest Scheduler",
      },
    ],
    type: "website",
  },
};

export default function PinterestSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Pinterest Scheduler | Board Management & Pin Planner"
        description="The visual workspace for Pinterest. Schedule Pins, manage Boards, and drive long-tail traffic."
        url="https://www.ezibreezy.com/features/pinterest-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Pinterest Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        {/* --- MASTHEAD --- */}
        <header className="border-b-4 border-double border-foreground py-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                  Platform Specification: 08
                </span>
                <PinterestIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                Pinterest
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The visual archive. <br />
                <span className="text-foreground/60 italic">
                  Where ideas find their home.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation (Mood Board) */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                  {/* Pin Layout Visual */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                    {/* Left Column (Staggered) */}
                    <div className="flex flex-col gap-4">
                      <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                        <div className="aspect-[2/3] bg-gray-100 rounded-md mb-2 relative overflow-hidden group">
                          <div className="absolute top-2 right-2 p-1.5 bg-brand-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pin className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="h-2 w-16 bg-foreground/10 rounded" />
                      </div>
                      <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                        <div className="aspect-square bg-gray-100 rounded-md mb-2" />
                        <div className="h-2 w-20 bg-foreground/10 rounded" />
                      </div>
                    </div>

                    {/* Right Column (Staggered) */}
                    <div className="flex flex-col gap-4 pt-8">
                      <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                        <div className="aspect-[3/4] bg-gray-100 rounded-md mb-2" />
                        <div className="h-2 w-12 bg-foreground/10 rounded" />
                      </div>
                      <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                        <div className="aspect-[2/3] bg-gray-100 rounded-md mb-2 relative">
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                          </div>
                        </div>
                        <div className="h-2 w-24 bg-foreground/10 rounded" />
                      </div>
                    </div>
                  </div>

                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                    Visual Curation Engine
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              Curate your
              <br />
              <span className="italic font-normal">legacy.</span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  O
                </span>
                ther platforms are about <em>now</em>. Pinterest is about{" "}
                <em>next</em>. It is where people go to plan their futures, not
                just scroll through their present.
              </p>
              <p>
                The <strong>Editorial Desk</strong> helps you build a library
                that lasts. Organize your inspiration, schedule your pins, and
                create a resource that people will return to for years to come.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Build Your Archive{" "}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: ANALYTICS (Market Intelligence) --- */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold bg-foreground text-background px-2 py-1">
              Market Intelligence
            </h3>
            <div className="h-px flex-1 bg-foreground" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 border border-foreground">
            {/* Lead: The Philosophy of Data */}
            <div className="p-8 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-foreground bg-background-editorial">
              <h2 className="font-serif text-3xl font-bold leading-none mb-6">
                Map the
                <br />
                <span className="italic text-brand-primary">intent.</span>
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
                A Pin isn't just an image; it's a bookmark for a future action.
                Analytics on Pinterest reveal what your audience is planning to
                do.
              </p>
              <p className="font-serif text-sm leading-relaxed text-foreground/70">
                Understand which ideas are resonating and which visuals are
                driving people off the platform and onto your site.
              </p>
            </div>

            {/* The Grid of Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
              {/* Metric 1 */}
              <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <MousePointer2 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Outbound Clicks
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Traffic
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The most valuable metric. See how many people are leaving
                  Pinterest to visit your website.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <div className="mb-3 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
                </div>
                <h4 className="font-bold font-serif text-lg mb-1">Saves</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Intent
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The digital equivalent of tearing a page from a magazine. See
                  what people are keeping.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Eye className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Impressions
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Discovery
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See how often your Pins are appearing in search results and
                  home feeds.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Total Audience
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Reach
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The total number of unique people who have seen or engaged
                  with your Pins.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Layout className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Top Boards
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Curation
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Identify which of your collections are performing best and
                  attracting the most attention.
                </p>
              </div>

              {/* Metric 6 */}
              <div className="p-6 hover:bg-white transition-colors group">
                <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Engaged Audience
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Action
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The number of people who interacted with your Pins (clicks,
                  saves, reactions).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE INBOX (Engagement) --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Visual */}
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
                  Gallery Floor
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        <p className="text-xs font-serif italic text-foreground/80">
                          "Tried this tutorial last weekend. The results were
                          amazing!"
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-foreground/20" />
                        <span className="font-mono text-[9px] uppercase text-brand-primary font-bold">
                          Reply Sent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="mb-6 flex items-center gap-2 text-brand-primary">
                <Pin className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  Community Feedback
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                Inspire a<br />
                reaction.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  When someone tries your idea, they are bringing your vision
                  into their reality. That moment deserves acknowledgement.
                </p>
                <p>
                  Our <strong>Unified Inbox</strong> keeps track of comments and
                  "tries" on your Pins, so you can encourage your community and
                  see the real-world impact of your curation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: THE CLASSIFIEDS (Technical Specs) --- */}
        <section className="mb-24">
          <div className="border-t-4 border-double border-foreground pt-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3 pt-6">
                <h3 className="font-serif text-3xl font-bold leading-none mb-2">
                  Technical
                  <br />
                  Ledger
                </h3>
                <p className="font-mono text-xs text-foreground/60">
                  Curation Capabilities
                </p>
              </div>

              <div className="md:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
                  {/* List Items styled like classified ads */}

                  {/* Feature: Multi-Account */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Users className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Accounts
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Manage multiple identities. Connect any Pinterest
                        account and switch between client portfolios or brand
                        verticals instantly.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Scheduler */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Pin className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Direct Scheduling
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Set it and forget it. Schedule Pins to go live at
                        specific times to capture your audience when they are
                        most active.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Board Management */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Layout className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Board Organization
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Create new Boards directly from the composer. Ensure
                        every Pin finds its perfect home in your structured
                        library.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Traffic (Links) */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <LinkIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Destination Links
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Drive traffic where it matters. Add destination URLs to
                        every Pin to turn inspiration into website visits.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Accessibility */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Accessible Features
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Add descriptive Alt Text to your scheduled images.
                        Improve SEO discovery while making your content
                        inclusive.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Video Pins */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Video className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Video Pins
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Motion grabs attention. Upload video Pins with custom
                        covers to stand out in a static feed.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Rich Details */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Rich Details
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Add keyword-rich titles and descriptions (up to 500
                        chars) to ensure your content is found by the right
                        people.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Image Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Visual Fidelity
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        We support high-resolution uploads. Your visuals are the
                        product; we ensure they look pristine.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: RELATED UTILITIES (Sidebar style) --- */}
        <section className="bg-foreground/5 border border-foreground p-8 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Scissors className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              Complementary Tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tools/social-image-resizer"
              className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
            >
              <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
                2:3
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Image Resizer
                </h4>
                <p className="text-xs text-foreground/60">
                  Crop perfectly for Pinterest (2:3).
                </p>
              </div>
            </Link>

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
                  Create aesthetic Pin graphics instantly.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <div className="relative py-20 px-6 text-center overflow-hidden border-t-2 border-foreground">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="mb-6 flex justify-center">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Organize your inspiration.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Curate your boards, schedule your
              vision, and build your archive.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block bg-foreground text-background px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-primary hover:text-white transition-all duration-300"
            >
              Get Early Access
            </Link>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
              Limited Availability • Editorial Standards Applied
            </p>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
