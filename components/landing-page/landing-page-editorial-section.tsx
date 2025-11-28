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
          {/* COLUMN 1: THE PAIN (Unchanged) */}
          <div className="lg:col-span-5">
            <div className="relative border-2 border-foreground border-dashed bg-surface-hover p-6 md:p-8">
              {/* "Rejected" Stamp Visual */}
              <div className="absolute -top-4 -left-4 z-10 rotate-[-6deg] border-2 border-foreground bg-surface px-2 py-1 shadow-[2px_2px_0_0_var(--foreground)]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9b2c2c]">
                  Exhibit A: The Old Way
                </span>
              </div>

              <p className="mb-6 font-serif text-3xl font-bold leading-tight">
                Why does posting feel like punishment?
              </p>

              <div className="space-y-8">
                {/* 1. The Channel Ransom */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      {`The "Channel Ransom"`}
                    </strong>
                    You want to post to X <em>and</em> LinkedIn? That’s a plan
                    upgrade. Want to add a team member? Enterprise tier.
                    <br />
                    <span className="mt-1.5 block italic font-medium text-foreground/90">
                      {`"Sorry, your budget only allows you to be famous on
                      Facebook today."`}
                    </span>
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
                    One app for writing. Another for scheduling. A drive for
                    images. You are paying $200/mo just to be disorganized.
                  </div>
                </div>

                {/* 3. The Complexity */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      The Complexity
                    </strong>
                    Why do you need a PhD in project management just to post a
                    meme? If the tool is harder to use than the social network
                    itself, it's broken.
                  </div>
                </div>

                {/* 4. The Feed Anxiety */}
                <div className="group flex items-start gap-4 opacity-90 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-[#9b2c2c]/30 bg-[#9b2c2c]/10 p-1 text-[#9b2c2c]">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-[#9b2c2c]">
                      The Feed Anxiety
                    </strong>
                    Trying to write deep thoughts inside a chaotic social app is
                    impossible. You feel watched before you even hit publish.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: THE SOLUTION (Redesigned) */}
          <div className="lg:col-span-7">
            <h2 className="mb-8 font-serif text-5xl font-black leading-[0.9] tracking-tight md:text-6xl">
              A complete solution.
              <br />
              <span className="italic font-light">Zero gatekeeping.</span>
            </h2>

            <p className="article-body mb-12 border-l-4 border-brand-primary pl-6 text-lg leading-relaxed md:text-xl">
              We don't charge you for being ambitious. We believe you shouldn't
              have to choose which audience you can afford to talk to.
            </p>

            {/* NEW LAYOUT: Clean Editorial Grid (No boxes, no hover effects) */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
              {/* Feature 1: The Channel Fix */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4">
                  <Globe className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                    Unlocked
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  Every Channel. Period.
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  We include every platform on every plan. No per-channel
                  pricing. No "seat taxes." Go ahead, launch that TikTok account
                  or spin up a new LinkedIn page. It's on the house.
                </p>
              </div>

              {/* Feature 2: Unified Workflow */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4">
                  <Grid className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                    Consolidated
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  The Command Center
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  Stop tabbing between Notes apps, Spreadsheets, and scheduling
                  tools. From that first spark of an idea to your final Media
                  Room assets, your entire workflow is finally in one view.
                </p>
              </div>

              {/* Feature 3: Simplicity (Changed from Flow State to Clarity) */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4">
                  <Zap className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                    Focused
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  The Idea Engine
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  {`You don't need a tool to hold your posts; you need help creating them. We turn your daily grind into actual strategy, not another PowerPoint "strategy". We bridge the gap between your loose ideas and a published narrative.`}
                </p>
              </div>

              {/* Feature 4: Scalable Pricing */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between border-t border-foreground pt-4">
                  <Wallet className="h-5 w-5 text-foreground" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                    Scalable
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold">
                  Universal Pricing
                </h3>
                <p className="font-serif text-sm leading-relaxed text-foreground/80">
                  Small business budget, Enterprise capabilities. Whether you
                  manage one brand or fifty, our two simple plans adapt to you.
                  Finally, a tool that wants you to grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
