// app/(marketing)/features/twitter-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, MessageSquare, Image, Sparkles } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { TwitterIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Twitter Scheduler | Schedule Tweets & Threads | EziBreezy",
  description:
    "Schedule Twitter/X posts and threads with preview. The editorial workspace for Twitter creators. Drag-and-drop calendar, native threading, multi-platform publishing.",
  alternates: {
    canonical: "/features/twitter-scheduler",
  },
  openGraph: {
    title: "Twitter Scheduler | EziBreezy",
    description:
      "Schedule Twitter/X posts and threads with preview. The editorial workspace for Twitter creators.",
    url: "https://www.ezibreezy.com/features/twitter-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Twitter Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "twitter scheduler",
    "x scheduler",
    "twitter post scheduler",
    "schedule twitter posts",
    "twitter thread scheduler",
    "schedule tweets",
    "twitter scheduling tool",
    "x post scheduler",
  ],
};

export default function TwitterSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Twitter Scheduler | Schedule Tweets & Threads | EziBreezy"
        description="Schedule Twitter/X posts and threads with preview. The editorial workspace for Twitter creators."
        url="https://www.ezibreezy.com/features/twitter-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Twitter Scheduler"
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
                <TwitterIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                Twitter
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule Twitter/X posts and threads from one editorial desk.
                Build your audience with consistent publishing. Draft once, refine per platform, ship with confidence.
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
              <div className="space-y-4 w-80">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-foreground/10 bg-background rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-foreground/10" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 bg-foreground/20 rounded w-2/3" />
                        <div className="h-1.5 bg-foreground/10 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-foreground/15 rounded w-full" />
                      <div className="h-1.5 bg-foreground/15 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/60 text-center mt-4">
                Thread Preview Included
              </p>
            </div>
          </div>
        </div>

        {/* TWITTER-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              Twitter-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Native Threading */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Native Threading</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create seamless conversation threads that flow naturally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Full media support in every segment of the thread.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview entire threads before scheduling.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Multiple Content Types */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Rich Media Support</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Share text-only posts for fast updates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Publish single images, videos, or mixed media posts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Attach up to 4 items per Tweet (images, GIFs, or videos).</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Tagging & Accessibility */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Tagging & Accessibility</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Mention users directly using @handles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Add Alt Text to images for accessibility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your post or thread will look before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Feed Optimization */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Feed Optimization</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Apply custom crops (e.g., 16:9) specifically optimized for X.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Automatic format optimization for best display.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Schedule at optimal times for maximum engagement.</span>
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
                Your entire strategy at a glance. Schedule Twitter/X posts alongside LinkedIn, Instagram,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <MessageSquare className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Thread Composer</h3>
              <p className="text-foreground/80 leading-relaxed">
                Create multi-tweet threads with ease. Add media to each tweet, preview the full thread,
                and schedule it all at once. Perfect for thought leadership and storytelling.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your message, select Twitter/X and other channels, make platform-specific
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
              Built for Twitter/X Professionals
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Thought Leaders & Executives</h3>
              <p className="text-foreground/80 leading-relaxed">
                Build your personal brand on Twitter/X with consistent, high-quality content. Schedule
                threads sharing insights from your expertise. Maintain daily presence without the pressure
                of real-time posting. Cross-post key insights to LinkedIn to maximize professional reach.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Social Media Managers</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple Twitter/X accounts for different clients or brands. Schedule campaigns
                across Twitter/X and other platforms simultaneously. Get client approval before posts go
                live. Track engagement and reach across all accounts from one unified dashboard.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Creators & Media Companies</h3>
              <p className="text-foreground/80 leading-relaxed">
                Schedule announcement threads for new content releases. Share bite-sized insights that
                drive traffic to your long-form content. Maintain consistent posting schedule to grow
                your audience. Use threads to tell compelling stories that resonate with your community.
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
                Can I schedule Twitter/X threads?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy supports native Twitter/X threading with full media support in every
                segment. Create multi-tweet threads, preview them before scheduling, and publish them
                all at once at your optimal posting time.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule tweets with images and videos?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Attach up to 4 images, GIFs, or videos per tweet. EziBreezy automatically optimizes
                media formats and applies custom crops specifically for Twitter/X&apos;s feed display.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I mention other users in scheduled tweets?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Mention users directly using @handles in your scheduled tweets and threads. Great
                for collaborations, shoutouts, and building community engagement.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule to multiple platforms from one post?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Draft once in the Editorial Desk, select Twitter/X and any other platforms (LinkedIn,
                Instagram, Facebook, TikTok, YouTube, Threads, Pinterest), make platform-specific tweaks,
                and schedule to all of them at once.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Does EziBreezy support Alt Text for Twitter images?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Add Alt Text to all images for improved accessibility. Make your content inclusive
                while following Twitter/X best practices for screen reader compatibility.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Build Your Audience on Twitter/X
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop posting sporadically. Schedule tweets and threads in advance, maintain consistent
            presence, and grow your following with strategic content planning.
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
