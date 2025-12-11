// app/(marketing)/features/linkedin-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, FileText, Users, Sparkles, TrendingUp } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { LinkedinIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "LinkedIn Scheduler | Schedule LinkedIn Posts & Articles | EziBreezy",
  description:
    "Schedule LinkedIn posts, articles, and document carousels with preview. The professional workspace for LinkedIn creators. Drag-and-drop calendar, multi-platform publishing.",
  alternates: {
    canonical: "/features/linkedin-scheduler",
  },
  openGraph: {
    title: "LinkedIn Scheduler | EziBreezy",
    description:
      "Schedule LinkedIn posts, articles, and document carousels with preview. The professional workspace for LinkedIn creators.",
    url: "https://www.ezibreezy.com/features/linkedin-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy LinkedIn Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "linkedin scheduler",
    "linkedin post scheduler",
    "schedule linkedin posts",
    "linkedin content scheduler",
    "linkedin publishing tool",
    "linkedin article scheduler",
    "linkedin carousel scheduler",
    "linkedin scheduling tool",
  ],
};

export default function LinkedInSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="LinkedIn Scheduler | Schedule LinkedIn Posts & Articles | EziBreezy"
        description="Schedule LinkedIn posts, articles, and document carousels with preview. The professional workspace for LinkedIn creators."
        url="https://www.ezibreezy.com/features/linkedin-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy LinkedIn Scheduler"
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
                <LinkedinIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                LinkedIn
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule LinkedIn posts, articles, and document carousels from one editorial desk.
                Build your professional brand with consistent publishing. Draft once, refine per platform, ship with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/linkedin-text-formatter"
                  className="inline-flex items-center justify-center gap-3 border-2 border-foreground/30 text-foreground px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
                >
                  Try Text Formatter Free
                </Link>
              </div>
            </div>
            <div className="w-full md:w-auto md:shrink-0 p-8 border-2 border-foreground/20 bg-surface-hover/30">
              <div className="space-y-3 w-80">
                <div className="flex items-center gap-3 pb-3 border-b border-foreground/20">
                  <div className="w-10 h-10 rounded-full bg-foreground/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-foreground/20 rounded w-3/4" />
                    <div className="h-2 bg-foreground/10 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-background rounded border border-foreground/10">
                  <div className="h-2 bg-foreground/20 rounded w-full" />
                  <div className="h-2 bg-foreground/10 rounded w-5/6" />
                  <div className="h-2 bg-foreground/10 rounded w-4/6" />
                </div>
              </div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/60 text-center mt-4">
                Post Preview Included
              </p>
            </div>
          </div>
        </div>

        {/* LINKEDIN-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              LinkedIn-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Multiple Content Types */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Multiple Content Types</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Share text-only posts for quick insights or announcements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Publish single images, video posts, or mixed media updates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create swipeable document galleries (carousels) with up to 20 images.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Smart Link Previews */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Smart Link Previews</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Auto-detects URLs in text to generate &apos;Article Share&apos; cards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your link will appear in the LinkedIn feed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Optimized for Main Feed distribution and Public visibility.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Accessibility & Reach */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Accessibility & Reach</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Support for Alt Text on images and media assets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Tag other LinkedIn Pages to increase reach and visibility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your post will look before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Professional Publishing */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Professional Publishing</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Schedule posts weeks in advance for consistent presence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Maintain professional cadence without daily effort.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Cross-post to other platforms from the same editorial desk.</span>
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
                Your entire strategy at a glance. Schedule LinkedIn posts alongside Instagram, Twitter,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <FileText className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Document Carousel Support</h3>
              <p className="text-foreground/80 leading-relaxed">
                Create professional document carousels with up to 20 slides. Perfect for thought
                leadership, case studies, and educational content that drives engagement.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your main message, select LinkedIn and other channels, make platform-specific
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
              Built for LinkedIn Professionals
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Thought Leaders & Executives</h3>
              <p className="text-foreground/80 leading-relaxed">
                Build your professional brand with consistent LinkedIn publishing. Schedule thought
                leadership posts weeks in advance. Maintain visibility without sacrificing quality or
                time. Cross-post insights to Twitter/X to maximize reach across platforms.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">B2B Marketers & Agencies</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple LinkedIn company pages from separate workspaces. Schedule product
                announcements, case studies, and industry insights. Get stakeholder approval before
                posts go live. Track engagement and reach across all client accounts.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Coaches & Consultants</h3>
              <p className="text-foreground/80 leading-relaxed">
                Schedule valuable content that positions you as an expert. Create document carousels
                with actionable frameworks. Tag relevant company pages to increase visibility. Build
                authority while focusing on client work, not daily posting.
              </p>
            </div>
          </div>
        </div>

        {/* RELATED TOOLS */}
        <div className="mb-20 pt-12 border-t-2 border-dotted border-foreground/30">
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
              Related Tools
            </span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mt-2">
              Complete LinkedIn Toolkit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tools/linkedin-text-formatter"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                LinkedIn Text Formatter
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Format your LinkedIn posts with proper line breaks, spacing, and structure. Make your
                content readable and engaging before you schedule it. Free tool, no signup required.
              </p>
            </Link>

            <Link
              href="/features/instagram-scheduler"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Instagram Scheduler
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Cross-post your visual content to Instagram alongside your LinkedIn updates. Manage
                both professional and visual platforms from one editorial desk.
              </p>
            </Link>

            <Link
              href="/features/twitter-scheduler"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Twitter/X Scheduler
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Amplify your LinkedIn insights on Twitter/X. Schedule threads and single tweets to
                reach your audience where they are. One message, multiple platforms.
              </p>
            </Link>

            <Link
              href="/editorial"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Editorial Insights
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Learn professional publishing strategies, content workflow tips, and LinkedIn best
                practices from our editorial team.
              </p>
            </Link>
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
                Can I schedule LinkedIn document carousels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy supports scheduling LinkedIn document carousels (also called document
                galleries) with up to 20 images per post. Perfect for sharing frameworks, case studies,
                and educational content.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule LinkedIn articles?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                EziBreezy automatically generates article preview cards when you include URLs in your
                LinkedIn posts. Simply paste a link and we&apos;ll create a rich preview card that drives
                traffic to your articles or blog posts.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I tag other LinkedIn Pages in my scheduled posts?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Tag other LinkedIn Pages using @mentions to increase reach and visibility. Great
                for partnerships, collaborations, and giving credit where it&apos;s due.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule to multiple platforms from one post?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Draft once in the Editorial Desk, select LinkedIn and any other platforms (Instagram,
                Twitter/X, Facebook, TikTok, YouTube, Threads, Pinterest), make platform-specific tweaks,
                and schedule to all of them at once.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Does EziBreezy support Alt Text for LinkedIn images?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Add Alt Text to all images and media assets for improved accessibility and SEO.
                Make your content inclusive while increasing discoverability.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I manage multiple LinkedIn company pages?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create separate workspaces for each LinkedIn company page or client. Invite team
                members with specific roles, manage approval workflows, and track performance across
                all accounts from one dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Build Your Professional Brand on LinkedIn
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop scrambling for daily posts. Schedule your LinkedIn content in advance, maintain
            consistent presence, and focus on what matters: building relationships and closing deals.
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
