// app/(marketing)/features/tiktok-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, Video, Lock, Sparkles, TrendingUp } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { TikTokIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "TikTok Scheduler | Schedule TikTok Videos & Photo Posts | EziBreezy",
  description:
    "Schedule TikTok videos and photo carousels with preview. The creative workspace for TikTok creators. Drag-and-drop calendar, privacy controls, multi-platform publishing.",
  alternates: {
    canonical: "/features/tiktok-scheduler",
  },
  openGraph: {
    title: "TikTok Scheduler | EziBreezy",
    description:
      "Schedule TikTok videos and photo carousels with preview. The creative workspace for TikTok creators.",
    url: "https://www.ezibreezy.com/features/tiktok-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy TikTok Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "tiktok scheduler",
    "tiktok post scheduler",
    "schedule tiktok videos",
    "tiktok content scheduler",
    "tiktok publishing tool",
    "tiktok scheduling tool",
    "schedule tiktok posts",
  ],
};

export default function TikTokSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="TikTok Scheduler | Schedule TikTok Videos & Photo Posts | EziBreezy"
        description="Schedule TikTok videos and photo carousels with preview. The creative workspace for TikTok creators."
        url="https://www.ezibreezy.com/features/tiktok-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy TikTok Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow px-4 md:px-6 pb-24 max-w-[1400px] mx-auto w-full">
        {/* HERO SECTION */}
        <div className="border-b-2 border-dotted border-foreground/40 py-16 md:py-24 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <TikTokIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                TikTok
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule TikTok videos and photo carousels from one editorial desk.
                Plan your content calendar weeks in advance. Draft once, refine per platform, ship with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="w-full md:w-auto md:shrink-0 p-8 border-2 border-foreground/20 bg-surface-hover/30">
              <div className="w-48 h-80 border-2 border-foreground/20 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-foreground/10" />
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <div className="h-2 bg-foreground/20 rounded w-3/4" />
                  <div className="h-2 bg-foreground/10 rounded w-1/2" />
                </div>
              </div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/60 text-center mt-4">
                Video Preview Included
              </p>
            </div>
          </div>
        </div>

        {/* TIKTOK-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              TikTok-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Video & Photo Content */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Videos & Photo Carousels</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Share engaging video content up to 10 minutes long.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create photo carousels with up to 35 images per post.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your post will look before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Intelligent Processing */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Intelligent Processing</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Automatic chunked uploads for large video files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Real-time status tracking confirms your post is live.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Optimized upload process for faster publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Privacy Controls */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Complete Privacy Control</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Set visibility: Public, Friends, Followers, or Private.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Disable comments, duets, or stitching on any post.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Full control over who can interact with your content.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Creator Tools */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Creator & Brand Tools</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Mark content as branded/sponsored.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Enable Brand Organic mode for partnerships.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Automatic trending music suggestions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CORE SCHEDULING FEATURES */}
        <div className="mb-20 p-10 border-2 border-foreground/20 bg-background">
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
              Core Scheduling
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mt-2">
              The Editorial Workflow You Deserve
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Calendar className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Drag-and-Drop Calendar</h3>
              <p className="text-foreground/80 leading-relaxed">
                Your entire strategy at a glance. Schedule TikTok videos alongside Instagram Reels,
                YouTube Shorts, and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <Video className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Multi-Platform Video Distribution</h3>
              <p className="text-foreground/80 leading-relaxed">
                Upload once, publish everywhere. Schedule the same video to TikTok, Instagram Reels,
                and YouTube Shorts simultaneously. Maximize reach with minimal effort.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your caption, select TikTok and other channels, make platform-specific
                tweaks, and ship it all without leaving the desk.
              </p>
            </div>
          </div>
        </div>

        {/* USE CASES */}
        <div className="mb-20">
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
              Use Cases
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mt-2">
              Built for TikTok Creators
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Content Creators & Influencers</h3>
              <p className="text-foreground/80 leading-relaxed">
                Plan your TikTok content calendar weeks in advance. Schedule videos for optimal posting
                times when your audience is most active. Maintain consistent presence without burnout.
                Cross-post to Instagram Reels and YouTube Shorts to maximize your content&apos;s reach.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Social Media Teams</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple TikTok accounts for different clients or brands. Get approval on content
                before it goes live. Schedule campaigns across TikTok and other platforms simultaneously.
                Track performance and engagement across all accounts from one dashboard.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Brands & E-commerce</h3>
              <p className="text-foreground/80 leading-relaxed">
                Launch product campaigns on TikTok with scheduled content. Create photo carousels
                showcasing your products. Use branded content partnerships to amplify reach. Schedule
                TikTok Shop promotions alongside your organic content strategy.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mt-2">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule TikTok videos?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy supports scheduling TikTok videos up to 10 minutes long with automatic
                chunked uploads for large files. Real-time status tracking confirms when your video is live.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule TikTok photo carousels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create and schedule photo carousels with up to 35 images per post. Perfect for
                showcasing products, sharing tips, or telling visual stories.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I control privacy settings for scheduled TikTok posts?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Set visibility (Public, Friends, Followers, or Private) and control who can comment,
                duet, or stitch your content. Full privacy control before you schedule.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule the same video to TikTok and Instagram Reels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload once in the Editorial Desk, select TikTok, Instagram Reels, and YouTube Shorts,
                make platform-specific adjustments, and schedule to all platforms at once.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Does EziBreezy support branded content partnerships on TikTok?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Mark content as branded/sponsored and enable Brand Organic mode for partnership
                campaigns. Maintain transparency with your audience while maximizing brand collaboration opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Schedule TikTok Content Like a Pro
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop scrambling for daily content. Plan your TikTok calendar weeks in advance, maintain
            consistent posting, and grow your audience with strategic scheduling.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-3 bg-background text-foreground px-10 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider opacity-70">
            Free 14-day trial • No credit card required
          </p>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
