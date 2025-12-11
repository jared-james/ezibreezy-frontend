// app/(marketing)/features/instagram-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, Grid3x3, Image, Video, Sparkles } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { InstagramIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Instagram Scheduler | Plan, Schedule & Publish Instagram Posts | EziBreezy",
  description:
    "Schedule Instagram posts, Reels, Stories, and Carousels with preview. The editorial workspace for Instagram creators. Drag-and-drop calendar, grid preview, and multi-platform publishing.",
  alternates: {
    canonical: "/features/instagram-scheduler",
  },
  openGraph: {
    title: "Instagram Scheduler | EziBreezy",
    description:
      "Schedule Instagram posts, Reels, Stories, and Carousels with preview. The editorial workspace for Instagram creators.",
    url: "https://www.ezibreezy.com/features/instagram-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Instagram Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "instagram scheduler",
    "instagram post scheduler",
    "schedule instagram posts",
    "instagram reels scheduler",
    "instagram stories scheduler",
    "instagram carousel scheduler",
    "instagram content planner",
    "instagram scheduling tool",
  ],
};

export default function InstagramSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Instagram Scheduler | Plan, Schedule & Publish Instagram Posts | EziBreezy"
        description="Schedule Instagram posts, Reels, Stories, and Carousels with preview. The editorial workspace for Instagram creators."
        url="https://www.ezibreezy.com/features/instagram-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Instagram Scheduler"
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
                <InstagramIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                Instagram
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule Instagram posts, Reels, Stories, and Carousels from one editorial desk.
                See your grid before you publish. Draft once, refine per platform, ship with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/instagram-grid-planner"
                  className="inline-flex items-center justify-center gap-3 border-2 border-foreground/30 text-foreground px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
                >
                  Try Grid Planner Free
                </Link>
              </div>
            </div>
            <div className="w-full md:w-auto md:shrink-0 p-8 border-2 border-foreground/20 bg-surface-hover/30">
              <div className="grid grid-cols-3 gap-2 w-64 h-64" role="img" aria-label="Instagram grid preview illustration">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-foreground/5 border border-foreground/10 ${
                      i === 4 ? "ring-2 ring-brand-primary/60" : ""
                    }`}
                  />
                ))}
              </div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/60 text-center mt-4">
                Grid Preview Included
              </p>
            </div>
          </div>
        </div>

        {/* INSTAGRAM-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              Instagram-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Post Anywhere */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Post Anywhere</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create single images, videos, carousels, Reels, and Stories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Smart Stories: Upload multiple photos/videos, we auto-split them into individual stories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your post will look once published.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Intelligent Media Handling */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Intelligent Media Handling</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Automatic format optimization for Instagram&apos;s requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Custom cropping for each image (4:5 vs 1.91:1).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>High-resolution media support with automatic processing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Advanced Reel Controls */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Advanced Reel Controls</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Choose whether your Reel appears on your main feed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Upload custom cover images.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Select the perfect frame for your thumbnail.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Tag Everything */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Grid3x3 className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Tag Everything</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Tag people in your photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Tag products from your catalog to drive sales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Invite collaborators to co-author posts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Search and add locations.</span>
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
                Your entire strategy at a glance. Schedule Instagram posts alongside LinkedIn, TikTok,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <Grid3x3 className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Grid Preview Before Publishing</h3>
              <p className="text-foreground/80 leading-relaxed">
                See how your next post fits into your Instagram grid before you schedule it.
                Plan your aesthetic, maintain visual consistency.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your main caption, select Instagram and other channels, make platform-specific
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
              Built for Instagram Creators
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Content Creators & Influencers</h3>
              <p className="text-foreground/80 leading-relaxed">
                Plan your Instagram grid weeks in advance. Schedule Reels for optimal engagement times.
                Maintain a consistent posting schedule without the daily grind. Cross-post to TikTok and
                YouTube Shorts from the same workspace.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Social Media Managers</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple Instagram accounts from separate workspaces. Get client approval before
                posts go live. Schedule Instagram alongside LinkedIn and Facebook for holistic campaigns.
                Track performance across all client accounts.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">E-commerce Brands</h3>
              <p className="text-foreground/80 leading-relaxed">
                Tag products in every post to drive sales. Schedule product launches across Instagram,
                Facebook, and Pinterest simultaneously. Use the grid planner to ensure your product feed
                looks cohesive and on-brand.
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
              Complete Instagram Toolkit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tools/instagram-grid-planner"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Instagram Grid Planner
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Upload your photos, arrange them, and see your feed the way your audience will before
                you schedule and publish. Free tool, no signup required.
              </p>
            </Link>

            <Link
              href="/tools/instagram-grid-maker"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Instagram Grid Maker
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Create a multi-post grid from a single image to anchor your feed with a bold visual
                statement. Perfect for product launches and announcements.
              </p>
            </Link>

            <Link
              href="/tools/instagram-carousel-splitter"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Instagram Carousel Splitter
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Turn wide panoramic images into swipeable carousels that sit beautifully in your
                planned grid.
              </p>
            </Link>

            <Link
              href="/tools/instagram-font-generator"
              className="p-8 bg-surface-hover/20 border border-foreground/10 hover:border-brand-primary transition-all group"
            >
              <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                Instagram Font Generator
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Give your bio and captions the same intentionality as your visual grid with custom
                fonts and text styles.
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
                Can I schedule Instagram Reels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy supports scheduling Instagram Reels with full control over feed visibility,
                custom cover images, and thumbnail selection.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule Instagram Stories?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload multiple photos or videos and we&apos;ll automatically split them into individual
                Stories. Schedule them to post at your optimal engagement times.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I see my Instagram grid before publishing?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. EziBreezy includes a direct grid preview feature so you can see how your next post
                fits into your overall Instagram aesthetic before you schedule it.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule to multiple platforms from one post?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Draft once in the Editorial Desk, select Instagram and any other platforms (LinkedIn,
                TikTok, Twitter, Facebook, YouTube, Threads, Pinterest), make platform-specific tweaks,
                and schedule to all of them at once.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Does EziBreezy support Instagram carousels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create carousels with up to 10 images or videos. Each image can have custom cropping
                to ensure it looks perfect in your feed.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I tag products and people in scheduled Instagram posts?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Tag people, products from your catalog, locations, and invite collaborators to
                co-author posts—all before you schedule them.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Schedule Instagram Like a Pro
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop posting one image at a time and hoping it fits. Plan your grid, schedule your content,
            and publish with confidence.
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
