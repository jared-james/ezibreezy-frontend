// app/(marketing)/features/threads-scheduler/thread-intro.tsx

import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, Repeat } from "lucide-react";

export default function ThreadIntro() {
  return (
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
  );
}
