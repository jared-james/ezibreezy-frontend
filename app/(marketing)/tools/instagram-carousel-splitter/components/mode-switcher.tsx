// app/(marketing)/tools/instagram-carousel-splitter/components/mode-switcher.tsx

import { Images, LayoutGrid, ToggleLeft } from "lucide-react";
import { SplitMode } from "@/lib/tools/image-processing";
import { cn } from "@/lib/utils";

interface ModeSwitcherProps {
  mode: SplitMode;
  onModeChange: (mode: SplitMode) => void;
}

export function ModeSwitcher({ mode, onModeChange }: ModeSwitcherProps) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-auto">
      <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
        <ToggleLeft className="w-3 h-3" />
        Operation Mode
      </label>

      <div className="flex w-full md:w-auto p-1 border border-dashed border-foreground/30 bg-background-editorial/50">
        {/* Carousel Option */}
        <button
          onClick={() => onModeChange("carousel")}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200",
            mode === "carousel"
              ? "bg-foreground text-background-editorial shadow-sm"
              : "text-foreground/50 hover:text-foreground hover:bg-white/50"
          )}
        >
          <Images className="w-3 h-3" />
          Carousel
        </button>

        {/* Grid Option */}
        <button
          onClick={() => onModeChange("grid")}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200",
            mode === "grid"
              ? "bg-foreground text-background-editorial shadow-sm"
              : "text-foreground/50 hover:text-foreground hover:bg-white/50"
          )}
        >
          <LayoutGrid className="w-3 h-3" />
          Grid
        </button>
      </div>
    </div>
  );
}
