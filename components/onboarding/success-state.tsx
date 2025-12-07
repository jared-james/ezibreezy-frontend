// components/onboarding/success-state.tsx

"use client";

import { CheckCircle2 } from "lucide-react";

export default function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
          {/* Decorative outer ring */}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600 animate-in zoom-in duration-300" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-2xl text-foreground font-medium">
          Workspace Created
        </h3>
        <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 animate-pulse">
          Entering the newsroom...
        </p>
      </div>

      <div className="flex gap-2 justify-center opacity-50 pt-4">
        {/* Fake progress indicators */}
        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" />
      </div>
    </div>
  );
}
