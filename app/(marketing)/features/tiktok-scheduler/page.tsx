// app/(marketing)/features/tiktok-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  Video,
  Image as ImageIcon,
  Layers,
  Eye,
  MessageCircle,
  Lock,
  Sparkles,
  Crop,
  Smartphone,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { TikTokIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "TikTok Scheduler | Video, Carousel & Privacy Controls",
  description:
    "The creative workspace for TikTok. Schedule videos and 35-slide carousels, manage comments, and control privacy settings from one desk.",
  alternates: {
    canonical: "/features/tiktok-scheduler",
  },
  openGraph: {
    title: "TikTok Scheduler | EziBreezy",
    description: "The creative workspace. Schedule, visualize, and engage.",
    url: "https://www.ezibreezy.com/features/tiktok-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy TikTok Scheduler",
      },
    ],
    type: "website",
  },
};

export default function TikTokSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="TikTok Scheduler | Video, Carousel & Privacy Controls"
        description="The creative workspace for TikTok. Schedule videos and 35-slide carousels, manage comments, and control privacy settings."
        url="https://www.ezibreezy.com/features/tiktok-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy TikTok Scheduler"
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
                  Platform Specification: 03
                </span>
                <TikTokIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                TikTok
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The entertainment console. <br />
                <span className="text-foreground/60 italic">
                  Where creativity finds its rhythm.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                  {/* The Phone Visual */}
                  <div className="relative w-[240px] aspect-[9/16] bg-black border-[6px] border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden group">
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-zinc-900 flex flex-col">
                      {/* Video Mockup */}
                      <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-900 relative">
                        <div className="absolute bottom-12 left-4 right-16 space-y-2">
                          <div className="w-3/4 h-3 bg-white/20 rounded" />
                          <div className="w-1/2 h-3 bg-white/20 rounded" />
                        </div>
                        {/* Side Actions */}
                        <div className="absolute bottom-12 right-2 flex flex-col gap-4 items-center">
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md" />
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md" />
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md" />
                        </div>
                      </div>
                    </div>

                    {/* "Schedule" Overlay */}
                    <div className="absolute inset-0 bg-brand-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                        <span className="font-mono text-xs uppercase tracking-widest font-bold">
                          Ready to Publish
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-widest opacity-40 text-right">
                    Fig 3.
                    <br />
                    The Feed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              The stage is set.
              <br />
              <span className="italic font-normal">
                All you have to do is perform.
              </span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  T
                </span>
                here is a unique energy to TikTok. It moves fast. It demands
                authenticity. It rewards the brave.
              </p>
              <p>
                The <strong>Editorial Desk</strong> is designed to help you
                harness that energy without getting swept away by it. Plan your
                performance, organize your visuals, and release your work when
                the audience is ready to applaud.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Plan Your Content{" "}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: THE LEDGER (Key Features) --- */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold bg-foreground text-background px-2 py-1">
              Production Capabilities
            </h3>
            <div className="h-px flex-1 bg-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-foreground">
            {/* Cell 1: Video Publishing */}
            <div className="p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground hover:bg-surface-hover transition-colors">
              <div className="mb-6 text-brand-primary">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">
                Video & Photo
              </h3>
              <p className="font-serif text-sm text-foreground/70 leading-relaxed">
                Whether it's a quick 15-second clip, a 10-minute vlog, or a
                static photo update, our publisher handles every format
                natively.
              </p>
            </div>

            {/* Cell 2: Mega Carousels */}
            <div className="p-8 border-b-2 md:border-r-2 lg:border-b-0 border-foreground hover:bg-surface-hover transition-colors">
              <div className="mb-6 text-brand-primary">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">
                Mega Carousels
              </h3>
              <p className="font-serif text-sm text-foreground/70 leading-relaxed">
                Tell a longer story. We support photo carousels with up to{" "}
                <strong>35 images</strong> per post. Perfect for photo dumps and
                tutorials.
              </p>
            </div>

            {/* Cell 3: Intelligent Processing */}
            <div className="p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground hover:bg-surface-hover transition-colors">
              <div className="mb-6 text-brand-primary">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">
                Smart Upload
              </h3>
              <p className="font-serif text-sm text-foreground/70 leading-relaxed">
                We handle the heavy lifting. Large video files are automatically
                chunked and optimized for smooth playback without quality loss.
              </p>
            </div>

            {/* Cell 4: Privacy */}
            <div className="p-8 hover:bg-surface-hover transition-colors">
              <div className="mb-6 text-brand-primary">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">
                Privacy Control
              </h3>
              <p className="font-serif text-sm text-foreground/70 leading-relaxed">
                Your stage, your rules. Set visibility to Public, Friends, or
                Private. Disable duets or comments before you even post.
              </p>
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
                  Fan Mail
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4 pb-4 border-b border-dashed border-foreground/20">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm">@fan_account</span>
                        <span className="text-[9px] text-foreground/40 uppercase">
                          2m ago
                        </span>
                      </div>
                      <p className="text-xs font-serif text-foreground/80">
                        "I needed to hear this today. Thank you!"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm">@collaborator</span>
                        <span className="text-[9px] text-foreground/40 uppercase">
                          1h ago
                        </span>
                      </div>
                      <p className="text-xs font-serif text-foreground/80">
                        "The editing on this is next level. 🔥"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="mb-6 flex items-center gap-2 text-brand-primary">
                <MessageCircle className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  The Correspondence Desk
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                Listen to the
                <br />
                applause.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  Comments are not just metrics; they are people taking a moment
                  to engage with your art.
                </p>
                <p>
                  Our <strong>Unified Inbox</strong> collects every comment in
                  one place, allowing you to reply, appreciate, and connect with
                  your audience without the distraction of the infinite scroll.
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
                  Feature Index
                </p>
              </div>

              <div className="md:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
                  {/* List Items styled like classified ads */}

                  {/* Feature: Image Cropping */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Crop className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Image Cropping
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Ensure your visuals fit the frame. Crop your images to
                        Square, Landscape, Portrait, or Story dimensions right
                        in the browser.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Post Preview */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Eye className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Post Preview
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        See exactly how your video or carousel will look on the
                        &apos;For You&apos; page before it goes live. No
                        surprises.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Creator Tools */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Creator Tools
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Working with partners? Easily mark your content as
                        branded or sponsored to maintain transparency and
                        compliance.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Multi-Format */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Any Format
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        We support standard video uploads, static images, and
                        multi-image carousels. One tool for every way you
                        create.
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
              href="/tools/social-image-resizer"
              className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
            >
              <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
                9:16
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Image Resizer
                </h4>
                <p className="text-xs text-foreground/60">
                  Crop photos perfectly for TikTok&apos;s vertical feed.
                </p>
              </div>
            </Link>

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
                  Turn boring screenshots into aesthetic assets.
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
              Create without chaos.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Schedule your next viral moment today.
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
