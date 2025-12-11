// app/(marketing)/features/tiktok-scheduler/visuals.tsx

import { CheckCircle2, MessageCircle } from "lucide-react";

export function TikTokHeroVisual() {
  return (
    <>
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
    </>
  );
}

export function TikTokInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;I needed to hear this today. Thank you!&quot;
            </p>
          </div>
          {/* Reply Indicator */}
          <div className="flex items-center gap-2 pl-1">
            <div className="h-px w-4 bg-foreground/20" />
            <span className="font-mono text-[9px] uppercase text-brand-primary font-bold flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> Reply Sent
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
