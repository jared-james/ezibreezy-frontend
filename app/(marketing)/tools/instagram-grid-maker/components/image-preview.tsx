// app/(marketing)/tools/instagram-grid-maker/components/image-preview.tsx

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Grid3X3 } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  columns: number;
  rows: number;
  gap: number;
  gapColor: string;
}

export function ImagePreview({
  previewUrl,
  columns,
  rows,
  gap,
  gapColor,
}: ImagePreviewProps) {
  const previewStyle = useMemo(() => {
    return {
      aspectRatio: `${columns} / ${rows}`,
      height: "auto",
      maxHeight: "500px",
      width: "100%",
    };
  }, [columns, rows]);

  const gridCells = useMemo(() => columns * rows, [columns, rows]);

  return (
    <div className="flex-1 bg-surface-hover/30 p-8 flex flex-col items-center justify-center overflow-auto min-h-[400px]">
      {/* Technical Header */}
      <div className="w-full max-w-[500px] flex justify-between items-end mb-4 px-1 border-b border-foreground/10 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 flex items-center gap-2">
          <Grid3X3 className="w-3 h-3" />
          Grid Layout
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          {columns}x{rows} • {gap}% Gap
        </span>
      </div>

      <div className="relative max-w-full w-full flex flex-col items-center group animate-in fade-in zoom-in-95 duration-300">
        {/* Main Preview Container */}
        <div
          className="relative overflow-hidden bg-white shadow-sm border border-foreground/10 transition-all duration-300"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          {/* The Wrapper controls aspect ratio */}
          <div style={previewStyle} className="relative w-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Grid Overlay System */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div
                className="w-full h-full grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  // If we have a gap, we use CSS gap to create space between cells.
                  // Since the background of this grid container is transparent, we won't see the color YET.
                  // We need to render borders on the cells instead to visualize the 'color' on top of the image.
                }}
              >
                {Array.from({ length: gridCells }).map((_, i) => {
                  const isRightEdge = (i + 1) % columns === 0;
                  const isBottomEdge = i >= columns * rows - columns;

                  return (
                    <div
                      key={i}
                      className="relative transition-all duration-300"
                      style={{
                        // If gap > 0, we render solid borders to simulate the gap color
                        borderRightWidth:
                          !isRightEdge && gap > 0 ? `${gap}px` : "0px",
                        borderBottomWidth:
                          !isBottomEdge && gap > 0 ? `${gap}px` : "0px",
                        borderColor: gapColor,
                        borderStyle: gap > 0 ? "solid" : "none",
                      }}
                    >
                      {/* 
                           If Gap is 0, we fallback to the "Technical Guide" look 
                           (Red dashed lines) via CSS classes 
                        */}
                      {gap === 0 && !isRightEdge && (
                        <div className="absolute right-0 top-0 bottom-0 w-px border-r border-red-500 border-dashed shadow-[1px_0_0_0_rgba(255,255,255,0.2)]" />
                      )}
                      {gap === 0 && !isBottomEdge && (
                        <div className="absolute left-0 right-0 bottom-0 h-px border-b border-red-500 border-dashed shadow-[0_1px_0_0_rgba(255,255,255,0.2)]" />
                      )}

                      {/* Tile Number Tag - Technical Style */}
                      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white text-foreground font-mono text-[9px] font-bold px-1 py-0.5 border border-foreground/20 shadow-sm flex items-center justify-center min-w-[1.2rem]">
                          {i + 1}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* X/Y Axis Dimensions - Decorative */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 hidden md:flex items-center gap-2">
          <div className="w-8 h-px bg-foreground/20" />
          <span className="font-mono text-[9px] text-foreground/30">
            Y-AXIS
          </span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2">
          <span className="font-mono text-[9px] text-foreground/30">
            X-AXIS
          </span>
          <div className="w-8 h-px bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
