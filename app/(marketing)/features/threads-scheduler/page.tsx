// app/(marketing)/features/threads-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, MessageSquare, Image, Sparkles } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { ThreadsIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Threads Scheduler | Schedule Threads Posts | EziBreezy",
  description:
    "Schedule Threads posts and conversations with preview. The editorial workspace for Threads creators. Drag-and-drop calendar, native threading, multi-platform publishing.",
  alternates: {
    canonical: "/features/threads-scheduler",
  },
  openGraph: {
    title: "Threads Scheduler | EziBreezy",
    description:
      "Schedule Threads posts and conversations with preview. The editorial workspace for Threads creators.",
    url: "https://www.ezibreezy.com/features/threads-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Threads Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "threads scheduler",
    "threads post scheduler",
    "schedule threads posts",
    "threads content scheduler",
    "threads scheduling tool",
    "meta threads scheduler",
  ],
};

export default function ThreadsSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Threads Scheduler | Schedule Threads Posts | EziBreezy"
        description="Schedule Threads posts and conversations with preview. The editorial workspace for Threads creators."
        url="https://www.ezibreezy.com/features/threads-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Threads Scheduler"
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
                <ThreadsIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                Threads
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule Threads posts and conversations from one editorial desk.
                Join the conversation strategically. Draft once, refine per platform, ship with confidence.
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
          </div>
        </div>

        {/* THREADS-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              Threads-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Rich Content */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Rich Content Publishing</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create text, images, and videos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create mixed carousels with up to 20 photos and videos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Add links with automatic rich preview cards.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Native Threading */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">True Conversation Threading</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create authentic threaded conversations that flow naturally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Auto-split long text into a connected chain (500 char limit per segment).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview entire thread before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Smart Tags & Discovery */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Smart Tags & Discovery</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Add one &apos;Topic Tag&apos; per post to join conversations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Tag locations with full address details for local discoverability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your post will look before scheduling.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Intelligent Media Handling */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Intelligent Media Handling</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Auto-convert unsupported formats (PNG/WEBP) to JPEG.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Optimize images for fast loading and quality display.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Support for mixed media carousels with photos and videos.</span>
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
                Your entire strategy at a glance. Schedule Threads posts alongside Instagram, Twitter,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <MessageSquare className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Thread Composer</h3>
              <p className="text-foreground/80 leading-relaxed">
                Create multi-post threads that flow naturally. Auto-split long text into connected
                segments. Preview the entire conversation before scheduling.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your message, select Threads and other channels, make platform-specific
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
              Built for Threads Creators
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Creators & Thought Leaders</h3>
              <p className="text-foreground/80 leading-relaxed">
                Build your presence on Threads with consistent, engaging content. Schedule threaded
                conversations sharing insights and stories. Maintain daily presence without the pressure
                of real-time posting. Cross-post to Twitter/X to maximize reach across text-based platforms.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Brands & Businesses</h3>
              <p className="text-foreground/80 leading-relaxed">
                Join conversations in your industry with strategic Threads posts. Schedule announcements,
                behind-the-scenes content, and community engagement. Use topic tags to increase
                discoverability. Build authentic connections with your audience.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Social Media Teams</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple Threads accounts for different clients. Schedule campaigns across Threads
                and Instagram simultaneously (same Meta ecosystem). Get approval before posts go live.
                Track engagement across all accounts from one unified dashboard.
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
                Can I schedule threaded conversations on Threads?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy supports native Threads threading with automatic text splitting for long
                messages (500 character limit per segment). Create multi-post threads that flow naturally
                and schedule them all at once.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule Threads posts with images and videos?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create mixed carousels with up to 20 photos and videos per post. EziBreezy
                automatically converts unsupported formats (PNG/WEBP) to JPEG for optimal compatibility.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I add topic tags to scheduled Threads posts?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Add one &apos;Topic Tag&apos; per post to join relevant conversations and increase
                discoverability. Tag locations with full address details for local community engagement.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule Threads posts with links?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Add links to your Threads posts and EziBreezy will automatically generate rich
                preview cards with images, titles, and descriptions. Perfect for driving traffic to
                your content or website.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule to multiple platforms from one post?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Draft once in the Editorial Desk, select Threads and any other platforms (Instagram,
                Twitter/X, LinkedIn, Facebook, TikTok, YouTube, Pinterest), make platform-specific tweaks,
                and schedule to all of them at once.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Join the Conversation on Threads
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop posting sporadically. Schedule Threads posts and conversations in advance, maintain
            consistent presence, and build your community with strategic content planning.
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
