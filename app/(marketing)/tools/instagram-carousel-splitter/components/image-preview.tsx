// app/(marketing)/tools/instagram-carousel-splitter/components/image-preview.tsx

"use client";

import { useState, useMemo, useRef } from "react";
import { AspectRatio } from "@/lib/tools/image-processing";
import { cn } from "@/lib/utils";
import {
  Eye,
  Grid2X2,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  columns: number;
  aspectRatio: AspectRatio;
  dividerColor: string;
}

export function ImagePreview({
  previewUrl,
  columns,
  aspectRatio,
  dividerColor,
}: ImagePreviewProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  // --- Logic for the "Edit" View (Grid Lines) ---
  const editPreviewStyle = useMemo(() => {
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
    <div className="flex-1 bg-surface-hover/30 p-4 md:p-8 flex flex-col items-center justify-start overflow-hidden min-h-[500px]">
      {/* --- Toolbar / Header --- */}
      <div className="w-full max-w-4xl flex items-end justify-between mb-6 border-b border-foreground/10 pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold">
            {mode === "edit" ? "Cut Guide" : "Swipe Simulation"}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            {mode === "edit"
              ? "Visualize where the cuts will occur"
              : "Preview the user experience"}
          </p>
        </div>

        {/* View Toggle Switch */}
        <div className="flex items-center bg-white border border-foreground/20 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setMode("edit")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold font-mono uppercase tracking-wider",
              mode === "edit"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-foreground/50 hover:bg-foreground/5"
            )}
          >
            <Grid2X2 className="w-3 h-3" />
            <span className="hidden md:inline">Grid</span>
          </button>
          <button
            onClick={() => setMode("preview")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold font-mono uppercase tracking-wider",
              mode === "preview"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-foreground/50 hover:bg-foreground/5"
            )}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden md:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* --- Main Display Area --- */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        {mode === "edit" ? (
          // === EDIT MODE (Existing Grid View) ===
          <div className="relative max-w-full group animate-in fade-in zoom-in-95 duration-300">
            <div
              className="relative overflow-hidden bg-white shadow-2xl border border-foreground/10"
              style={editPreviewStyle}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className={cn(
                  "w-full h-full transition-all duration-300",
                  aspectRatio !== "original" ? "object-cover" : "object-contain"
                )}
              />

              {/* Overlay Grid */}
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
                        i < columns - 1 &&
                          "border-r border-dashed shadow-[1px_0_0_0_rgba(255,255,255,0.25)]"
                      )}
                      style={
                        i < columns - 1
                          ? { borderRightColor: dividerColor }
                          : undefined
                      }
                    >
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

            {/* Dimensions Label */}
            <div className="mt-4 text-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/40 bg-white/50 px-2 py-1 rounded border border-foreground/10">
                Aspect Ratio:{" "}
                {aspectRatio === "original" ? "Auto" : aspectRatio}
              </span>
            </div>
          </div>
        ) : (
          // === PREVIEW MODE (Phone Simulator) ===
          <CarouselSimulator
            previewUrl={previewUrl}
            columns={columns}
            aspectRatio={aspectRatio}
          />
        )}
      </div>
    </div>
  );
}

// --- Sub-Component: The Phone Simulator ---
function CarouselSimulator({
  previewUrl,
  columns,
  aspectRatio,
}: {
  previewUrl: string;
  columns: number;
  aspectRatio: AspectRatio;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate the aspect ratio class for a SINGLE slide
  const slideAspectRatioClass = useMemo(() => {
    switch (aspectRatio) {
      case "portrait":
        return "aspect-[4/5]";
      case "square":
        return "aspect-square";
      case "landscape":
        return "aspect-[1.91/1]";
      default:
        return "aspect-[4/5]";
    }
  }, [aspectRatio]);

  // Handle Scroll to update index
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setCurrentIndex(index);
  };

  // Scroll buttons
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      {/* Phone Frame */}
      <div className="w-[320px] bg-white border border-gray-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative border-[8px] border-zinc-900">
        {/* Notch / Status Bar Area */}
        <div className="bg-white h-8 w-full flex justify-between items-center px-6 pt-2">
          <div className="text-[10px] font-bold text-black">9:41</div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-black rounded-full opacity-20" />
            <div className="w-3 h-3 bg-black rounded-full opacity-20" />
          </div>
        </div>

        {/* Instagram Header Mock */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
              <div className="w-full h-full bg-white rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none">
                your_awesome :)
              </span>
            </div>
          </div>
          <div className="text-black font-bold text-lg leading-none pb-2">
            ...
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="relative group">
          {/* Navigation Arrows (Hover only) */}
          <button
            onClick={() => scroll("left")}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full p-1 transition-opacity",
              currentIndex === 0
                ? "opacity-0 pointer-events-none"
                : "opacity-0 group-hover:opacity-100"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scroll("right")}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full p-1 transition-opacity",
              currentIndex === columns - 1
                ? "opacity-0 pointer-events-none"
                : "opacity-0 group-hover:opacity-100"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Slide Counter Pill */}
          <div className="absolute top-3 right-3 z-20 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">
            {currentIndex + 1}/{columns}
          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none" }} // Firefox hide scrollbar
          >
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-full flex-shrink-0 snap-center relative overflow-hidden bg-gray-100",
                  slideAspectRatioClass
                )}
              >
                {/* 
                  The Image Logic:
                  We render the FULL image in every slide, but positioned differently.
                  Width = 100% * columns.
                  Left = -100% * index.
                */}
                <img
                  src={previewUrl}
                  alt={`Slide ${index + 1}`}
                  className="absolute max-w-none h-full object-cover"
                  style={{
                    width: `${columns * 100}%`,
                    left: `-${index * 100}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Actions Footer Mock */}
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-4">
              <Heart className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
              <MessageCircle className="w-6 h-6 -rotate-90" />
              <Send className="w-6 h-6" />
            </div>
            <Bookmark className="w-6 h-6" />
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  i === currentIndex ? "bg-blue-500" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Home Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" />
      </div>

      {/* Helper text outside phone */}
      <div className="text-center mt-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 animate-pulse">
          {currentIndex < columns - 1 ? "Swipe Right →" : "End of Carousel"}
        </p>
      </div>
    </div>
  );
}
