// components/post-editor/previews/facebook/facebook-story-view.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Volume2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial/draft-store";

interface FacebookStoryViewProps {
  mediaItems: MediaItem[];
  avatarUrl: string | null;
  primaryName: string;
  onIndexChange?: (index: number) => void;
}

export function FacebookStoryView({
  mediaItems,
  avatarUrl,
  primaryName,
  onIndexChange,
}: FacebookStoryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Notify parent of index change for Crop button context
  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const hasMultiple = mediaItems.length > 1;
  const currentMedia = mediaItems[currentIndex];

  // Determine source: Cropped -> Video URL -> Preview (blob)
  const displayMediaSrc =
    currentMedia?.croppedPreviews?.facebook ||
    (currentMedia?.type === "video" && currentMedia.mediaUrl
      ? currentMedia.mediaUrl
      : currentMedia?.preview);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Mock reactions
  const reactions = [
    { emoji: "👍", color: "bg-blue-100 border-blue-200" },
    { emoji: "❤️", color: "bg-red-100 border-red-200" },
    { emoji: "😂", color: "bg-yellow-100 border-yellow-200" },
    { emoji: "😮", color: "bg-yellow-100 border-yellow-200" },
    { emoji: "😡", color: "bg-orange-100 border-orange-200" },
  ];

  return (
    <div className="relative w-full h-full bg-white text-gray-900 overflow-hidden flex flex-col font-sans">
      {/* 1. Progress Bar Row */}
      <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
        {mediaItems.length > 0 ? (
          mediaItems.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden"
            >
              <div
                className={cn(
                  "h-full w-full transition-all duration-300",
                  index <= currentIndex ? "bg-blue-500" : "bg-transparent"
                )}
              />
            </div>
          ))
        ) : (
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        )}
      </div>

      {/* 2. Header Row */}
      <div className="absolute top-5 left-3 right-3 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-gray-100 shadow-sm">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={primaryName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {primaryName.charAt(0)}
              </div>
            )}
            {/* Blue story ring simulation */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-20"></div>
          </div>

          {/* Text Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {primaryName}
              </span>
              <span className="text-xs text-gray-500">30m</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 text-gray-900">
          <MoreHorizontal className="w-5 h-5" />
          <X className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Main Media Content (Centered) */}
      <div className="flex-1 flex items-center justify-center relative bg-gray-50">
        {displayMediaSrc ? (
          currentMedia?.type === "video" ? (
            <video
              src={displayMediaSrc}
              className="w-full h-full object-contain"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={displayMediaSrc}
              alt={`Story ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
          )
        ) : (
          <div className="text-gray-400 text-sm font-medium flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl">📷</span>
            </div>
            No media attached
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white shadow-sm rounded-full transition-colors z-10",
                currentIndex === 0 && "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === mediaItems.length - 1}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white shadow-sm rounded-full transition-colors z-10",
                currentIndex === mediaItems.length - 1 &&
                  "opacity-0 pointer-events-none"
              )}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* 4. Footer Row */}
      <div className="absolute bottom-4 left-3 right-3 z-20 flex items-center gap-3">
        {/* Message Input */}
        <div className="flex-1 h-10 rounded-full bg-gray-100 border border-transparent hover:bg-gray-200 transition-colors flex items-center px-4 cursor-text">
          <span className="text-sm text-gray-500">Send message...</span>
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-2">
          {reactions.slice(0, 3).map((reaction, i) => (
            <button
              key={i}
              className="group relative w-9 h-9 transition-transform hover:scale-110 active:scale-95"
            >
              <div
                className={cn(
                  "w-full h-full rounded-full flex items-center justify-center text-lg border",
                  reaction.color
                )}
              >
                {reaction.emoji}
              </div>
            </button>
          ))}
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-blue-500 hover:bg-gray-200 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
