// app/(marketing)/features/facebook-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, Image, Users, Sparkles } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { FacebookIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Facebook Scheduler | Schedule Facebook Posts & Stories | EziBreezy",
  description:
    "Schedule Facebook posts, stories, and carousels with preview. The professional workspace for Facebook pages. Drag-and-drop calendar, multi-platform publishing.",
  alternates: {
    canonical: "/features/facebook-scheduler",
  },
  openGraph: {
    title: "Facebook Scheduler | EziBreezy",
    description:
      "Schedule Facebook posts, stories, and carousels with preview. The professional workspace for Facebook pages.",
    url: "https://www.ezibreezy.com/features/facebook-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Facebook Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "facebook scheduler",
    "facebook post scheduler",
    "schedule facebook posts",
    "facebook page scheduler",
    "facebook content scheduler",
    "facebook scheduling tool",
    "schedule facebook stories",
  ],
};

export default function FacebookSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Facebook Scheduler | Schedule Facebook Posts & Stories | EziBreezy"
        description="Schedule Facebook posts, stories, and carousels with preview. The professional workspace for Facebook pages."
        url="https://www.ezibreezy.com/features/facebook-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Facebook Scheduler"
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
                <FacebookIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                Facebook
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule Facebook posts, stories, and carousels from one editorial desk.
                Manage your pages with ease. Draft once, refine per platform, ship with confidence.
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

        {/* FACEBOOK-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              Facebook-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Multiple Content Types */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Multiple Content Types</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create text updates, photos, videos, albums, and carousels (up to 10 images or videos).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Smart Stories: Upload multiple items, we&apos;ll auto-split them into stories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your post will look before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Intelligent Optimization */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Intelligent Optimization</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Custom cropping for each image to look perfect on Facebook.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Automatic format optimization and video processing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>High-quality media uploads with smart compression.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Tagging & Accessibility */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Tagging & Accessibility</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Tag Facebook Pages using @mentions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Search and add locations to increase local discoverability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Add alt text to images for improved accessibility.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Link Previews */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Automatic Link Previews</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Paste a URL and we automatically generate a rich preview card.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Pin your first comment to start conversations (Feed posts).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Schedule at optimal times for maximum reach.</span>
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
                Your entire strategy at a glance. Schedule Facebook posts alongside Instagram, LinkedIn,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <Users className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Page Management</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple Facebook Pages from one dashboard. Perfect for agencies managing client
                accounts or businesses with multiple brands. Separate workspaces for each page.
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your message, select Facebook and other channels, make platform-specific
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
              Built for Facebook Page Managers
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Local Businesses & Restaurants</h3>
              <p className="text-foreground/80 leading-relaxed">
                Schedule announcements, promotions, and events for your local community. Tag locations
                to increase discoverability. Post stories showcasing daily specials. Maintain consistent
                presence without hiring a full-time social media manager.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Social Media Teams</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple Facebook Pages for different clients. Schedule campaigns across Facebook
                and Instagram simultaneously. Get client approval before posts go live. Track performance
                across all accounts from one unified dashboard.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">E-commerce & Retail Brands</h3>
              <p className="text-foreground/80 leading-relaxed">
                Schedule product launches and promotional campaigns. Create carousels showcasing multiple
                products. Share customer testimonials and user-generated content. Drive traffic to your
                website with automatic link preview cards.
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
                Can I schedule Facebook Stories?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload multiple photos or videos and we&apos;ll automatically split them into individual
                Facebook Stories. Schedule them to post at your optimal engagement times.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule Facebook carousels?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create carousels with up to 10 images or videos per post. Perfect for showcasing
                multiple products, telling visual stories, or sharing step-by-step guides.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I tag other Facebook Pages in my posts?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Tag other Facebook Pages using @mentions to increase reach and visibility. Great
                for partnerships, collaborations, and community building.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I manage multiple Facebook Pages?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create separate workspaces for each Facebook Page or client. Invite team members
                with specific roles, manage approval workflows, and track performance across all pages
                from one dashboard.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Does EziBreezy create link preview cards automatically?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Simply paste a URL in your post and we&apos;ll automatically generate a rich preview
                card with image, title, and description. Perfect for driving traffic to your website or blog.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Manage Your Facebook Presence Effortlessly
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop scrambling for daily content. Schedule Facebook posts in advance, maintain consistent
            presence, and grow your community with strategic planning.
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
