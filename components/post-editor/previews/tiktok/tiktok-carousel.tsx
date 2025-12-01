// components/post-editor/previews/tiktok/tiktok-carousel.tsx

"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "@/lib/store/editorial/draft-store";
import { cn } from "@/lib/utils";

interface TikTokCarouselProps {
  mediaItems: MediaItem[];
  onIndexChange?: (index: number) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function TikTokCarousel({ mediaItems, onIndexChange, containerRef: externalRef }: TikTokCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef || internalRef;

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const width = containerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      const clampedIndex = Math.max(0, Math.min(index, mediaItems.length - 1));
      setCurrentIndex(clampedIndex);
      onIndexChange?.(clampedIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: width * index,
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
    if (currentIndex < mediaItems.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  if (!mediaItems.length) return null;

  return (
    <div className="relative w-full h-full bg-black group">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {mediaItems.map((item, index) => {
          const displaySrc = item.croppedPreviews?.tiktok || item.preview;

          return (
            <div
              key={item.uid}
              className="relative min-w-full h-full snap-center flex items-center justify-center overflow-hidden bg-black"
            >
              <img
                src={displaySrc}
                alt={`Slide ${index + 1}`}
                className="relative w-full h-full object-contain z-10"
              />
            </div>
          );
        })}
      </div>

      {/* Top Right Counter */}
      <div className="absolute top-6 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold z-20 pointer-events-none">
        {currentIndex + 1} / {mediaItems.length}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all",
          currentIndex === 0 && "invisible"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all",
          currentIndex === mediaItems.length - 1 && "invisible"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
