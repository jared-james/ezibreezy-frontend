// app/(marketing)/tools/screenshot-studio/components/controls/background-selector.tsx

import { cn } from "@/lib/utils";
import {
  Box,
  Palette,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { BACKGROUND_OPTIONS } from "../../constants";

interface BackgroundSelectorProps {
  backgroundId: string;
  setBackgroundId: (id: string) => void;
  customColors: [string, string];
  setCustomColors: (colors: [string, string]) => void;
  useCustomGradient: boolean;
  setUseCustomGradient: (val: boolean) => void;
}

export function BackgroundSelector({
  backgroundId,
  setBackgroundId,
  customColors,
  setCustomColors,
  useCustomGradient,
  setUseCustomGradient,
}: BackgroundSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
        <Box className="w-3 h-3" />
        Background
      </label>

      {/* Presets Grid */}
      <div className="grid grid-cols-12 gap-1.5">
        {BACKGROUND_OPTIONS.map((bg) => (
          <button
            key={bg.id}
            onClick={() => setBackgroundId(bg.id)}
            className={cn(
              "relative aspect-square rounded border transition-all hover:scale-110 overflow-hidden shadow-sm w-8 h-8",
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
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={() => setBackgroundId("custom")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 border rounded transition-all shrink-0",
            backgroundId === "custom"
              ? "bg-foreground text-background-editorial border-foreground"
              : "bg-white border-foreground/20 hover:border-foreground/40 text-foreground/70"
          )}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
            Custom
          </span>
        </button>

        {/* Gradient/Solid Toggle - Show when custom is selected */}
        {backgroundId === "custom" && (
          <>
            <button
              onClick={() => setUseCustomGradient(!useCustomGradient)}
              className="flex items-center gap-2 px-3 py-2 border border-foreground/20 rounded hover:border-foreground/40 transition-colors shrink-0"
            >
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-foreground/70">
                {useCustomGradient ? "Gradient" : "Solid"}
              </span>
              {useCustomGradient ? (
                <ToggleRight className="w-5 h-5 text-brand-primary" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-foreground/40" />
              )}
            </button>

            {/* Color Inputs */}
            <div className="flex items-center gap-2">
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
                className="w-20 h-8 px-2 font-mono text-[10px] text-foreground uppercase bg-white border border-foreground/20 rounded focus:outline-none focus:border-brand-primary"
                placeholder="#000000"
                maxLength={7}
              />
            </div>

            {useCustomGradient && (
              <>
                <ArrowRight className="w-3 h-3 text-foreground/40" />
                <div className="flex items-center gap-2">
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
                    className="w-20 h-8 px-2 font-mono text-[10px] text-foreground uppercase bg-white border border-foreground/20 rounded focus:outline-none focus:border-brand-primary"
                    placeholder="#000000"
                    maxLength={7}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
