// components/media-room/media-list-item.tsx

"use client";

import { Play, Check, Film, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { MediaItem } from "@/lib/api/media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";

interface MediaListItemProps {
  item: MediaItem;
  integrationId: string | null;
  onSelect: (id: string, isShiftKey: boolean, isCtrlKey: boolean) => void;
  onOpenDetail: (id: string) => void;
  priority?: boolean;
}

export default function MediaListItem({
  item,
  onSelect,
  onOpenDetail,
  priority = false,
}: MediaListItemProps) {
  // Each list item subscribes only to its own selection state
  const isSelected = useMediaRoomStore((s) => s.selectedIds.has(item.id));
  const isVideo = item.type.startsWith("video/");
  const isGif = item.type === "image/gif";

  const handleClick = () => {
    // Click on list item selects it
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
        "group relative flex items-center gap-4 bg-surface border cursor-pointer transition-all duration-200 overflow-hidden rounded-sm p-3 hover:shadow-sm",
        isSelected
          ? "border-brand-primary ring-2 ring-brand-primary bg-brand-primary/5"
          : "border-border hover:border-brand-primary"
      )}
    >
      {/* Selection checkbox */}
      <button
        onClick={handleCheckboxClick}
        className={cn(
          "shrink-0 w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all",
          isSelected
            ? "bg-brand-primary border-brand-primary"
            : "bg-white border-brand-primary hover:border-brand-primary"
        )}
      >
        {isSelected && (
          <Check className="w-3 h-3 text-brand-primary-foreground" />
        )}
      </button>

      {/* Thumbnail */}
      <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-neutral-100 rounded-sm">
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
                <Film className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-1.5">
                <Play className="w-3 h-3 text-white fill-white" />
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
            <Film className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p
            className="text-foreground text-sm font-medium truncate"
            title={item.filename}
          >
            {item.filename}
          </p>
          {(isVideo || isGif) && (
            <span className="shrink-0 px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[9px] font-bold uppercase tracking-wider rounded">
              {isGif ? "GIF" : "Video"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-serif">
          <span>{formatFileSize(item.fileSize)}</span>
          <span>·</span>
          <span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
          {item.usageCount > 0 && (
            <>
              <span>·</span>
              <span className="text-brand-primary font-medium">
                {item.usageCount} {item.usageCount === 1 ? "post" : "posts"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Dimensions (if available) */}
      {"width" in item && "height" in item && (
        <div className="hidden md:block shrink-0 text-[11px] text-muted-foreground font-serif">
          {item.width} × {item.height}
        </div>
      )}

      {/* View button */}
      <button
        onClick={handleViewClick}
        className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-300 text-neutral-600 hover:border-brand-primary hover:text-brand-primary transition-colors rounded-sm flex items-center gap-1.5"
        title="View details"
      >
        <Pencil className="h-3.5 w-3.5" />
        View
      </button>
    </div>
  );
}
