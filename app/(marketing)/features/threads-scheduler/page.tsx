// app/(marketing)/features/threads-scheduler/page.tsx

import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scissors,
  MessageCircle,
  Image as ImageIcon,
  Video,
  Crop,
  Type,
  Layers,
  Sparkles,
  Hash,
  Heart,
  Repeat,
  UserPlus,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";
import { ThreadsIcon } from "@/components/landing-page/platform-icons";

export const metadata: Metadata = {
  title: "Threads Scheduler | Thread Composer & Carousels",
  description:
    "The editorial workspace for Threads. Schedule multi-post threads, mixed media carousels, and manage conversations from one desk.",
  alternates: {
    canonical: "/features/threads-scheduler",
  },
  openGraph: {
    title: "Threads Scheduler | EziBreezy",
    description: "The modern conversation. Schedule, visualize, and connect.",
    url: "https://www.ezibreezy.com/features/threads-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Threads Scheduler",
      },
    ],
    type: "website",
  },
};

export default function ThreadsSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Threads Scheduler | Thread Composer & Carousels"
        description="The editorial workspace for Threads. Schedule multi-post threads, mixed media carousels, and manage conversations."
        url="https://www.ezibreezy.com/features/threads-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Threads Scheduler"
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
                  Platform Specification: 07
                </span>
                <ThreadsIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
                Threads
              </h1>
            </div>
            <div className="md:text-right max-w-md">
              <p className="font-serif text-xl md:text-2xl leading-tight">
                The modern salon. <br />
                <span className="text-foreground/60 italic">
                  Where dialogue flows without friction.
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- SECTION 1: THE LEAD STORY --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
          {/* LEFT COLUMN: Visual Representation (Thread UI) */}
          <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

              <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                  {/* Thread Chain Visual */}
                  <div className="max-w-sm mx-auto w-full relative pl-4">
                    {/* Connecting Line */}
                    <div className="absolute left-[1.65rem] top-6 bottom-12 w-0.5 bg-foreground/10 -z-0" />

                    {/* Post 1 */}
                    <div className="relative z-10 mb-6">
                      <div className="flex gap-4 items-start">
                        <div className="w-9 h-9 rounded-full bg-black border-2 border-white shadow-sm shrink-0" />
                        <div className="flex-1 bg-white p-4 rounded-xl border border-foreground/10 shadow-sm">
                          <div className="h-2 w-24 bg-foreground/10 mb-3 rounded" />
                          <div className="space-y-1.5 mb-3">
                            <div className="h-2 w-full bg-foreground/80 rounded" />
                            <div className="h-2 w-5/6 bg-foreground/80 rounded" />
                          </div>
                          <div className="flex gap-4 opacity-30">
                            <Heart className="w-4 h-4" />
                            <MessageCircle className="w-4 h-4" />
                            <Repeat className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post 2 */}
                    <div className="relative z-10 pl-2">
                      <div className="flex gap-4 items-start">
                        <div className="w-7 h-7 rounded-full bg-black/80 border-2 border-white shadow-sm shrink-0 mt-2" />
                        <div className="flex-1 bg-white p-4 rounded-xl border border-foreground/10 shadow-sm">
                          <div className="h-2 w-20 bg-foreground/10 mb-3 rounded" />
                          <div className="space-y-1.5">
                            <div className="h-2 w-full bg-foreground/60 rounded" />
                            <div className="h-2 w-4/6 bg-foreground/60 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                    Automatic Thread Stitching
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Editorial Copy */}
          <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
              Start a conversation,
              <br />
              <span className="italic font-normal">not a monologue.</span>
            </h2>

            <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  T
                </span>
                hreads feels different. It is intimate. It is immediate. It is
                less about broadcasting to the masses and more about sitting in
                a circle with your community.
              </p>
              <p>
                The <strong>Editorial Desk</strong> removes the friction of
                participation. Write your thoughts naturally, and let our tools
                handle the splitting, tagging, and formatting so you can focus
                on the flow.
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
              >
                Start a Thread{" "}
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
                Read the
                <br />
                <span className="italic text-brand-primary">room.</span>
              </h2>
              <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
                In a conversation, listening is as important as speaking.
                Analytics help you listen at scale.
              </p>
              <p className="font-serif text-sm leading-relaxed text-foreground/70">
                Our intelligence report shows you which topics ignite dialogue,
                helping you steer the conversation where it naturally wants to
                go.
              </p>
            </div>

            {/* The Grid of Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
              {/* Metric 1 */}
              <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <UserPlus className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">Followers</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Circle Growth
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See how many people have pulled up a chair to listen to what
                  you have to say.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <div className="mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
                </div>
                <h4 className="font-bold font-serif text-lg mb-1">Likes</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Resonance
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Track the moments of agreement. See which sentiments connect
                  instantly.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <MessageCircle className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">Replies</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Dialogue
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The heart of Threads. Track the depth of the conversations you
                  start.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Repeat className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">Reposts</h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Amplification
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  See who is taking your message and sharing it with their own
                  circle.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
                <Hash className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Topic Tags
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Discovery
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  Analyze which tags are helping you reach new audiences outside
                  your following.
                </p>
              </div>

              {/* Metric 6 */}
              <div className="p-6 hover:bg-white transition-colors group">
                <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
                <h4 className="font-bold font-serif text-lg mb-1">
                  Engagement
                </h4>
                <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
                  Activity Rate
                </p>
                <p className="text-sm text-foreground/70 leading-snug">
                  The pulse of your profile. Measure the overall liveliness of
                  your presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE INBOX (Connection) --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Visual */}
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
                  The Salon
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                        <p className="text-xs font-serif italic text-foreground/80">
                          "This is exactly what I've been thinking about..."
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-foreground/20" />
                        <span className="font-mono text-[9px] uppercase text-brand-primary font-bold">
                          Reply Sent
                        </span>
                      </div>
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
                Be part of the
                <br />
                flow.
              </h2>

              <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
                <p>
                  Threads is not a place for "posting and ghosting." It is a
                  place for being present.
                </p>
                <p>
                  Our <strong>Unified Inbox</strong> ensures you never miss a
                  beat. Reply to comments and mentions from a calm, focused
                  environment, turning casual interactions into lasting
                  connections.
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
                        your visuals look intentional, whether it's a quick snap
                        or a polished graphic.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Native Threading */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <MessageCircle className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Auto-Threading
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Write as much as you need. We automatically split long
                        text into a connected chain of posts (500 chars each) so
                        your thought stays intact.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Carousels */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Layers className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Carousel Publishing
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Tell a visual story. Publish carousels with up to 10
                        images or videos that users can swipe through natively.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Mixed Media */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Mixed Media
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Combine photos and videos in the same post or carousel.
                        We handle the formatting so it looks seamless.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Topic Tags */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Hash className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Topic Tags
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Join the wider conversation. Add one Topic Tag per post
                        to help your content get discovered by the right people.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Text Publishing */}
                  <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                    <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block font-serif text-lg mb-1">
                        Text Publishing
                      </strong>
                      <p className="font-serif text-sm text-foreground/70">
                        Keep it simple. Publish text-only updates when you want
                        to spark a discussion without the need for visuals.
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
              href="/tools/instagram-carousel-splitter"
              className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
            >
              <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
                1/10
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Carousel Splitter
                </h4>
                <p className="text-xs text-foreground/60">
                  Create seamless panoramic swipes.
                </p>
              </div>
            </Link>

            <Link
              href="/tools/instagram-font-generator"
              className="group flex items-start gap-4 p-4 bg-background border border-foreground/10 hover:border-brand-primary transition-all"
            >
              <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center font-serif font-bold text-xl group-hover:text-brand-primary transition-colors">
                Aa
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans mb-1 group-hover:underline">
                  Font Generator
                </h4>
                <p className="text-xs text-foreground/60">
                  Add emphasis with bold/italic text.
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
              Find your circle.
            </h2>
            <p className="font-serif text-lg text-foreground/70 mb-10">
              The editorial desk is open. Schedule your thoughts and start the
              conversation.
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
