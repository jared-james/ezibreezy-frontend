// components/post-editor/previews/facebook/facebook-media-grid.tsx

"use client";

import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial/draft-store";
import { Play } from "lucide-react";

interface FacebookMediaGridProps {
  mediaItems: MediaItem[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

export function FacebookMediaGrid({
  mediaItems,
  selectedIndex,
  onSelect,
}: FacebookMediaGridProps) {
  const count = mediaItems.length;

  if (count === 0) return null;

  const handleSelect = (index: number) => {
    onSelect?.(index);
  };

  // Helper to render a single item in the grid
  const renderItem = (item: MediaItem, index: number, className?: string) => {
    const isSelected = selectedIndex === index;
    // Determine the source to display (cropped preview > media URL > blob preview)
    const src =
      item.croppedPreviews?.facebook ||
      (item.type === "video" && item.mediaUrl ? item.mediaUrl : item.preview);
    const isVideo = item.type === "video";

    return (
      <div
        key={item.uid}
        className={cn(
          "relative overflow-hidden bg-gray-100 cursor-pointer group border border-white/10",
          isSelected ? "ring-4 ring-inset ring-blue-500 z-10" : "",
          className
        )}
        onClick={() => handleSelect(index)}
      >
        {isVideo ? (
          <>
            <video
              src={src}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <Play
                className="w-10 h-10 text-white drop-shadow-md opacity-90"
                fill="currentColor"
              />
            </div>
          </>
        ) : (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
    );
  };

  // Layout for 2 Items: Side by Side
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 h-[300px] w-full">
        {mediaItems.map((item, i) => renderItem(item, i, "h-full"))}
      </div>
    );
  }

  // Layout for 3 Items: 1 Top (Big), 2 Bottom
  if (count === 3) {
    return (
      <div className="flex flex-col gap-1 h-[400px] w-full">
        <div className="h-2/3 w-full">
          {renderItem(mediaItems[0], 0, "h-full")}
        </div>
        <div className="h-1/3 grid grid-cols-2 gap-1">
          {renderItem(mediaItems[1], 1, "h-full")}
          {renderItem(mediaItems[2], 2, "h-full")}
        </div>
      </div>
    );
  }

  // Layout for 4 Items: 1 Top (Big), 3 Bottom
  if (count === 4) {
    return (
      <div className="flex flex-col gap-1 h-[400px] w-full">
        <div className="h-3/5 w-full">
          {renderItem(mediaItems[0], 0, "h-full")}
        </div>
        <div className="h-2/5 grid grid-cols-3 gap-1">
          {mediaItems
            .slice(1)
            .map((item, i) => renderItem(item, i + 1, "h-full"))}
        </div>
      </div>
    );
  }

  // Layout for 5+ Items: 2 Top, 3 Bottom
  if (count >= 5) {
    const displayItems = mediaItems.slice(0, 5);
    const remaining = count - 5;

    return (
      <div className="flex flex-col gap-1 h-[400px] w-full">
        <div className="h-1/2 grid grid-cols-2 gap-1">
          {renderItem(displayItems[0], 0, "h-full")}
          {renderItem(displayItems[1], 1, "h-full")}
        </div>
        <div className="h-1/2 grid grid-cols-3 gap-1">
          {renderItem(displayItems[2], 2, "h-full")}
          {renderItem(displayItems[3], 3, "h-full")}
          <div className="relative h-full">
            {renderItem(displayItems[4], 4, "h-full")}
            {remaining > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                <span className="text-white text-3xl font-bold">
                  +{remaining}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for 1 item (though normally handled by parent)
  return renderItem(mediaItems[0], 0, "h-[300px]");
}
