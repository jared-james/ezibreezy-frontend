// app/(marketing)/features/pinterest-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar, FolderOpen, Image, Sparkles, Link as LinkIcon } from "lucide-react";
import { SoftwareApplicationJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { PinterestIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Pinterest Scheduler | Schedule Pinterest Pins & Boards | EziBreezy",
  description:
    "Schedule Pinterest Pins and manage Boards with preview. The visual workspace for Pinterest creators. Drag-and-drop calendar, board management, multi-platform publishing.",
  alternates: {
    canonical: "/features/pinterest-scheduler",
  },
  openGraph: {
    title: "Pinterest Scheduler | EziBreezy",
    description:
      "Schedule Pinterest Pins and manage Boards with preview. The visual workspace for Pinterest creators.",
    url: "https://www.ezibreezy.com/features/pinterest-scheduler",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Pinterest Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  keywords: [
    "pinterest scheduler",
    "pinterest pin scheduler",
    "schedule pinterest pins",
    "pinterest content scheduler",
    "pinterest scheduling tool",
    "schedule pins",
  ],
};

export default function PinterestSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Pinterest Scheduler | Schedule Pinterest Pins & Boards | EziBreezy"
        description="Schedule Pinterest Pins and manage Boards with preview. The visual workspace for Pinterest creators."
        url="https://www.ezibreezy.com/features/pinterest-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Pinterest Scheduler"
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
                <PinterestIcon className="w-8 h-8 text-brand-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
                  Platform-Specific Scheduler
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                Pinterest
                <br />
                Scheduler
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mb-10">
                Schedule Pinterest Pins and manage Boards from one editorial desk.
                Drive traffic with strategic pinning. Draft once, refine per platform, ship with confidence.
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

        {/* PINTEREST-SPECIFIC FEATURES */}
        <div className="mb-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
              Pinterest-Specific Features
            </span>
            <div className="flex-1 h-px bg-foreground/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Board Organization */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Board Management</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Create new Boards directly within the app.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Strict validation ensures every Pin has a destination Board.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Support for Public, Secret, and Protected privacy settings.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Rich Pin Details */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Rich Pin Details</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Add titles and descriptions (up to 500 chars).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Attach destination links to drive traffic to your site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>SEO-friendly Alt Text logic.</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Video Pin Support */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Video Pin Support</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Upload videos with custom cover images.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Optimize videos for Pinterest&apos;s feed display.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Preview how your Pin will look before publishing.</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Traffic Generation */}
            <div className="border-l-4 border-brand-primary/60 bg-surface-hover/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <LinkIcon className="w-6 h-6 text-brand-primary" />
                <h3 className="font-serif text-2xl font-bold">Drive Traffic & Conversions</h3>
              </div>
              <ul className="space-y-3 text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Add destination URLs to every Pin to drive website traffic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>SEO-optimized descriptions increase discoverability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <span>Schedule Pins at optimal times for maximum engagement.</span>
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
                Your entire strategy at a glance. Schedule Pinterest Pins alongside Instagram, Facebook,
                and 5 other platforms. Drag to reschedule, click to edit.
              </p>
            </div>

            <div>
              <FolderOpen className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Board Organization</h3>
              <p className="text-foreground/80 leading-relaxed">
                Create and manage Boards directly from the scheduler. Organize Pins into thematic
                collections. Set privacy levels for each Board (Public, Secret, Protected).
              </p>
            </div>

            <div>
              <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3">Cross-Platform Editorial Desk</h3>
              <p className="text-foreground/80 leading-relaxed">
                Write your description, select Pinterest and other channels, make platform-specific
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
              Built for Pinterest Marketers
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Bloggers & Content Creators</h3>
              <p className="text-foreground/80 leading-relaxed">
                Drive traffic to your blog posts with strategic Pinterest scheduling. Create Pins with
                compelling descriptions and destination links. Schedule multiple Pins for the same article
                across different Boards. Track which Pins drive the most traffic to your site.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">E-commerce & Online Stores</h3>
              <p className="text-foreground/80 leading-relaxed">
                Showcase products with beautiful Pins that drive sales. Schedule product launches across
                Pinterest and Instagram simultaneously. Organize products into themed Boards (e.g., &quot;Summer
                Collection&quot;, &quot;Gift Ideas&quot;). Use destination links to drive traffic directly to product pages.
              </p>
            </div>

            <div className="p-8 bg-surface-hover/20 border border-foreground/10">
              <h3 className="font-serif text-2xl font-medium mb-3">Agencies & Marketing Teams</h3>
              <p className="text-foreground/80 leading-relaxed">
                Manage multiple Pinterest accounts for different clients or brands. Schedule pinning
                campaigns weeks in advance. Create Boards for seasonal campaigns and product categories.
                Track performance across all accounts from one unified dashboard.
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
                Can I create Boards from within EziBreezy?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Create new Pinterest Boards directly within the app without leaving your workflow.
                Set privacy levels (Public, Secret, Protected) and organize your Pins into thematic collections.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule Video Pins?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload videos with custom cover images. EziBreezy optimizes videos for Pinterest&apos;s
                feed display and lets you preview how your Video Pin will look before scheduling.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I add destination links to scheduled Pins?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Add destination URLs to every Pin to drive traffic to your website, blog, or online
                store. Perfect for content creators and e-commerce brands looking to convert Pinterest
                users into website visitors.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Can I schedule the same image to Pinterest and other platforms?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Upload once in the Editorial Desk, select Pinterest and any other platforms (Instagram,
                Facebook, LinkedIn, etc.), make platform-specific adjustments (like adding destination links
                for Pinterest), and schedule to all of them at once.
              </p>
            </div>

            <div className="p-6 border-l-2 border-brand-primary/60 bg-surface-hover/20">
              <h3 className="font-serif text-lg font-bold mb-2">
                Does EziBreezy support Alt Text for Pinterest Pins?
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Yes. Add SEO-friendly Alt Text to all Pins for improved accessibility and search
                discoverability. Make your content inclusive while increasing its chances of being found
                in Pinterest search results.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="p-12 bg-brand-primary text-brand-primary-foreground border-2 border-foreground text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Drive Traffic with Strategic Pinterest Scheduling
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Stop pinning sporadically. Schedule Pins in advance, organize them into Boards, maintain
            consistent presence, and drive meaningful traffic to your website.
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
