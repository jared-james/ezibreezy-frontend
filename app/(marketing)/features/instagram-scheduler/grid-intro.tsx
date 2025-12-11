// app/(marketing)/features/instagram-scheduler/grid-intro.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InstagramGridBoard from "@/components/landing-page/instagram-grid";

export default function GridIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />
          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-6">
              <div className="flex justify-between items-center mb-6 opacity-60 font-mono text-[10px] uppercase tracking-widest">
                <span>Fig 1. The Visual Canvas</span>
                <span>Interactive Preview</span>
              </div>
              <InstagramGridBoard />
              <div className="mt-6 text-center">
                <p className="font-mono text-xs text-brand-primary font-bold uppercase tracking-widest">
                  ↑ Drag to Reorder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          Don&apos;t just post.
          <br />
          <span className="italic font-normal">Tell a story.</span>
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          <p>
            <span className="float-left text-5xl font-black mr-3 -mt-2">W</span>
            e often mistake the feed for a billboard, shouting at strangers as
            they scroll by. But the feed is not a place for shouting. It is a
            place for resonance.
          </p>
          <p>
            The <strong>Visual Planner</strong> allows you to step back and see
            the bigger picture. It gives you the space to ensure that every
            piece of content isn&apos;t just filling a slot, but contributing to the
            feeling you want to leave behind.
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            Start Your Grid{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
