// app/(marketing)/tools/screenshot-studio/components/controls/frame-controls.tsx

import { cn } from "@/lib/utils";
import { LayoutTemplate } from "lucide-react";

interface FrameControlsProps {
  windowChrome: boolean;
  setWindowChrome: (val: boolean) => void;
}

export function FrameControls({
  windowChrome,
  setWindowChrome,
}: FrameControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          <LayoutTemplate className="w-3 h-3" />
          Window Frame
        </label>
        <button
          onClick={() => setWindowChrome(!windowChrome)}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
            windowChrome
              ? "bg-brand-primary text-white"
              : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
          )}
        >
          {windowChrome ? "MacOS Style" : "None"}
        </button>
      </div>
    </div>
  );
}
