// app/(marketing)/features/youtube-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  Video,
  Smartphone,
  Lock,
  FileText,
  Sparkles,
  BarChart3,
  Eye,
  Users,
  Play,
  MessageSquare,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { YoutubeIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "YouTube Scheduler | Shorts, Video & Community Posts",
  description:
    "The creator workspace for YouTube. Schedule Shorts and long-form video, manage metadata, and handle community posts from one desk.",
  alternates: {
    canonical: "/features/youtube-scheduler",
  },
  openGraph: {
    title: "YouTube Scheduler | EziBreezy",
    description:
      "The broadcast station. Schedule, optimize, and grow your channel.",
    url: "https://www.ezibreezy.com/features/youtube-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy YouTube Scheduler",
      },
    ],
    type: "website",
  },
};

export default function YouTubeSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="YouTube Scheduler | Shorts, Video & Community Posts"
        description="The creator workspace for YouTube. Schedule Shorts and long-form video, manage metadata, and handle community posts."
        url="https://www.ezibreezy.com/features/youtube-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy YouTube Scheduler"
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
                  Platform Specification: 06
                </span>
                <YoutubeIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                YouTube
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The broadcast station. <br />
                <span className="text-foreground/60 italic">
                  Where stories become legacy.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation (Video Player) */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                  {/* Video Player Mockup */}
                  <div className="w-full aspect-video bg-black relative group cursor-pointer overflow-hidden border border-foreground/10 shadow-xl">
                    {/* Thumbnail Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-700 opacity-80" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play
                          className="w-6 h-6 text-white ml-1"
                          fill="currentColor"
                        />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                      <div className="h-full w-1/3 bg-red-600" />
                    </div>

                    {/* Metadata Overlay */}
                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex justify-between items-start text-white">
                        <h3 className="font-sans font-bold text-lg drop-shadow-md">
                          The Art of Storytelling
                        </h3>
                        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono">
                          SCHEDULED
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/60">
                        Upload Complete
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-brand-primary font-bold">
                      4K Resolution
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              Your content is
              <br />
              <span className="italic font-normal">an asset.</span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  V
                </span>
                ideo is not just another post type. It is an investment. It
                requires time, craft, and vision.
              </p>
              <p>
                The <strong>Editorial Desk</strong> treats your uploads with the
                care they deserve. We handle the technical details—metadata,
                thumbnails, privacy settings—so you can focus on the story you
                are trying to tell.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Schedule Your Premiere{" "}
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
                Listen to the
                <br />
                <span className="italic text-brand-primary">signal.</span>
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
                Views are validation, but retention is truth. Analytics tell you
                not just how many people clicked, but how many people cared.
              </p>
              <p className="font-serif text-sm leading-relaxed text-foreground/70">
                Our intelligence report helps you understand your audience's
                behavior, so you can create more of what they love.
              </p>
            </div>

            {/* The Grid of Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
              {/* Metric 1 */}
              <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Subscribers
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Loyalty
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track the growth of your dedicated audience. See who is
                  signing up for the long haul.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <div className="mb-3 flex items-center gap-2">
                  <Play className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
                </div>
                <h4 className="font-bold font-serif text-lg mb-1">
                  Video Views
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Reach
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See the total footprint of your library. Track which videos
                  continue to perform over time.
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
                  Understand how often your thumbnails are appearing in search
                  and recommendations.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Smartphone className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Shorts Views
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Momentum
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track the performance of your short-form content in the Shorts
                  Feed.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Watch Time
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Attention
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The metric that matters most. See how many hours your audience
                  has spent with you.
                </p>
              </div>

              {/* Metric 6 */}
              <div className="p-6 hover:bg-white transition-colors group">
                <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Engagement
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Interaction
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track likes, comments, and shares to see which videos spark a
                  reaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE INBOX (Community) --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Visual */}
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
                  Viewer Feedback
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        <p className="text-xs font-serif italic text-foreground/80">
                          "I've been subscribed for 3 years and this is your
                          best work yet."
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-foreground/20" />
                        <span className="font-mono text-[9px] uppercase text-brand-primary font-bold">
                          Hearted & Replied
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
                  Community Management
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                Turn viewers into
                <br />a community.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  A comment is a viewer taking the time to say, "I am here." It
                  is an opportunity to turn a passive watcher into a loyal fan.
                </p>
                <p>
                  Our <strong>Unified Inbox</strong> helps you manage the
                  conversation. Reply to comments, heart the best ones, and
                  build the kind of community that shows up for every upload.
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
                  Broadcast Capabilities
                </p>
              </div>

              <div className="md:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
                  {/* List Items styled like classified ads */}

                  {/* Feature: Shorts */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Smartphone className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Shorts Publishing
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Capture the vertical feed. Publish videos up to 60
                        seconds long. We automatically detect the format and
                        optimize for the Shorts shelf.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Privacy */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Lock className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Privacy Control
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Control the release. Set your status to Private for
                        drafts, Unlisted for exclusive access, or Public when
                        you are ready to go live.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Titles */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Optimized Titles
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Write titles that get clicked. Use our integrated
                        checker to ensure your hook doesn't get truncated on
                        mobile devices.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Descriptions */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <FileText className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Rich Descriptions
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Add context, links, and timestamps. Format your
                        description to help SEO and guide viewers to your other
                        content.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Carousels (Community) */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Community Posts
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Engage between uploads. Publish image carousels (up to
                        10 slides) to your Community Tab to keep the
                        conversation going.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Thumbnails */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Sparkles className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Custom Thumbnails
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        The first impression matters. Upload custom high-res
                        thumbnails that stand out in a crowded subscription
                        feed.
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
              href="/tools/youtube-title-checker"
              className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
            >
              <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
                T
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Title Checker
                </h4>
                <p className="text-xs text-foreground/60">
                  Preview truncation and CTR.
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
                  Thumbnail Resizer
                </h4>
                <p className="text-xs text-foreground/60">
                  Ensure your thumbs look perfect.
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
              Own your channel.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Organize your library, schedule your
              premieres, and grow your legacy.
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
