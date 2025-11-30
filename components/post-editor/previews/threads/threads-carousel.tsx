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
    // Note: Scroll index calculation is approximate with variable widths
    // We stick to simple scroll functionality here
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      // We can't easily calculate exact index with variable widths without measuring children
      // For the preview UI, simpler index tracking or just relying on scroll is often enough
      // But let's try to estimate for the arrows
    }
  };

  const scrollByAmount = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 280; // approximate slide width
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
        {mediaUrls.map((url, index) => (
          <div
            key={index}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl border border-border bg-muted snap-center",
              isSingle ? "w-full max-h-[500px]" : "h-[280px] w-auto max-w-[85%]" // Removed fixed aspect ratio
            )}
          >
            {mediaType === "video" ? (
              <video
                src={url}
                className={cn(
                  "h-full object-cover",
                  isSingle ? "w-full" : "w-auto" // Let video define width in carousel
                )}
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={url}
                alt={`Media ${index + 1}`}
                className={cn(
                  "h-full object-cover",
                  isSingle ? "w-full" : "w-auto" // Let image define width in carousel
                )}
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
