// app/(marketing)/tools/instagram-carousel-splitter/components/carousel-controls.tsx

import { Maximize, Smartphone, Square, Minus, Plus } from "lucide-react";
import { AspectRatio } from "@/lib/tools/image-processing";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  slides: number;
  aspectRatio: AspectRatio;
  onSlidesChange: (slides: number) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

export function CarouselControls({
  slides,
  aspectRatio,
  onSlidesChange,
  onAspectRatioChange,
}: CarouselControlsProps) {
  const handleSlidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(10, Math.max(2, parseInt(e.target.value) || 2));
    onSlidesChange(value);
  };

  return (
    <div className="grid grid-cols-1 md:flex md:flex-row gap-6 md:gap-12 w-full md:w-auto items-end">
      {/* Slide Count Input */}
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          <span className="w-2 h-px bg-foreground/30" />
          Split Count
        </label>

        <div className="flex items-center w-full md:w-auto h-12">
          {/* Minus Button */}
          <button
            onClick={() => onSlidesChange(Math.max(2, slides - 1))}
            className="h-full w-12 flex-none flex items-center justify-center border border-dashed border-foreground/30 hover:border-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            aria-label="Decrease slides"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Number Display */}
          <div className="h-full w-16 border-y border-dashed border-foreground/30 flex items-center justify-center bg-background-editorial/50">
            <input
              type="number"
              min={2}
              max={10}
              value={slides}
              onChange={handleSlidesChange}
              className="w-full text-center font-mono text-xl font-bold bg-transparent focus:outline-none appearance-none p-0"
            />
          </div>

          {/* Plus Button */}
          <button
            onClick={() => onSlidesChange(Math.min(10, slides + 1))}
            className="h-full w-12 flex-none flex items-center justify-center border border-dashed border-foreground/30 hover:border-foreground hover:bg-foreground/5 active:bg-foreground/10 transition-all"
            aria-label="Increase slides"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          <span className="w-2 h-px bg-foreground/30" />
          Crop Ratio
        </label>

        <div className="grid grid-cols-3 gap-3 w-full md:flex md:w-auto">
          {[
            { id: "square", icon: Square, label: "1:1" },
            { id: "portrait", icon: Smartphone, label: "4:5" },
            { id: "original", icon: Maximize, label: "Full" },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onAspectRatioChange(ratio.id as AspectRatio)}
              title={ratio.label}
              className={cn(
                "group relative h-12 min-w-[3.5rem] px-3 flex items-center justify-center gap-2 transition-all duration-300",
                aspectRatio === ratio.id
                  ? "bg-foreground text-background-editorial border border-foreground shadow-sm"
                  : "bg-transparent text-foreground/60 border border-dashed border-foreground/30 hover:border-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {/* Corner Marks for "Technical" feel */}
              {aspectRatio === ratio.id && (
                <>
                  <span className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-background-editorial/50" />
                  <span className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-background-editorial/50" />
                </>
              )}

              <ratio.icon className="w-4 h-4" />
              <span
                className={cn(
                  "font-mono text-xs font-bold",
                  aspectRatio === ratio.id ? "opacity-100" : "md:hidden"
                )}
              >
                {ratio.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
