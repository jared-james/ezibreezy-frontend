// components/landing-page/landing-page-poster.tsx

"use client";

import { Sparkles, PenTool, BrainCircuit, Fingerprint } from "lucide-react";
// Changed import
import InstagramGridBoard from "./instagram-grid";

export default function LandingPagePoster() {
  return (
    <section className="bg-background border-b border-foreground relative overflow-hidden">
      <div className="px-6 py-24 mx-auto w-full max-w-7xl relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Column: Content */}
          <div className="flex flex-col justify-center h-full">
            <p className="eyebrow mb-4 text-brand-primary font-bold">
              The Final Word
            </p>

            <h2 className="font-serif text-5xl md:text-6xl font-black leading-[0.95] mb-8 tracking-tighter">
              A workflow that respects your taste.
            </h2>

            <div className="prose prose-lg text-foreground/80 font-serif mb-10 leading-relaxed">
              <p>
                It is time to build your brand and service your clients in a way
                that feels{" "}
                <span className="italic font-bold text-foreground">
                  enjoyable
                </span>
                , not exhausting.
              </p>
              <br />
              <p>
                We believe software shouldn't just be a utility bucket for your
                files. It should be a creative partner. One that understands the
                difference between "content" and "connection."
              </p>
            </div>

            <div className="bg-surface-hover border-l-4 border-brand-primary p-6 md:p-8 relative mt-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
              <div className="absolute -top-3 left-6 bg-brand-primary text-brand-primary-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest font-bold border border-foreground">
                Active Development
              </div>

              <h3 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-brand-primary" />
                Contextual Intelligence.
              </h3>

              <div className="space-y-4 text-sm font-serif text-foreground/80 leading-relaxed">
                <p>
                  The internet is drowning in beige, robotic text. We refuse to
                  contribute to the noise. We are building the antidote to "AI
                  Slop." An <strong>Idea Engine</strong> that studies your
                  strategy and actually executes.
                </p>
                <p>
                  It doesn't matter if you are a{" "}
                  <span className="font-bold text-foreground">
                    Custom Home Builder
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Fine Dining Sous Chef
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Bootstrapped SaaS Founder
                  </span>
                  , an{" "}
                  <span className="font-bold text-foreground">
                    Interior Designer
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Performance Coach
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Boutique Hotelier
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Wedding Photographer
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Sustainable Fashion Brand
                  </span>
                  , a{" "}
                  <span className="font-bold text-foreground">
                    Real Estate Agent
                  </span>
                  , or an{" "}
                  <span className="font-bold text-foreground">
                    Indie Game Developer
                  </span>
                  ...
                </p>
                <p className="font-medium text-foreground">
                  Our complex system understands the nuance of <em>your</em>{" "}
                  industry. No more GPT fluff. Language that sounds human.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-foreground/20 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider opacity-60">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-3 h-3" />
                  True Voice
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Deep Context
                </span>
                <span className="flex items-center gap-1.5">
                  <PenTool className="w-3 h-3" />
                  Zero Fluff
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Grid Planner */}
          <div className="w-full mt-8 lg:mt-0 lg:pt-24 flex flex-col items-center">
            {/* Sticky Wrapper */}
            <div className="sticky top-24 w-full max-w-md">
              {/* THE GRID COMPONENT */}
              <InstagramGridBoard />

              {/* Decoration under the board */}
              <div className="mt-8 flex justify-between items-center px-6 opacity-60">
                <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest text-foreground">
                  <span>Fig. 02</span>
                  <span>//</span>
                  <span>Grid_Preview</span>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-foreground">
                  System: Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
