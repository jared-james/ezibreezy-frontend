// app/(marketing)/tools/screenshot-studio/components/editor-controls.tsx

import { cn } from "@/lib/utils";
import {
  Sliders,
  Maximize,
  Circle,
  Box,
  Smartphone,
  Monitor,
  Square,
  Ratio,
  Palette,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Crop,
  LayoutTemplate,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import { BackgroundStyle, AspectRatio } from "../page";

// Curated "Creator Economy" Palette
export const BACKGROUND_OPTIONS: BackgroundStyle[] = [
  // --- ROW 1: Essentials ---
  { id: "solid_white", type: "solid", value: "#ffffff", label: "White" },
  { id: "solid_offwhite", type: "solid", value: "#f3f4f6", label: "Off White" },
  { id: "solid_black", type: "solid", value: "#000000", label: "Black" },
  { id: "solid_dark", type: "solid", value: "#111827", label: "Dark" },
  { id: "brand_blue", type: "solid", value: "#3b82f6", label: "Blue" },
  { id: "brand_indigo", type: "solid", value: "#4f46e5", label: "Indigo" },

  // --- ROW 2: Trending Gradients (Hyper) ---
  {
    id: "hyper_1",
    type: "gradient",
    value: ["#EC4899", "#8B5CF6"],
    label: "Hyper Pink",
  },
  {
    id: "hyper_2",
    type: "gradient",
    value: ["#3B82F6", "#06B6D4"],
    label: "Oceanic",
  },
  {
    id: "hyper_3",
    type: "gradient",
    value: ["#F97316", "#db2777"],
    label: "Sunset",
  },
  {
    id: "hyper_4",
    type: "gradient",
    value: ["#10B981", "#3B82F6"],
    label: "Emerald",
  },
  {
    id: "hyper_5",
    type: "gradient",
    value: ["#8B5CF6", "#F472B6"],
    label: "Unicorn",
  },
  {
    id: "hyper_6",
    type: "gradient",
    value: ["#F43F5E", "#F59E0B"],
    label: "Fire",
  },

  // --- ROW 3: Soft / Pastel ---
  {
    id: "soft_1",
    type: "gradient",
    value: ["#cfd9df", "#e2ebf0"],
    label: "Paper",
  },
  {
    id: "soft_2",
    type: "gradient",
    value: ["#fdfbfb", "#ebedee"],
    label: "Snow",
  },
  {
    id: "soft_3",
    type: "gradient",
    value: ["#a18cd1", "#fbc2eb"],
    label: "Lavender",
  },
  {
    id: "soft_4",
    type: "gradient",
    value: ["#fad0c4", "#ffd1ff"],
    label: "Peach",
  },
  {
    id: "soft_5",
    type: "gradient",
    value: ["#ff9a9e", "#fecfef"],
    label: "Candy",
  },
  {
    id: "soft_6",
    type: "gradient",
    value: ["#e0c3fc", "#8ec5fc"],
    label: "Haze",
  },

  // --- ROW 4: Dark / Deep ---
  {
    id: "dark_1",
    type: "gradient",
    value: ["#0f172a", "#334155"],
    label: "Slate",
  },
  {
    id: "dark_2",
    type: "gradient",
    value: ["#1e1b4b", "#4338ca"],
    label: "Midnight",
  },
  {
    id: "dark_3",
    type: "gradient",
    value: ["#000000", "#434343"],
    label: "Carbon",
  },
  {
    id: "dark_4",
    type: "gradient",
    value: ["#09203f", "#537895"],
    label: "Deep Sea",
  },
  {
    id: "dark_5",
    type: "gradient",
    value: ["#4b6cb7", "#182848"],
    label: "Navy",
  },
  {
    id: "dark_6",
    type: "gradient",
    value: ["#141E30", "#243B55"],
    label: "Royal",
  },
];

const RATIOS: {
  id: AspectRatio;
  icon: any;
  label: string;
  subLabel?: string;
}[] = [
  { id: "auto", icon: Maximize, label: "Auto", subLabel: "Fit" },
  { id: "1:1", icon: Square, label: "Square", subLabel: "Insta" },
  { id: "4:5", icon: Instagram, label: "Portrait", subLabel: "Feed" },
  { id: "16:9", icon: Monitor, label: "Landscape", subLabel: "YT" },
  { id: "1.91:1", icon: Twitter, label: "Link", subLabel: "X/Meta" },
  { id: "3:2", icon: Crop, label: "Photo", subLabel: "Classic" },
  { id: "4:3", icon: LayoutTemplate, label: "Standard", subLabel: "Web" },
  { id: "9:16", icon: Smartphone, label: "Story", subLabel: "Reels" },
];

interface EditorControlsProps {
  padding: number;
  setPadding: (val: number) => void;
  roundness: number;
  setRoundness: (val: number) => void;
  outerRoundness: number;
  setOuterRoundness: (val: number) => void;
  shadow: number;
  setShadow: (val: number) => void;
  windowChrome: boolean;
  setWindowChrome: (val: boolean) => void;
  backgroundId: string;
  setBackgroundId: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  customColors: [string, string];
  setCustomColors: (val: [string, string]) => void;
  useCustomGradient: boolean;
  setUseCustomGradient: (val: boolean) => void;
}

export function EditorControls({
  padding,
  setPadding,
  roundness,
  setRoundness,
  outerRoundness,
  setOuterRoundness,
  shadow,
  setShadow,
  windowChrome,
  setWindowChrome,
  backgroundId,
  setBackgroundId,
  aspectRatio,
  setAspectRatio,
  customColors,
  setCustomColors,
  useCustomGradient,
  setUseCustomGradient,
}: EditorControlsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Background Selector */}
      <div className="space-y-4">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
          <Box className="w-3 h-3" />
          Background
        </label>

        {/* Presets Grid */}
        <div className="grid grid-cols-6 gap-2">
          {BACKGROUND_OPTIONS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackgroundId(bg.id)}
              className={cn(
                "relative aspect-square rounded-md border transition-all hover:scale-110 overflow-hidden shadow-sm",
                backgroundId === bg.id
                  ? "border-foreground ring-1 ring-foreground ring-offset-1 z-10 scale-110"
                  : "border-foreground/10"
              )}
              style={{
                background:
                  bg.type === "gradient"
                    ? `linear-gradient(135deg, ${bg.value[0]}, ${bg.value[1]})`
                    : (bg.value as string),
              }}
              title={bg.label}
            />
          ))}
        </div>

        {/* Custom Background Builder */}
        <div className="pt-2">
          <button
            onClick={() => setBackgroundId("custom")}
            className={cn(
              "w-full flex items-center justify-between p-3 border rounded-lg transition-all group",
              backgroundId === "custom"
                ? "bg-foreground text-background-editorial border-foreground shadow-md"
                : "bg-white border-foreground/20 hover:border-foreground/40 text-foreground/70"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  backgroundId === "custom" ? "bg-white/10" : "bg-foreground/5"
                )}
              >
                <Palette className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs uppercase font-bold tracking-wider">
                Custom Color
              </span>
            </div>

            {/* Mini Preview */}
            <div className="flex items-center gap-2">
              <div
                className="w-12 h-6 rounded border border-white/20 shadow-sm"
                style={{
                  background: useCustomGradient
                    ? `linear-gradient(to right, ${customColors[0]}, ${customColors[1]})`
                    : customColors[0],
                }}
              />
              {backgroundId !== "custom" && (
                <ArrowRight className="w-4 h-4 opacity-50" />
              )}
            </div>
          </button>

          {/* Interactive Color Inputs */}
          {backgroundId === "custom" && (
            <div className="mt-3 space-y-3 animate-in slide-in-from-top-1 duration-200">
              {/* Mode Toggle */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setUseCustomGradient(!useCustomGradient)}
                  className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-foreground/60 hover:text-brand-primary transition-colors"
                >
                  {useCustomGradient ? (
                    <>
                      <span>Gradient On</span>
                      <ToggleRight className="w-5 h-5 text-brand-primary" />
                    </>
                  ) : (
                    <>
                      <span>Gradient Off</span>
                      <ToggleLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "flex flex-col gap-1.5 p-3 bg-white border border-foreground/10 rounded-lg shadow-sm group focus-within:border-brand-primary/50 transition-colors",
                    !useCustomGradient && "col-span-2"
                  )}
                >
                  <label className="text-[9px] uppercase font-bold text-foreground/40">
                    {useCustomGradient ? "Start Color" : "Solid Color"}
                  </label>
                  <div className="h-8 flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded overflow-hidden border border-foreground/10 shrink-0">
                      <input
                        type="color"
                        value={customColors[0]}
                        onChange={(e) =>
                          setCustomColors([e.target.value, customColors[1]])
                        }
                        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 m-0"
                      />
                    </div>
                    <input
                      type="text"
                      value={customColors[0]}
                      onChange={(e) =>
                        setCustomColors([e.target.value, customColors[1]])
                      }
                      className="flex-1 min-w-0 h-full font-mono text-[10px] text-foreground uppercase bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-foreground/30"
                      placeholder="#000000"
                      maxLength={7}
                    />
                  </div>
                </div>

                {useCustomGradient && (
                  <div className="flex flex-col gap-1.5 p-3 bg-white border border-foreground/10 rounded-lg shadow-sm group focus-within:border-brand-primary/50 transition-colors">
                    <label className="text-[9px] uppercase font-bold text-foreground/40">
                      End Color
                    </label>
                    <div className="h-8 flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded overflow-hidden border border-foreground/10 shrink-0">
                        <input
                          type="color"
                          value={customColors[1]}
                          onChange={(e) =>
                            setCustomColors([customColors[0], e.target.value])
                          }
                          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 m-0"
                        />
                      </div>
                      <input
                        type="text"
                        value={customColors[1]}
                        onChange={(e) =>
                          setCustomColors([customColors[0], e.target.value])
                        }
                        className="flex-1 min-w-0 h-full font-mono text-[10px] text-foreground uppercase bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder:text-foreground/30"
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      {/* Aspect Ratio */}
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

      <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

      {/* Frame Options (Window Chrome) */}
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

      {/* Roundness Sliders Group */}
      <div className="space-y-6">
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
