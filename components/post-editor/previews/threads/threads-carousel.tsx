// components/post-editor/previews/threads/threads-carousel.tsx

"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial-store";

interface ThreadsCarouselProps {
  mediaItems: MediaItem[];
}

export function ThreadsCarousel({ mediaItems }: ThreadsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!mediaItems || mediaItems.length === 0) return null;

  const isSingle = mediaItems.length === 1;

  const scrollByAmount = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 280;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollByAmount("left");
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollByAmount("right");
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className={cn(
          "mt-3 flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory",
          "scrollbar-none mask-fade-right"
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {mediaItems.map((item, index) => {
          // Resolve media source
          // For videos from library, use mediaUrl.
          // For images, prioritize cropped preview.
          let src = "";
          if (item.type === "video") {
            src = item.mediaUrl || item.preview;
          } else {
            src = item.croppedPreviews?.threads || item.preview;
          }

          return (
            <div
              key={item.uid}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl border border-border bg-muted snap-center",
                isSingle
                  ? "w-full max-h-[500px]"
                  : "h-[280px] w-auto max-w-[85%]"
              )}
            >
              {item.type === "video" ? (
                <video
                  src={src}
                  className={cn(
                    "h-full object-cover",
                    isSingle ? "w-full" : "w-auto"
                  )}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={src}
                  alt={`Media ${index + 1}`}
                  className={cn(
                    "h-full object-cover",
                    isSingle ? "w-full" : "w-auto"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {!isSingle && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
}
