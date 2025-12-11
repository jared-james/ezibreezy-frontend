// app/(marketing)/features/pinterest-scheduler/visuals.tsx

import { Pin, MessageCircle } from "lucide-react";

export function PinterestHeroVisual() {
  return (
    <>
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
    </>
  );
}

export function PinterestInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;Tried this tutorial last weekend. The results were
              amazing!&quot;
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
