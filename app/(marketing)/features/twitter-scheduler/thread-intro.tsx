// app/(marketing)/features/twitter-scheduler/thread-intro.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ThreadIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      {/* LEFT COLUMN: Visual Representation (Threads) */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              {/* Thread Visual */}
              <div className="max-w-sm mx-auto w-full space-y-4">
                {/* Tweet 1 */}
                <div className="bg-white p-4 border border-foreground/10 rounded-lg shadow-sm relative z-10">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20" />
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-foreground/10 mb-2 rounded" />
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-foreground/20 rounded" />
                        <div className="h-2 w-3/4 bg-foreground/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="absolute left-[3.25rem] top-16 bottom-20 w-0.5 bg-foreground/10 -z-0" />

                {/* Tweet 2 */}
                <div className="bg-white p-4 border border-foreground/10 rounded-lg shadow-sm relative z-10 ml-8 transform rotate-1">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20" />
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-foreground/10 mb-2 rounded" />
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-foreground/20 rounded" />
                        <div className="h-2 w-1/2 bg-foreground/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                Native Thread Construction
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Editorial Copy */}
      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          The art of the
          <br />
          <span className="italic font-normal">short form.</span>
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          <p>
            <span className="float-left text-5xl font-black mr-3 -mt-2">
              W
            </span>
            riting simply is often harder than writing at length. Every
            character counts. Every word must earn its place.
          </p>
          <p>
            The <strong>Editorial Desk</strong> helps you craft clarity.
            Whether it&apos;s a single powerful statement or a thoughtfully woven
            thread, we give you the tools to structure your thoughts so they
            land with impact.
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            Compose Your Thread{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
