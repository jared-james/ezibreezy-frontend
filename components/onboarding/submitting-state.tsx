// components/onboarding/submitting-state.tsx

"use client";

import { Sparkles } from "lucide-react";

export default function SubmittingState() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated Typewriter / Printing Press */}
      <div className="relative">
        {/* Outer rotating border */}
        <div className="w-24 h-24 rounded-full border-[3px] border-dashed border-foreground/20 flex items-center justify-center animate-[spin_3s_linear_infinite]">
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-brand-primary/10 animate-pulse" />
        </div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-serif text-2xl text-foreground font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
          Setting Up Your Desk
        </h3>
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
            Creating organization...
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
            Building workspace...
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
            Warming up the printing press...
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center pt-4">
        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
      </div>
    </div>
  );
}
