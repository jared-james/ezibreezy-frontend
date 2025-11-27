// components/post-editor/previews/instagram/instagram-story-carousel.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial-store";

interface InstagramStoryCarouselProps {
  mediaItems: MediaItem[];
  aspectRatio: number;
  onVideoMetadataLoaded?: (duration: number) => void;
}

export function InstagramStoryCarousel({
  mediaItems,
  aspectRatio,
  onVideoMetadataLoaded,
}: InstagramStoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [storyProgress, setStoryProgress] = useState<number[]>(
    Array(mediaItems.length).fill(0)
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentMedia = mediaItems[currentIndex];

  // UPDATED: Use mediaUrl for video source if available, otherwise fallback to preview
  const displayMediaSrc =
    currentMedia?.croppedPreviews?.instagram ||
    (currentMedia?.type === "video" && currentMedia.mediaUrl
      ? currentMedia.mediaUrl
      : currentMedia?.preview);

  const STORY_DURATION = 5000; // 5 seconds per image

  // Progress bar animation
  useEffect(() => {
    if (isPaused || !currentMedia) return;

    // For videos, we'll track video progress differently
    if (currentMedia.type === "video" && videoRef.current) {
      const video = videoRef.current;

      const updateProgress = () => {
        if (video.duration) {
          setStoryProgress((prev) => {
            const updated = [...prev];
            updated[currentIndex] = (video.currentTime / video.duration) * 100;
            return updated;
          });
        }
      };

      const handleVideoEnd = () => {
        setStoryProgress((prev) => {
          const updated = [...prev];
          updated[currentIndex] = 100;
          return updated;
        });

        if (currentIndex < mediaItems.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("ended", handleVideoEnd);

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("ended", handleVideoEnd);
      };
    }

    // For images, use a timer
    if (currentMedia.type === "image") {
      const startTime = Date.now();

      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgressValue = (elapsed / STORY_DURATION) * 100;

        if (newProgressValue >= 100) {
          clearInterval(progressIntervalRef.current!);

          setStoryProgress((prev) => {
            const updated = [...prev];
            updated[currentIndex] = 100;
            return updated;
          });

          if (currentIndex < mediaItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
          }
        } else {
          setStoryProgress((prev) => {
            const updated = [...prev];
            updated[currentIndex] = newProgressValue;
            return updated;
          });
        }
      }, 16); // ~60fps

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [currentIndex, isPaused, currentMedia, mediaItems.length, STORY_DURATION]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToStory = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative bg-black" style={{ aspectRatio }}>
      {/* Progress Bars */}
      <div className="absolute top-2 left-0 right-0 z-20 flex gap-1 px-2">
        {mediaItems.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{
                width: `${
                  index < currentIndex
                    ? 100
                    : index === currentIndex
                    ? storyProgress[index] || 0
                    : 0
                }%`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Media Display */}
      <div className="relative w-full h-full">
        {displayMediaSrc &&
          (currentMedia.type === "video" ? (
            <video
              ref={videoRef}
              src={displayMediaSrc}
              className="w-full h-full object-cover"
              muted
              controls={false}
              autoPlay
              playsInline
              onLoadedMetadata={(e) =>
                onVideoMetadataLoaded?.(e.currentTarget.duration)
              }
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayMediaSrc}
              alt={`Story ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
      </div>

      {/* Touch areas for navigation */}
      <div className="absolute inset-0 z-10 flex">
        <button
          onClick={handlePrevious}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex-1 cursor-pointer"
          aria-label="Previous story"
          disabled={currentIndex === 0}
        />
        <button
          onClick={handleNext}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex-1 cursor-pointer"
          aria-label="Next story"
          disabled={currentIndex === mediaItems.length - 1}
        />
      </div>

      {/* Story indicator dots (optional) */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {mediaItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStory(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
