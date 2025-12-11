// app/(marketing)/features/youtube-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, Video, FileText, Sparkles, Lock } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { YoutubeIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "YouTube Scheduler | Schedule YouTube Videos & Shorts | EziBreezy",
  description:
    "Schedule YouTube videos and Shorts with custom thumbnails. The creator workspace for YouTube publishers. Drag-and-drop calendar, SEO metadata, multi-platform publishing.",
  alternates: {
    canonical: "/features/youtube-scheduler",
  },
  openGraph: {
    title: "YouTube Scheduler | EziBreezy",
    description:
      "Schedule YouTube videos and Shorts with custom thumbnails. The creator workspace for YouTube publishers.",
    url: "https://www.ezibreezy.com/features/youtube-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy YouTube Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "youtube scheduler",
    "youtube video scheduler",
    "schedule youtube videos",
    "youtube shorts scheduler",
    "youtube content scheduler",
    "youtube scheduling tool",
    "schedule youtube shorts",
  ],
};

export default function YouTubeSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="YouTube Scheduler | Schedule YouTube Videos & Shorts | EziBreezy"
        description="Schedule YouTube videos and Shorts with custom thumbnails. The creator workspace for YouTube publishers."
        url="https://www.ezibreezy.com/features/youtube-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy YouTube Scheduler"
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
                <YoutubeIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                YouTube
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule YouTube videos and Shorts from one editorial desk.
                Manage metadata, thumbnails, and publishing. Draft once, refine per platform, ship with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/youtube-title-checker"
                  className="inline-flex items-center justify-center gap-3 border-2 border-foreground/30 text-foreground px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
                >
                  Try Title Checker Free
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* YOUTUBE-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              YouTube-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Smart Format Detection */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Smart Format Detection</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Upload standard long-form videos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Auto-detects vertical videos under 60s as YouTube Shorts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your video will appear before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Rich Metadata */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Rich Metadata</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Full control over Titles (100 chars) and Descriptions (5k chars).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Manage Tags and Categories for SEO discovery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your video details will look before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Custom Thumbnails */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Custom Thumbnails</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Upload separate custom cover images for your videos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Optimize thumbnails for maximum click-through rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview thumbnail appearance across different devices.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Compliance & Privacy */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Compliance & Privacy</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Full COPPA &apos;Made for Kids&apos; flag support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Set visibility to Public, Private, or Unlisted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Proactive token refresh prevents failure during long uploads.</span>
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
                Your entire strategy at a glance. Schedule YouTube videos alongside TikTok, Instagram Reels,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <Video className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Multi-Platform Video Distribution</h3>
              <p className="text-foreground/80 leading-relaxed">
                Upload once, publish everywhere. Schedule the same video to YouTube Shorts, TikTok,
                and Instagram Reels simultaneously. Maximize reach with minimal effort.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your description, select YouTube and other channels, make platform-specific
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
              Built for YouTube Creators
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Content Creators & Influencers</h3>
              <p className="text-foreground/80 leading-relaxed">
                Plan your YouTube content calendar weeks in advance. Schedule long-form videos and Shorts
                for optimal posting times. Maintain consistent upload schedule to grow your subscriber base.
                Cross-post Shorts to TikTok and Instagram Reels to maximize reach.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Media Companies</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple YouTube channels for different clients or brands. Schedule campaigns across
                YouTube and other platforms simultaneously. Get approval on metadata and thumbnails before
                videos go live. Track performance across all channels from one dashboard.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Educational & Tutorial Channels</h3>
              <p className="text-foreground/80 leading-relaxed">
                Schedule educational series with detailed descriptions and proper categorization. Manage
                tags for SEO discovery. Upload custom thumbnails that clearly communicate video topics.
                Set appropriate audience flags for educational content compliance.
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
                Can I schedule YouTube Shorts?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy automatically detects vertical videos under 60 seconds as YouTube Shorts
                and schedules them appropriately. Schedule Shorts to TikTok and Instagram Reels at the same time.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I upload custom thumbnails for scheduled videos?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload separate custom cover images for your videos to optimize click-through rates.
                Preview how thumbnails will appear before scheduling your video.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I manage video metadata like titles, descriptions, and tags?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Full control over titles (100 characters), descriptions (5,000 characters), tags,
                and categories. Optimize your metadata for SEO discovery and viewer engagement.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I set privacy settings for scheduled YouTube videos?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Set visibility to Public, Private, or Unlisted. Control COPPA compliance with
                &apos;Made for Kids&apos; flags. Full privacy and audience control before your video goes live.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule the same video to YouTube, TikTok, and Instagram Reels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload once in the Editorial Desk, select YouTube Shorts, TikTok, and Instagram Reels,
                make platform-specific adjustments to metadata, and schedule to all platforms at once.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Grow Your YouTube Channel with Strategic Scheduling
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop missing upload schedules. Plan your YouTube content in advance, maintain consistent
            publishing, and grow your audience with strategic planning.
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
