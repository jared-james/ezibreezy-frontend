// app/(marketing)/features/facebook-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  MapPin,
  Users,
  Star,
  Sparkles,
  BarChart3,
  Tv,
  MessageSquare,
  Image as ImageIcon,
  Type,
  Eye,
  Crop,
  Layers,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { FacebookIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Facebook Scheduler | Reels, Groups & Page Management",
  description:
    "The editorial workspace for Facebook Pages. Schedule Reels, manage community reviews, and track fan growth from one desk.",
  alternates: {
    canonical: "/features/facebook-scheduler",
  },
  openGraph: {
    title: "Facebook Scheduler | EziBreezy",
    description:
      "The community hub. Schedule, manage reputation, and grow your fans.",
    url: "https://www.ezibreezy.com/features/facebook-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Facebook Scheduler",
      },
    ],
    type: "website",
  },
};

export default function FacebookSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Facebook Scheduler | Reels, Groups & Page Management"
        description="The editorial workspace for Facebook Pages. Schedule Reels, manage community reviews, and track fan growth."
        url="https://www.ezibreezy.com/features/facebook-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Facebook Scheduler"
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
                  Platform Specification: 05
                </span>
                <FacebookIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                Facebook
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The town hall. <br />
                <span className="text-foreground/60 italic">
                  Where community puts down roots.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation (Page/Post) */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                  {/* Page Post Mockup */}
                  <div className="max-w-md mx-auto w-full bg-white border border-foreground/10 shadow-sm rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-4 flex gap-3 border-b border-foreground/5">
                      <div className="w-10 h-10 bg-brand-primary/20 rounded-full" />
                      <div>
                        <div className="h-3 w-32 bg-foreground/10 rounded mb-1" />
                        <div className="h-2 w-20 bg-foreground/5 rounded" />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
                      <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-brand-primary border-b-[6px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    {/* Link Preview Bar */}
                    <div className="bg-gray-50 p-3 border-t border-foreground/5">
                      <div className="h-3 w-3/4 bg-foreground/10 rounded mb-2" />
                      <div className="h-2 w-1/2 bg-foreground/5 rounded" />
                    </div>
                  </div>

                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                    Rich Media Publishing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              Build a home for
              <br />
              <span className="italic font-normal">your brand.</span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  F
                </span>
                acebook is where your business lives online. It is the
                storefront, the customer service desk, and the community board
                all in one.
              </p>
              <p>
                The <strong>Editorial Desk</strong> ensures your Page is always
                active, always welcoming. From reels that entertain to
                location-tagged updates that drive foot traffic, we help you
                manage your presence with purpose.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Manage Your Page{" "}
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
                Know your
                <br />
                <span className="italic text-brand-primary">residents.</span>
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
                A community isn't just a number. It's people. It's fans who
                return, and new faces discovering you for the first time.
              </p>
              <p className="font-serif text-sm leading-relaxed text-foreground/70">
                Our intelligence report breaks down the health of your Page,
                showing you not just who sees your content, but who is sticking
                around.
              </p>
            </div>

            {/* The Grid of Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
              {/* Metric 1 */}
              <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Total Followers
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Growth
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See the steady rise of your community over time. Measure the
                  long-term health of your brand.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
                </div>
                <h4 className="font-bold font-serif text-lg mb-1">Fan Base</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Loyalty
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track gained and lost fans. Understand what content builds
                  loyalty and what drives people away.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Eye className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Page Views
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Visibility
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See how many eyes are on your storefront. Track impressions
                  and views across the platform.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Tv className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Video Views
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Retention
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  From Reels to live streams, see how many people are tuning in
                  and watching your stories unfold.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Post Impressions
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Reach
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  How far did your message travel? Measure the total footprint
                  of your posts in the feed.
                </p>
              </div>

              {/* Metric 6 */}
              <div className="p-6 hover:bg-white transition-colors group">
                <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Post Tracking
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Engagement
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Drill down into specific posts. See engaged users, clicks, and
                  reactions for every update.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE INBOX (Reviews & Service) --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Visual */}
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
                  Customer Service
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4 pb-4 border-b border-dashed border-foreground/20">
                    <Star
                      className="w-5 h-5 text-brand-primary shrink-0 mt-1"
                      fill="currentColor"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm">New Review</span>
                        <div className="flex text-brand-primary text-[10px]">
                          ★★★★★
                        </div>
                      </div>
                      <p className="text-xs font-serif text-foreground/80">
                        "Absolutely love this place. The service is..."
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm">New Message</span>
                        <span className="text-[9px] text-foreground/40 uppercase">
                          Now
                        </span>
                      </div>
                      <p className="text-xs font-serif text-foreground/80">
                        "Do you have this in stock?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="mb-6 flex items-center gap-2 text-brand-primary">
                <Star className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  Reputation Management
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                Service is the
                <br />
                new marketing.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  On Facebook, your reputation is public. A review isn't just
                  feedback; it's a billboard.
                </p>
                <p>
                  Our <strong>Unified Inbox</strong> ensures you never miss a
                  chance to say "thank you" or solve a problem. Manage comments,
                  direct messages, and Page reviews from one quiet, organized
                  space.
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
                  Publishing Capabilities
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
                        Crop to square, landscape, portrait, or story. Ensure
                        your visuals look professional on every device.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Reels & Stories */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Tv className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Reels & Stories
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Publish images or videos up to 1 minute long. Keep your
                        Page active with ephemeral content and engaging
                        short-form video.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Carousel Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Layers className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Link Carousels
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Drive traffic. Publish carousels with titles,
                        descriptions, and URLs. Include up to 10 images or
                        videos in a single swipeable unit.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Text Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Status Updates
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Sometimes the message is simple. Publish text-only posts
                        to keep your community informed.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Tagging */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Users className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Tag Pages
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Build connections. Tag other Facebook Pages by typing @
                        to increase visibility and foster partnerships.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Location */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <MapPin className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Location Tagging
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Put yourself on the map. Search and add locations to
                        your posts to drive local discovery.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Preview */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Eye className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Post Preview
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        See exactly how your post will look in the News Feed
                        before you publish. Perfect every detail.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Alt Text */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Accessibility
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Add accessible Alt Text to your images. Ensure your
                        content is inclusive for everyone in your community.
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
                16:9
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Image Resizer
                </h4>
                <p className="text-xs text-foreground/60">
                  Crop covers and posts for Facebook.
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
                  Create polished visuals for your Page.
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
              Grow your community.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Schedule your content, manage your
              reviews, and connect with your fans.
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
