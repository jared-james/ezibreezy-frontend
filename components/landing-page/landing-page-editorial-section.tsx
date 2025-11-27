// components/landing-page/landing-page-editorial-section.tsx

import { Zap, Layers, Ban, Lock, Globe, Wallet } from "lucide-react";

export default function LandingPageEditorialSection() {
  return (
    <section className="bg-background-editorial text-foreground py-20 px-6 border border-foreground">
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
          {/* COLUMN 1: THE PAIN (The Complaint Column) */}
          <div className="lg:col-span-5">
            <div className="relative border-2 border-foreground border-dashed bg-surface-hover p-6 md:p-8">
              {/* "Rejected" Stamp Visual */}
              <div className="absolute -top-4 -left-4 z-10 rotate-[-6deg] border-2 border-foreground bg-surface px-2 py-1 shadow-[2px_2px_0_0_var(--foreground)]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-600">
                  Exhibit A: The Old Way
                </span>
              </div>

              <h3 className="mb-6 font-serif text-3xl font-bold leading-tight">
                Why does posting feel like punishment?
              </h3>

              <div className="space-y-8">
                {/* Pain Point 1: The Channel Tax */}
                <div className="group flex items-start gap-4 opacity-80 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-red-600/30 bg-red-50 p-1 text-red-600">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-red-700">
                      The "Channel Ransom"
                    </strong>
                    You want to post to X <em>and</em> LinkedIn? That’s a plan
                    upgrade. Want to add a team member? Enterprise tier.
                    <br />
                    <span className="mt-1 block italic text-foreground/60">
                      "Sorry, your budget only allows you to be famous on
                      Facebook today."
                    </span>
                  </div>
                </div>

                {/* Pain Point 2: Context Switching */}
                <div className="group flex items-start gap-4 opacity-80 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-red-600/30 bg-red-50 p-1 text-red-600">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-red-700">
                      The Context Switching
                    </strong>
                    One app for writing. Another for scheduling. A drive for
                    images. A spreadsheet for approvals. You are paying $200/mo
                    just to be disorganized.
                  </div>
                </div>

                {/* Pain Point 3: The Complexity */}
                <div className="group flex items-start gap-4 opacity-80 transition-opacity hover:opacity-100">
                  <div className="mt-1 rounded border border-red-600/30 bg-red-50 p-1 text-red-600">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <strong className="mb-1 block font-sans text-xs uppercase tracking-wider text-red-700">
                      The Complexity
                    </strong>
                    Why do you need a PhD in project management just to post a
                    meme? If the tool is harder to use than the social network
                    itself, it's broken.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: THE SOLUTION (The Manifesto) */}
          <div className="lg:col-span-7">
            <h2 className="mb-8 font-serif text-5xl font-black leading-[0.9] tracking-tight md:text-6xl">
              A complete solution.
              <br />
              <span className="italic font-light">Zero gatekeeping.</span>
            </h2>

            <p className="article-body mb-10 border-l-4 border-brand-primary pl-6 text-lg leading-relaxed md:text-xl">
              We don't charge you for being ambitious. We believe you shouldn't
              have to choose which audience you can afford to talk to.
            </p>

            {/* The "Classifieds" Feature Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Feature 1: The Channel Fix */}
              <div className="group border-2 border-foreground bg-surface p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--foreground)]">
                <div className="mb-3 flex items-start justify-between">
                  <Globe className="h-6 w-6 text-foreground transition-transform group-hover:scale-110" />
                  <span className="font-mono text-[9px] uppercase border border-foreground bg-brand-primary px-1 text-brand-primary-foreground">
                    Unlocked
                  </span>
                </div>
                <h4 className="mb-2 font-serif text-lg font-bold">
                  Every Channel. Period.
                </h4>
                <p className="font-serif text-sm leading-snug text-foreground/70">
                  We include every platform on every plan. No per-channel
                  pricing. No "seat taxes." Go ahead, launch that TikTok
                  account. It's on the house.
                </p>
              </div>

              {/* Feature 2: All in One */}
              <div className="group border-2 border-foreground bg-surface p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--foreground)]">
                <div className="mb-3 flex items-start justify-between">
                  <Layers className="h-6 w-6 text-foreground transition-transform group-hover:scale-110" />
                  <span className="font-mono text-[9px] uppercase border border-foreground px-1">
                    Unified
                  </span>
                </div>
                <h4 className="mb-2 font-serif text-lg font-bold">
                  The Everything App
                </h4>
                <p className="font-serif text-sm leading-snug text-foreground/70">
                  Write, design, schedule, and analyze. We folded the entire
                  marketing stack into one intuitive tab so you can stay in
                  flow.
                </p>
              </div>

              {/* Feature 3: Intuitive */}
              <div className="group border-2 border-foreground bg-surface p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--foreground)]">
                <div className="mb-3 flex items-start justify-between">
                  <Zap className="h-6 w-6 text-foreground transition-transform group-hover:scale-110" />
                  <span className="font-mono text-[9px] uppercase border border-foreground px-1">
                    Fast
                  </span>
                </div>
                <h4 className="mb-2 font-serif text-lg font-bold">
                  Flow State First
                </h4>
                <p className="font-serif text-sm leading-snug text-foreground/70">
                  No clunky dashboards. An interface designed to get out of your
                  way so you can just create. It feels like magic, not data
                  entry.
                </p>
              </div>

              {/* Feature 4: Pricing */}
              <div className="group border-2 border-foreground bg-surface p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--foreground)]">
                <div className="mb-3 flex items-start justify-between">
                  <Wallet className="h-6 w-6 text-foreground transition-transform group-hover:scale-110" />
                  <span className="font-mono text-[9px] uppercase border border-foreground px-1">
                    Fair
                  </span>
                </div>
                <h4 className="mb-2 font-serif text-lg font-bold">
                  Creator Pricing
                </h4>
                <p className="font-serif text-sm leading-snug text-foreground/70">
                  Stop paying the "Enterprise Tax." We offer premium features at
                  a price that actually makes sense for humans, not just
                  corporations. Corporations... we have you covered too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
