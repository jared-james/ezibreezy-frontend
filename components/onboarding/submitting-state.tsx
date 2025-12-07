// components/onboarding/submitting-state.tsx

"use client";

import Image from "next/image";

export default function SubmittingState() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-12">
      {/* The Stamp / Placeholder for future video */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        {/* Outer rotating ring to indicate activity */}
        <div className="absolute inset-0 border-4 border-dashed border-foreground/10 rounded-full animate-[spin_10s_linear_infinite]" />

        <Image
          src="/logo_smile.webp"
          alt="Building your desk"
          width={80}
          height={80}
          className="grayscale contrast-125 animate-pulse"
        />
      </div>

      <div className="space-y-3 text-center max-w-xs mx-auto">
        <h3 className="font-serif text-2xl text-foreground font-medium flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          Building Desk
        </h3>
        <div className="space-y-1 animate-in fade-in slide-in-from-bottom-3 delay-100">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">
            Hammering things together...
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/30">
            (This might take a moment)
          </p>
        </div>
      </div>
    </div>
  );
}
