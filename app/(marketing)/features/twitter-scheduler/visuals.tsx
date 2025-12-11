// app/(marketing)/features/twitter-scheduler/visuals.tsx

import { AtSign } from "lucide-react";

export function TwitterHeroVisual() {
  return (
    <>
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
    </>
  );
}

export function TwitterInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;This thread changed how I look at...&quot;
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
