// components/post-editor/previews/facebook/facebook-carousel.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial-store";

interface FacebookCarouselProps {
  mediaItems: MediaItem[];
  aspectRatio?: number;
  onCurrentIndexChange?: (index: number) => void;
}

export function FacebookCarousel({
  mediaItems,
  aspectRatio = 1,
  onCurrentIndexChange,
}: FacebookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMedia = mediaItems[currentIndex];

  // Use cropped preview for Facebook if available, otherwise use mediaUrl for video or preview
  const displayMediaSrc =
    currentMedia?.croppedPreviews?.facebook ||
    (currentMedia?.type === "video" && currentMedia.mediaUrl
      ? currentMedia.mediaUrl
      : currentMedia?.preview);

  // Notify parent of index changes
  useEffect(() => {
    onCurrentIndexChange?.(currentIndex);
  }, [currentIndex, onCurrentIndexChange]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-100"
      style={{ aspectRatio }}
    >
      {/* Media Display */}
      {displayMediaSrc &&
        (currentMedia.type === "video" ? (
          <video
            src={displayMediaSrc}
            className="w-full h-full object-contain"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayMediaSrc}
            alt={`Media ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        ))}

      {/* Navigation Arrows - Only show if more than 1 item */}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10",
              currentIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Previous"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10",
              currentIndex === mediaItems.length - 1 &&
                "opacity-50 cursor-not-allowed"
            )}
            aria-label="Next"
            disabled={currentIndex === mediaItems.length - 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Carousel Counter Badge */}
      {mediaItems.length > 1 && (
        <div className="absolute top-3 right-3 bg-gray-800/80 text-white text-xs font-medium px-2 py-1 rounded-md z-10">
          {currentIndex + 1}/{mediaItems.length}
        </div>
      )}
    </div>
  );
}
