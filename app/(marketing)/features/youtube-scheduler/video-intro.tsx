// app/(marketing)/features/youtube-scheduler/video-intro.tsx

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function VideoIntro() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-foreground mb-16">
      {/* LEFT COLUMN: Visual Representation (Video Player) */}
      <div className="lg:col-span-7 lg:border-r border-foreground pt-8 lg:pr-12 pb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-dashed border-foreground/20 bg-foreground/5 -z-10" />

          {/* UPDATED SHADOW: Now uses var(--random-blue) */}
          <div className="bg-white border-2 border-foreground p-1 shadow-[8px_8px_0_0_var(--random-blue)]">
            <div className="bg-background-editorial border border-dashed border-foreground/20 p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              {/* Video Player Mockup */}
              <div className="w-full aspect-video bg-black relative group cursor-pointer overflow-hidden border border-foreground/10 shadow-xl">
                {/* Thumbnail Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-700 opacity-80" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                  <div className="h-full w-1/3 bg-red-600" />
                </div>

                {/* Metadata Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex justify-between items-start text-white">
                    <h3 className="font-sans font-bold text-lg drop-shadow-md">
                      The Art of Storytelling
                    </h3>
                    <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono">
                      SCHEDULED
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/60">
                    Upload Complete
                  </span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-primary font-bold">
                  4K Resolution
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Editorial Copy */}
      <div className="lg:col-span-5 lg:pl-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[0.95] mb-8">
          Your content is
          <br />
          <span className="italic font-normal">an asset.</span>
        </h2>

        <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed mb-10">
          <p>
            <span className="float-left text-5xl font-black mr-3 -mt-2">V</span>
            ideo is not just another post type. It is an investment. It requires
            time, craft, and vision.
          </p>
          <p>
            The <strong>Editorial Desk</strong> treats your uploads with the
            care they deserve. We handle the technical details—metadata,
            thumbnails, privacy settings—so you can focus on the story you are
            trying to tell.
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-foreground/30">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] border-b-2 border-foreground hover:text-brand-primary hover:border-brand-primary transition-colors pb-1"
          >
            Schedule Your Premiere{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
