// app/(marketing)/features/tiktok-scheduler/phone-intro.tsx

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function PhoneIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      {/* LEFT COLUMN: Visual Representation */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          {/* UPDATED SHADOW: Now uses var(--random-blue) */}
          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_var(--random-blue)]">
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
            <span className="float-left text-5xl font-black mr-3 -mt-2">T</span>
            here is a unique energy to TikTok. It moves fast. It demands
            authenticity. It rewards the brave.
          </p>
          <p>
            The <strong>Editorial Desk</strong> is designed to help you harness
            that energy without getting swept away by it. Plan your performance,
            organize your visuals, and release your work when the audience is
            ready to applaud.
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
  );
}
