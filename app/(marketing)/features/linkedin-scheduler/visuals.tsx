// app/(marketing)/features/linkedin-scheduler/visuals.tsx

import { Linkedin } from "lucide-react";

export function LinkedInHeroVisual() {
  return (
    <>
      <div className="flex justify-between items-start opacity-40 mb-8">
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-foreground/10 rounded-full" />
          <div className="space-y-2">
            <div className="w-32 h-3 bg-foreground/20" />
            <div className="w-20 h-2 bg-foreground/10" />
          </div>
        </div>
        {/* Figure Label is handled by the parent component prop, but kept here if specific positioning needed 
            Actually, the shared component handles the top right label via figLabel prop. 
            We will leave this visual structure clean.
        */}
      </div>

      {/* The Document Visual */}
      <div className="relative w-3/4 mx-auto aspect-[4/5] bg-white border border-foreground/10 shadow-lg transform rotate-2 transition-transform hover:rotate-0 group cursor-pointer">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
        <div className="p-6 flex flex-col h-full justify-center text-center">
          <h3 className="font-serif text-3xl font-bold mb-4">The Slide Deck</h3>
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
    </>
  );
}

export function LinkedInInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;Great insight. How do you handle the...&quot;
            </p>
          </div>
          {/* Reply Indicator */}
          <div className="flex items-center gap-2 pl-1">
            <div className="h-px w-4 bg-foreground/20" />
            <span className="font-mono text-[9px] uppercase text-brand-primary font-bold flex items-center gap-1">
              <Linkedin className="w-3 h-3" /> Reply Sent
            </span>
          </div>
        </div>
      </div>

      {/* Second Comment Visual (Ghosted/Smaller) */}
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
