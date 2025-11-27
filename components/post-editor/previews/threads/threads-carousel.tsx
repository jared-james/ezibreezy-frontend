// components/post-editor/previews/threads/threads-carousel.tsx

"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreadsCarouselProps {
  mediaUrls: string[];
  mediaType?: "text" | "image" | "video";
}

export function ThreadsCarousel({
  mediaUrls,
  mediaType = "image",
}: ThreadsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!mediaUrls.length) return null;

  const isSingle = mediaUrls.length === 1;

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const itemWidth = containerRef.current.scrollWidth / mediaUrls.length;
      const index = Math.round(scrollLeft / itemWidth);
      const clampedIndex = Math.max(0, Math.min(index, mediaUrls.length - 1));
      setCurrentIndex(clampedIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const itemWidth = containerRef.current.scrollWidth / mediaUrls.length;
      containerRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < mediaUrls.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={cn(
          "mt-3 flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory",
          "scrollbar-none mask-fade-right"
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {mediaUrls.map((url, index) => (
          <div
            key={index}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl border border-border bg-muted snap-center",
              isSingle
                ? "w-full max-h-[500px]"
                : "h-[280px] w-auto max-w-[85%] aspect-[3/4]"
            )}
          >
            {mediaType === "video" ? (
              <video
                src={url}
                className="h-full w-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={url}
                alt={`Media ${index + 1}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show for multiple items */}
      {!isSingle && (
        <>
          <button
            onClick={handlePrev}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all",
              currentIndex === 0 && "invisible"
            )}
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all",
              currentIndex === mediaUrls.length - 1 && "invisible"
            )}
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
}
