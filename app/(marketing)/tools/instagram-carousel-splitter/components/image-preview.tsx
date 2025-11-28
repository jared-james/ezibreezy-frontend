// app/(marketing)/tools/instagram-carousel-splitter/components/image-preview.tsx

import { useMemo } from "react";
import { AspectRatio } from "@/lib/tools/image-processing";
import { cn } from "@/lib/utils";
import { Scissors } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  columns: number;
  aspectRatio: AspectRatio;
}

export function ImagePreview({
  previewUrl,
  columns,
  aspectRatio,
}: ImagePreviewProps) {
  const previewStyle = useMemo(() => {
    let ratioMultiplier = 1;
    if (aspectRatio === "portrait") ratioMultiplier = 0.8; // 4:5
    if (aspectRatio === "landscape") ratioMultiplier = 1.91;

    if (aspectRatio === "original") {
      return { height: "400px", width: "auto", aspectRatio: "auto" };
    }

    return {
      aspectRatio: `${columns * ratioMultiplier} / 1`,
      height: "auto",
      maxHeight: "500px",
      width: "100%",
    };
  }, [columns, aspectRatio]);

  return (
    <div className="flex-1 bg-surface-hover/30 p-8 flex flex-col items-center justify-center overflow-auto min-h-[400px]">
      {/* Label above preview */}
      <div className="w-full max-w-4xl flex justify-between items-end mb-2 px-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          Render Preview
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          {columns} Slides Generated
        </span>
      </div>

      <div className="relative max-w-full group">
        {/* Frame / Cut Guide */}
        <div
          className="relative overflow-hidden bg-white shadow-sm border border-foreground/10"
          style={previewStyle}
        >
          <img
            src={previewUrl}
            alt="Preview"
            className={cn(
              "w-full h-full transition-all duration-300",
              aspectRatio !== "original" ? "object-cover" : "object-contain"
            )}
          />

          {/* Overlay Grid (The Cutting Guides) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: "1fr",
              }}
            >
              {Array.from({ length: columns }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative h-full",
                    // Only add border to the right of elements, except the last one
                    i < columns - 1 && "border-r border-white/50 border-dashed"
                  )}
                >
                  {/* Cut Icon on hover (decoration) */}
                  {i < columns - 1 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity z-30 drop-shadow-md">
                      <Scissors className="w-4 h-4" />
                    </div>
                  )}

                  {/* Slide Number Tag */}
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-black/80 text-white font-mono text-[10px] font-bold px-1.5 py-1 backdrop-blur-sm border border-white/20 shadow-sm flex items-center gap-1.5">
                      <span className="opacity-50">#</span>
                      {i + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Ruler Bar */}
        <div className="mt-2 w-full h-2 flex justify-between opacity-30">
          {Array.from({ length: columns * 4 + 1 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-px bg-foreground",
                i % 4 === 0 ? "h-full" : "h-1/2 self-start"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
