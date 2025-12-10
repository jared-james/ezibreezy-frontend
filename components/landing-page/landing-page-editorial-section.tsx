// components/landing-page/landing-page-editorial-section.tsx

import { Zap, Layers, Ban, Lock, Globe, Wallet, Eye, Grid } from "lucide-react";

export default function LandingPageEditorialSection() {
  return (
    <section className="bg-background-editorial text-foreground py-20 px-6 border-y border-foreground">
      <div className="mx-auto w-full max-w-7xl">
        {/* SECTION HEADER: Editorial Opinion */}
        <div className="mb-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-foreground" />
          <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
            Editorial Opinion
          </span>
          <div className="flex-1 h-px bg-foreground" />
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* COLUMN 1: THE PAIN */}
          <div className="lg:col-span-5">
            <div className="relative border-2 border-foreground border-dashed bg-surface-hover p-6 md:p-8">
              <p className="mb-6 font-serif text-3xl font-bold leading-tight">
                Why does posting feel like punishment?
              </p>

              <div className="space-y-8">
                {/* 1. The Content Guilt */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      The Content Guilt
                    </strong>
                    You tell yourself you’ll post more consistently, but paying
                    work and actual life keep getting in the way. Every week
                    ends with the same promise that next week will be different.
                    <br />
                  </div>
                </div>

                {/* 2. The Context Switching */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      The Context Switching
                    </strong>
                    You’re bouncing between tools, one for brainstorming, one
                    for writing, one for visuals, one for publishing. The
                    momentum dies somewhere between app number two and three.
                  </div>
                </div>

                {/* 3. The Blank Page */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      The Blank Page
                    </strong>
                    Half-formed concepts everywhere, your camera roll is a
                    graveyard of "I'll use this later" screenshots, notes app
                    chaos across platforms, but when it's time to post, there's
                    just that intimidating blank space.
                  </div>
                </div>

                {/* 4. The Invisible Expert */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      The Invisible Expert
                    </strong>
                    You’re doing the work, getting results, and saying smart
                    things all day on calls and in docs. But almost none of that
                    makes it to your feed, so the people who’d benefit from it
                    never even know you exist.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: THE SOLUTION */}
          <div className="lg:col-span-7">
            <h2 className="mb-8 font-serif text-5xl font-black leading-[0.9] tracking-tight md:text-6xl">
              Made for creators
              <br />
              <span className="italic font-light">who care what they say.</span>
            </h2>

            <p className="article-body mb-12 border-l-4 border-brand-primary pl-6 text-lg leading-relaxed md:text-xl">
              We’re here for the “I know what I want to say, I just can’t get it
              out” part. Turn brain-dumps, old posts, and client work into
              drafts, caption options, and cross-channel versions, so you’re
              refining instead of starting from nothing.
            </p>

            {/* NEW LAYOUT: Clean Editorial Grid (No boxes, no hover effects) */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
              {/* Feature 1: Raw to Refined (AI) */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4"></div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  Don&apos;t start from zero.
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  Stop staring at a blinking cursor. Paste your raw notes, daily
                  work logs, or a link you reacted to. We identify the concept,
                  strip out the noise, and structure it into a "Clipping", a
                  draft that’s 80% ready before you even start writing.
                </p>
              </div>

              {/* Feature 2: Intelligent Assets (Media) */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4"></div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  Assets that adapt.
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  Context switching kills momentum, and so does resizing images.
                  Upload your media once. We handle the specific cropping for X,
                  the aspect ratios for LinkedIn, and the format conversions for
                  TikTok automatically.
                </p>
              </div>

              {/* Feature 3: Context Boundaries (Workspaces) */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4"></div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  Workspaces
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  Most tools lump everything together. We use distinct
                  Workspaces with their own timezones, libraries, and tags. Your
                  personal brand never touches your client work. Your brain
                  operates in different modes; your tool should too.
                </p>
              </div>

              {/* Feature 4: The Quality Gate (Approvals) */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4"></div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  Review before release.
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  Whether it’s a client sign-off or just a second pair of eyes,
                  our built-in approval workflows ensure nothing goes live by
                  accident. Set policies, track changes, and refine the work
                  without leaving the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
