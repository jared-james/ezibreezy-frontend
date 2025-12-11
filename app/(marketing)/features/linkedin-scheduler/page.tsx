// app/(marketing)/features/linkedin-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  FileText,
  Users,
  TrendingUp,
  Sparkles,
  BarChart3,
  Globe,
  MessageSquare,
  Image as ImageIcon,
  Monitor,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { LinkedinIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "LinkedIn Scheduler | Articles, Carousels & Analytics",
  description:
    "The professional workspace for LinkedIn. Schedule PDF carousels, format articles, tag companies, and track visitor demographics.",
  alternates: {
    canonical: "/features/linkedin-scheduler",
  },
  openGraph: {
    title: "LinkedIn Scheduler | EziBreezy",
    description:
      "The professional record. Schedule, format, analyze, and engage.",
    url: "https://www.ezibreezy.com/features/linkedin-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy LinkedIn Scheduler",
      },
    ],
    type: "website",
  },
};

export default function LinkedInSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="LinkedIn Scheduler | Articles, Carousels & Analytics"
        description="The professional workspace for LinkedIn. Schedule PDF carousels, format articles, tag companies, and track visitor demographics."
        url="https://www.ezibreezy.com/features/linkedin-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy LinkedIn Scheduler"
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
                  Platform Specification: 02
                </span>
                <LinkedinIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                LinkedIn
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The professional record. <br />
                <span className="text-foreground/60 italic">
                  Your reputation, codified.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation (Document Carousel) */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="flex justify-between items-start opacity-40 mb-8">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-foreground/10 rounded-full" />
                      <div className="space-y-2">
                        <div className="w-32 h-3 bg-foreground/20" />
                        <div className="w-20 h-2 bg-foreground/10" />
                      </div>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-widest">
                      Fig 2. The Carousel
                    </div>
                  </div>

                  {/* The Document Visual */}
                  <div className="relative w-3/4 mx-auto aspect-[4/5] bg-white border border-foreground/10 shadow-lg transform rotate-2 transition-transform hover:rotate-0">
                    <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
                    <div className="p-6 flex flex-col h-full justify-center text-center">
                      <h3 className="font-serif text-3xl font-bold mb-4">
                        The Slide Deck
                      </h3>
                      <p className="font-serif text-sm text-foreground/60 leading-relaxed">
                        Stop scrolling.
                        <br />
                        Start reading.
                      </p>
                      <div className="mt-8 flex justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                      </div>
                    </div>
                  </div>

                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                    Native PDF Rendering
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              Write it once.
              <br />
              <span className="italic font-normal">Influence forever.</span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  O
                </span>
                n other platforms, you are fighting for attention. On LinkedIn,
                you are fighting for respect.
              </p>
              <p>
                The <strong>Editorial Desk</strong> treats your updates not as
                fleeting posts, but as articles of record. Whether it's a
                text-only observation, a swipeable carousel, or a video insight,
                we ensure it lands with the gravity it deserves.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Draft Your Article{" "}
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
                Know who is
                <br />
                <span className="italic text-brand-primary">in the room.</span>
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
                It matters less how many people saw it, and more <em>who</em>{" "}
                saw it. Are you reaching peers? Recruiters? Decision makers?
              </p>
              <p className="font-serif text-sm leading-relaxed text-foreground/70">
                Our intelligence report breaks down the professional identity of
                your audience, so you know if your message is landing in the
                right boardroom.
              </p>
            </div>

            {/* The Grid of Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
              {/* Metric 1 */}
              <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  The Network
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Follower Tracking
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track the net growth of your professional network over time.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <div className="mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <h4 className="font-bold font-serif text-lg mb-1">
                  The Profile
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Demographics
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Break down your followers and visitors by industry, region,
                  and job function.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Monitor className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  The Traffic
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Page Views
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See pageviews broken down by mobile and desktop devices.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Globe className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  The Source
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Visitors
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See how many people visit your page and filter by traffic
                  sources.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">The Echo</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Share Tracking
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track insights into how your posts are being shared across the
                  network.
                </p>
              </div>

              {/* Metric 6 */}
              <div className="p-6 hover:bg-white transition-colors group">
                <TrendingUp className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  The Impact
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Post Insights
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Break down specific posts by impressions, clicks, reactions,
                  and engagement rate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE INBOX (Public Discourse) --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Visual */}
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
                  Public Discourse
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        <p className="text-xs font-serif italic text-foreground/80">
                          "This perspective is refreshing. Have you considered
                          the impact on..."
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
                <MessageSquare className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  The Comment Section
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                The conversation is
                <br />
                the content.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  On LinkedIn, the post is just the opening statement. The real
                  value is created in the comments below it.
                </p>
                <p>
                  This is where you demonstrate expertise, answer questions, and
                  acknowledge your peers. Our <strong>Unified Inbox</strong>{" "}
                  brings every comment into one stream, ensuring you never leave
                  a thoughtful response hanging.
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
                  Publishing Capabilities
                </p>
              </div>

              <div className="md:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
                  {/* List Items styled like classified ads */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Document Carousels
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Upload up to 9 images or PDFs. We render them as native
                        swipeable documents, the highest engaging format on the
                        platform.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Rich Media
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Publish images and videos alongside your text. We handle
                        the compression to keep your visuals crisp.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Format Control
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Crop your images to Square, Landscape, Portrait, or
                        Story dimensions directly within the editor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Tag Pages
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Give credit where it is due. Tag other company pages by
                        simply typing @ to increase visibility and networking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Accessibility
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Add descriptive Alt Text to your images. Ensure your
                        insights are accessible to everyone in your network.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Post Preview
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        See exactly how your post will look on the feed before
                        you publish. No formatting surprises.
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

        {/* --- FINAL CTA --- */}
        <div className="relative py-20 px-6 text-center overflow-hidden border-t-2 border-foreground">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="mb-6 flex justify-center">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Build your authority.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Schedule your professional insights
              today.
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
