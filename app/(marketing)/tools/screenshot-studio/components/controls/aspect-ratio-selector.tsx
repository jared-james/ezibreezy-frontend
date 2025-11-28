// app/(marketing)/tools/screenshot-studio/components/controls/aspect-ratio-selector.tsx

import { cn } from "@/lib/utils";
import { Ratio } from "lucide-react";
import { AspectRatio, RATIOS } from "../../constants";

interface AspectRatioSelectorProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
}

export function AspectRatioSelector({
  aspectRatio,
  setAspectRatio,
}: AspectRatioSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
        <Ratio className="w-3 h-3" />
        Canvas Size
      </label>
      <div className="grid grid-cols-4 gap-2">
        {RATIOS.map((ratio) => {
          const Icon = ratio.icon;
          return (
            <button
              key={ratio.id}
              onClick={() => setAspectRatio(ratio.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 border rounded-md transition-all h-[52px]",
                aspectRatio === ratio.id
                  ? "bg-foreground text-background-editorial border-foreground"
                  : "bg-white border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <div className="flex flex-col items-center leading-none gap-0.5">
                <span className="text-[9px] font-bold uppercase">
                  {ratio.label}
                </span>
                {ratio.subLabel && (
                  <span className="text-[8px] opacity-60 font-mono">
                    {ratio.subLabel}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
