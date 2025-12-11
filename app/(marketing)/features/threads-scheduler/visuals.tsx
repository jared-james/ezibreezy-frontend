// app/(marketing)/features/threads-scheduler/visuals.tsx

import { Heart, MessageCircle, Repeat, AtSign } from "lucide-react";

export function ThreadsHeroVisual() {
  return (
    <>
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
    </>
  );
}

export function ThreadsInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;This is exactly what I&apos;ve been thinking about...&quot;
            </p>
          </div>
          {/* Reply Indicator */}
          <div className="flex items-center gap-2 pl-1">
            <div className="h-px w-4 bg-foreground/20" />
            <span className="font-mono text-[9px] uppercase text-brand-primary font-bold flex items-center gap-1">
              <AtSign className="w-3 h-3" /> Reply Sent
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
