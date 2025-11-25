// components/media-room/media-card.tsx

"use client";

import { Play, Check, Film, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { MediaItem } from "@/lib/api/media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";

interface MediaCardProps {
  item: MediaItem;
  integrationId: string | null;
  onSelect: (id: string, isShiftKey: boolean, isCtrlKey: boolean) => void;
  onOpenDetail: (id: string) => void;
  priority?: boolean;
}

export default function MediaCard({
  item,
  onSelect,
  onOpenDetail,
  priority = false,
}: MediaCardProps) {
  // Each card subscribes only to its own selection state
  // This prevents re-renders when other items are selected/deselected
  const isSelected = useMediaRoomStore((s) => s.selectedIds.has(item.id));

  const isVideo = item.type.startsWith("video/");
  const isGif = item.type === "image/gif";

  const handleClick = () => {
    // Click on card selects it
    onSelect(item.id, false, false);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.id, false, true);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail(item.id);
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
            {item.thumbnailUrl && item.thumbnailUrl.trim() !== "" ? (
              <img
                src={item.thumbnailUrl}
                alt={item.altText || item.filename}
                className="w-full h-full object-cover"
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
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
        ) : item.thumbnailUrl || item.url ? (
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.altText || item.filename}
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100">
            <Film className="w-8 h-8 text-muted-foreground" />
          </div>
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
          <div className="flex items-center gap-1.5">
            {item.usageCount > 0 && (
              <span className="text-[10px] text-brand-primary font-medium">
                {item.usageCount} {item.usageCount === 1 ? "post" : "posts"}
              </span>
            )}
            <button
              onClick={handleViewClick}
              className="p-1 hover:bg-neutral-100 rounded-sm transition-colors group/view"
              title="View details"
            >
              <Pencil className="h-3.5 w-3.5 text-neutral-500 group-hover/view:text-brand-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
