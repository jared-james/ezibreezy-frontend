// app/(marketing)/tools/instagram-grid-maker/components/image-preview.tsx

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  previewUrl: string;
  columns: number;
  rows: number;
  gap: number;
}

export function ImagePreview({
  previewUrl,
  columns,
  rows,
  gap,
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
    <div className="flex-1 bg-gray-50/50 p-8 flex items-center justify-center overflow-auto">
      <div className="relative bg-white max-w-full">
        <div className="relative overflow-hidden bg-white" style={previewStyle}>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 z-20 pointer-events-none">
            <div
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: `${gap * 0.5}%`,
              }}
            >
              {Array.from({ length: gridCells }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative transition-all duration-300",
                    gap > 0
                      ? "box-shadow-[0_0_0_100vmax_white]"
                      : "border border-white/50 border-dashed"
                  )}
                >
                  {gap > 0 && (
                    <div
                      className="absolute inset-0 ring-4 ring-white"
                      style={{ opacity: gap / 10 }}
                    />
                  )}

                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
