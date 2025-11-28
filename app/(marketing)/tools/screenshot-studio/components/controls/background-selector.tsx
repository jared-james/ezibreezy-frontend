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
  );
}
