// app/(marketing)/tools/screenshot-studio/components/controls/style-sliders.tsx

import { Maximize, Circle, Crop, Sliders } from "lucide-react";

interface StyleSlidersProps {
  padding: number;
  setPadding: (val: number) => void;
  roundness: number;
  setRoundness: (val: number) => void;
  outerRoundness: number;
  setOuterRoundness: (val: number) => void;
  shadow: number;
  setShadow: (val: number) => void;
}

export function StyleSliders({
  padding,
  setPadding,
  roundness,
  setRoundness,
  outerRoundness,
  setOuterRoundness,
  shadow,
  setShadow,
}: StyleSlidersProps) {
  return (
    <div className="space-y-6">
      {/* Padding Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Maximize className="w-3 h-3" />
            Padding
          </label>
          <span className="font-mono text-[10px] font-bold">{padding}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="120"
          value={padding}
          onChange={(e) => setPadding(parseInt(e.target.value))}
          className="w-full h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
        />
      </div>

      {/* Inner Roundness */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Circle className="w-3 h-3" />
            Image Radius
          </label>
          <span className="font-mono text-[10px] font-bold">
            {roundness}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          value={roundness}
          onChange={(e) => setRoundness(parseInt(e.target.value))}
          className="w-full h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
        />
      </div>

      {/* Outer Roundness */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Crop className="w-3 h-3" />
            Background Radius
          </label>
          <span className="font-mono text-[10px] font-bold">
            {outerRoundness}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          value={outerRoundness}
          onChange={(e) => setOuterRoundness(parseInt(e.target.value))}
          className="w-full h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
        />
      </div>

      {/* Shadow Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Sliders className="w-3 h-3" />
            Shadow Intensity
          </label>
          <span className="font-mono text-[10px] font-bold">{shadow}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={shadow}
          onChange={(e) => setShadow(parseInt(e.target.value))}
          className="w-full h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
        />
      </div>
    </div>
  );
}
