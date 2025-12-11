// app/(marketing)/features/linkedin-scheduler/carousel-intro.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CarouselIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      {/* LEFT COLUMN: Visual Representation (Document Carousel) */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="flex justify-between items-start opacity-40 mb-8">
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-foreground/10 rounded-full" />
                  <div className="space-y-2">
                    <div className="w-32 h-3 bg-foreground/20" />
                    <div className="w-20 h-2 bg-foreground/10" />
                  </div>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest">
                  Fig 2. The Carousel
                </div>
              </div>

              {/* The Document Visual */}
              <div className="relative w-3/4 mx-auto aspect-[4/5] bg-white border border-foreground/10 shadow-lg transform rotate-2 transition-transform hover:rotate-0 group cursor-pointer">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
                <div className="p-6 flex flex-col h-full justify-center text-center">
                  <h3 className="font-serif text-3xl font-bold mb-4">
                    The Slide Deck
                  </h3>
                  <p className="font-serif text-sm text-foreground/60 leading-relaxed">
                    Share your expertise.
                    <br />
                    Frame by frame.
                  </p>
                  <div className="mt-8 flex justify-center gap-1 group-hover:gap-2 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                  </div>
                </div>
              </div>

              <p className="text-center font-mono text-[9px] uppercase tracking-widest text-brand-primary mt-8 font-bold">
                Native PDF Rendering
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Editorial Copy */}
      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          Give your expertise
          <br />
          <span className="italic font-normal">a place to shine.</span>
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          <p>
            <span className="float-left text-5xl font-black mr-3 -mt-2">Y</span>
            ou have insights that your industry needs to hear. The challenge
            isn&apos;t having the ideas; it&apos;s getting them out there
            consistently.
          </p>
          <p>
            The <strong>Editorial Desk</strong> supports your workflow. Whether
            you are sharing a quick text update, a detailed carousel, or a video
            insight, we provide the tools to format, preview, and publish your
            best work with confidence.
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            Draft Your Article{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
