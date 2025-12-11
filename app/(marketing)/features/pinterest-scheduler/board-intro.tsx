// app/(marketing)/features/pinterest-scheduler/board-intro.tsx

import Link from "next/link";
import { ArrowRight, Pin } from "lucide-react";

export default function BoardIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      {/* LEFT COLUMN: Visual Representation (Mood Board) */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          {/* UPDATED SHADOW: Now uses var(--random-blue) */}
          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_var(--random-blue)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              {/* Pin Layout Visual */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                {/* Left Column (Staggered) */}
                <div className="flex flex-col gap-4">
                  <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                    <div className="aspect-[2/3] bg-gray-100 rounded-md mb-2 relative overflow-hidden group">
                      <div className="absolute top-2 right-2 p-1.5 bg-brand-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pin className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="h-2 w-16 bg-foreground/10 rounded" />
                  </div>
                  <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                    <div className="aspect-square bg-gray-100 rounded-md mb-2" />
                    <div className="h-2 w-20 bg-foreground/10 rounded" />
                  </div>
                </div>

                {/* Right Column (Staggered) */}
                <div className="flex flex-col gap-4 pt-8">
                  <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                    <div className="aspect-[3/4] bg-gray-100 rounded-md mb-2" />
                    <div className="h-2 w-12 bg-foreground/10 rounded" />
                  </div>
                  <div className="bg-white p-2 border border-foreground/10 shadow-sm rounded-lg">
                    <div className="aspect-[2/3] bg-gray-100 rounded-md mb-2 relative">
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      </div>
                    </div>
                    <div className="h-2 w-24 bg-foreground/10 rounded" />
                  </div>
                </div>
              </div>

              <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                Visual Curation Engine
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Editorial Copy */}
      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          Curate your
          <br />
          <span className="italic font-normal">legacy.</span>
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          <p>
            <span className="float-left text-5xl font-black mr-3 -mt-2">O</span>
            ther platforms are about <em>now</em>. Pinterest is about{" "}
            <em>next</em>. It is where people go to plan their futures, not just
            scroll through their present.
          </p>
          <p>
            The <strong>Editorial Desk</strong> helps you build a library that
            lasts. Organize your inspiration, schedule your pins, and create a
            resource that people will return to for years to come.
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            Build Your Archive{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
