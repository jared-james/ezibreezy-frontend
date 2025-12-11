// app/(marketing)/features/youtube-scheduler/visuals.tsx

import { Play, Heart } from "lucide-react";

export function YouTubeHeroVisual() {
  return (
    <>
      {/* Video Player Mockup */}
      <div className="w-full aspect-video bg-black relative group cursor-pointer overflow-hidden border border-foreground/10 shadow-xl">
        {/* Thumbnail Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-700 opacity-80" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
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
    </>
  );
}

export function YouTubeInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;I&apos;ve been subscribed for 3 years and this is your best
              work yet.&quot;
            </p>
          </div>
          {/* Reply Indicator */}
          <div className="flex items-center gap-2 pl-1">
            <div className="h-px w-4 bg-foreground/20" />
            <span className="font-mono text-[9px] uppercase text-brand-primary font-bold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-brand-primary" /> Hearted & Replied
            </span>
          </div>
        </div>
      </div>

      {/* Second Comment (Ghosted) */}
      <div className="flex items-start gap-4 opacity-50">
        <div className="w-6 h-6 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-2 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <div className="h-2 w-24 bg-foreground/10 rounded mb-1" />
            <div className="h-2 w-16 bg-foreground/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
