// app/(marketing)/features/twitter-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Crop,
  Type,
  Eye,
  AtSign,
  Sparkles,
  BarChart3,
  Repeat,
  Heart,
  MousePointer2,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { TwitterIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Twitter Scheduler | Threads, Polls & Analytics",
  description:
    "The editorial workspace for X (Twitter). Schedule threads, format tweets, and manage conversations from one desk.",
  alternates: {
    canonical: "/features/twitter-scheduler",
  },
  openGraph: {
    title: "Twitter Scheduler | EziBreezy",
    description:
      "The editorial workspace for X. Schedule threads, analyze impact, and engage.",
    url: "https://www.ezibreezy.com/features/twitter-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Twitter Scheduler",
      },
    ],
    type: "website",
  },
};

export default function TwitterSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Twitter Scheduler | Threads, Polls & Analytics"
        description="The editorial workspace for X (Twitter). Schedule threads, format tweets, and manage conversations from one desk."
        url="https://www.ezibreezy.com/features/twitter-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Twitter Scheduler"
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
                  Platform Specification: 04
                </span>
                <TwitterIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                Twitter / X
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The public square. <br />
                <span className="text-foreground/60 italic">
                  Brevity is the soul of wit.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation (Threads) */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                  {/* Thread Visual */}
                  <div className="max-w-sm mx-auto w-full space-y-4">
                    {/* Tweet 1 */}
                    <div className="bg-white p-4 border border-foreground/10 rounded-lg shadow-sm relative z-10">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20" />
                        <div className="flex-1">
                          <div className="h-2 w-24 bg-foreground/10 mb-2 rounded" />
                          <div className="space-y-1">
                            <div className="h-2 w-full bg-foreground/20 rounded" />
                            <div className="h-2 w-3/4 bg-foreground/20 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector Line */}
                    <div className="absolute left-[3.25rem] top-16 bottom-20 w-0.5 bg-foreground/10 -z-0" />

                    {/* Tweet 2 */}
                    <div className="bg-white p-4 border border-foreground/10 rounded-lg shadow-sm relative z-10 ml-8 transform rotate-1">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20" />
                        <div className="flex-1">
                          <div className="h-2 w-24 bg-foreground/10 mb-2 rounded" />
                          <div className="space-y-1">
                            <div className="h-2 w-full bg-foreground/20 rounded" />
                            <div className="h-2 w-1/2 bg-foreground/20 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                    Native Thread Construction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              The art of the
              <br />
              <span className="italic font-normal">short form.</span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  W
                </span>
                riting simply is often harder than writing at length. Every
                character counts. Every word must earn its place.
              </p>
              <p>
                The <strong>Editorial Desk</strong> helps you craft clarity.
                Whether it's a single powerful statement or a thoughtfully woven
                thread, we give you the tools to structure your thoughts so they
                land with impact.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Compose Your Thread{" "}
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
                Measure the
                <br />
                <span className="italic text-brand-primary">resonance.</span>
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
                Twitter moves fast. Analytics allow you to see the ripples your
                words create in real-time.
              </p>
              <p className="font-serif text-sm leading-relaxed text-foreground/70">
                Understand which topics spark conversation and which formats
                drive action. Turn the noise into a clear signal for your next
                move.
              </p>
            </div>

            {/* The Grid of Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
              {/* Metric 1 */}
              <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Eye className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Impressions
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Visibility
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See how many timelines your thoughts have graced. The total
                  reach of your voice.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <div className="mb-3 flex items-center gap-2">
                  <MousePointer2 className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
                </div>
                <h4 className="font-bold font-serif text-lg mb-1">
                  Profile Visits
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Curiosity
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track how many people stopped scrolling to learn more about
                  who you are.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Heart className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">Likes</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Appreciation
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  A simple signal of agreement. See which sentiments resonate
                  most.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Repeat className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">Retweets</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Amplification
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The highest compliment. Track who is spreading your message to
                  their own network.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <MessageSquare className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">Replies</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Conversation
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track the discussions you ignite. Identify the topics that
                  people want to talk about.
                </p>
              </div>

              {/* Metric 6 */}
              <div className="p-6 hover:bg-white transition-colors group">
                <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Link Clicks
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Conversion
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See how effectively your content drives traffic to your work,
                  newsletter, or portfolio.
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
                  The Wire
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        <p className="text-xs font-serif italic text-foreground/80">
                          "This thread changed how I look at..."
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
                <AtSign className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  The Correspondence Desk
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                Be present in
                <br />
                the moment.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  Twitter is a living, breathing conversation. It rewards those
                  who show up.
                </p>
                <p>
                  Our <strong>Unified Inbox</strong> gathers your Mentions,
                  Replies, and DMs into a single stream. It allows you to
                  participate in the dialogue without getting lost in the noise
                  of the timeline.
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
                  {/* Feature: Image Cropping */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Crop className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Image Cropping
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Crop to square, landscape, portrait, or story. Ensure
                        your media looks intentional, not accidental.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Text Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Text Publishing
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Publish text-only posts. We handle the character count
                        and threading logic for you.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Video Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Video className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Video Support
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Publish videos up to 250MB. Share clips, animations, and
                        moments directly to the feed.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Image Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        High-Res Images
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Publish images up to 5MB. Maintain the fidelity of your
                        photos and graphics.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Carousel */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Multi-Image Grid
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Tell a visual story. Publish carousels with up to 4
                        images that display as a clean grid in the feed.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Alt Text */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Eye className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Alt Text
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Add accessible alt text to images. Make your content
                        inclusive for everyone in your audience.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Mentions */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <AtSign className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Mention Users
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Tag collaborators and friends. Mention other Twitter
                        accounts directly in the composer.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Preview */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Sparkles className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Post Preview
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Preview how your post will look once published. Check
                        line breaks and media layout before you tweet.
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
                  Turn screenshots into aesthetic Twitter assets.
                </p>
              </div>
            </Link>

            <Link
              href="/tools/social-image-resizer"
              className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
            >
              <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
                16:9
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Image Resizer
                </h4>
                <p className="text-xs text-foreground/60">
                  Crop photos perfectly for the X feed.
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
              Make your statement.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Schedule your threads and join the
              public discourse.
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
