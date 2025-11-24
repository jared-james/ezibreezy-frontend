// components/media-room/media-card.tsx

"use client";

import { Play, Check, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { MediaItem } from "@/lib/api/media";

interface MediaCardProps {
  item: MediaItem;
  integrationId: string | null;
  isSelected: boolean;
  onSelect: (id: string, isShiftKey: boolean, isCtrlKey: boolean) => void;
  onOpenDetail: (id: string) => void;
}

export default function MediaCard({
  item,
  isSelected,
  onSelect,
  onOpenDetail,
}: MediaCardProps) {

  const isVideo = item.type.startsWith("video/");
  const isGif = item.type === "image/gif";

  const handleClick = () => {
    // Single click opens detail modal
    onOpenDetail(item.id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.id, false, true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col bg-surface border cursor-pointer transition-all duration-200 overflow-hidden rounded-sm",
        isSelected
          ? "border-brand-primary ring-2 ring-brand-primary"
          : "border-border hover:border-brand-primary"
      )}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {isVideo ? (
          <div className="relative w-full h-full bg-black/5">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.altText || item.filename}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-2">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.altText || item.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Selection checkbox - always visible */}
        <button
          onClick={handleCheckboxClick}
          className={cn(
            "absolute top-2 left-2 w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all",
            isSelected
              ? "bg-brand-primary border-brand-primary"
              : "bg-white/90 border-brand-primary hover:border-brand-primary"
          )}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-brand-primary-foreground" />
          )}
        </button>

        {/* Type badge */}
        {(isVideo || isGif) && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold uppercase tracking-wider rounded">
            {isGif ? "GIF" : "Video"}
          </div>
        )}
      </div>

      {/* Always visible info bar */}
      <div className="px-2 py-2 bg-surface border-t border-border">
        <p
          className="text-foreground text-[11px] font-medium truncate"
          title={item.filename}
        >
          {item.filename}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-muted-foreground text-[10px] font-serif">
            {formatFileSize(item.fileSize)} ·{" "}
            {format(new Date(item.createdAt), "MMM d")}
          </p>
          {item.usageCount > 0 && (
            <span className="text-[10px] text-brand-primary font-medium">
              {item.usageCount} {item.usageCount === 1 ? "post" : "posts"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
