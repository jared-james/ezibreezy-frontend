// app/(marketing)/tools/screenshot-studio/components/controls/frame-controls.tsx

import { cn } from "@/lib/utils";
import { LayoutTemplate, Sparkles } from "lucide-react";

interface FrameControlsProps {
  windowChrome: boolean;
  setWindowChrome: (val: boolean) => void;
  showGlass: boolean;
  setShowGlass: (val: boolean) => void;
  glassPlane: number;
  setGlassPlane: (val: number) => void;
}

export function FrameControls({
  windowChrome,
  setWindowChrome,
  showGlass,
  setShowGlass,
  glassPlane,
  setGlassPlane,
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Glass Container
          </label>
          <button
            onClick={() => setShowGlass(!showGlass)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
              showGlass
                ? "bg-brand-primary text-white"
                : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
            )}
          >
            {showGlass ? "Active" : "Off"}
          </button>
        </div>

        {showGlass && (
          <div className="flex items-center gap-3 px-1 animate-in slide-in-from-top-1 fade-in duration-200">
            <span className="text-[9px] font-mono text-foreground/40 w-8">
              SIZE
            </span>
            <input
              type="range"
              min="10"
              max="120"
              value={glassPlane}
              onChange={(e) => setGlassPlane(parseInt(e.target.value))}
              className="flex-1 h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
            />
            <span className="text-[9px] font-mono font-bold w-6 text-right">
              {glassPlane}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
