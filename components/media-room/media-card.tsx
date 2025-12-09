// components/media-room/media-card.tsx

"use client";

import { Play, Check, Film, Pencil, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/lib/types/media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";

interface MediaCardProps {
  item: MediaItem;
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
  const isSelected = useMediaRoomStore((s) => s.selectedIds.has(item.id));

  const isVideo = item.type.startsWith("video/");
  const isGif = item.type === "image/gif";
  const isArchived = item.isArchived;

  const handleClick = (e: React.MouseEvent) => {
    onSelect(item.id, e.shiftKey, e.metaKey || e.ctrlKey);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.id, false, true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetail(item.id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0 && isArchived) return "Archived";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col bg-surface border cursor-pointer transition-all duration-200 overflow-hidden rounded-sm select-none",
        isSelected
          ? "border-brand-primary ring-2 ring-brand-primary z-10"
          : "border-border hover:border-foreground/30",
        isArchived && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {/* Archived Overlay */}
        {isArchived && (
          <div className="absolute inset-0 z-20 bg-neutral-900/10 flex items-center justify-center pointer-events-none">
            <div className="bg-neutral-900/80 p-1.5 rounded-full backdrop-blur-sm">
              <Archive className="w-3 h-3 text-white" />
            </div>
          </div>
        )}

        {/* Media Preview */}
        {isVideo ? (
          <div className="relative w-full h-full bg-black/5">
            {item.thumbnailUrl && item.thumbnailUrl.trim() !== "" ? (
              <img
                src={item.thumbnailUrl}
                alt={item.altText || item.filename}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
              />
            ) : (
              <video
                src={`${item.url}#t=0.001`}
                className="w-full h-full object-cover"
                preload="metadata"
                muted
                playsInline
                loop
                onMouseEnter={(e) => {
                  if (!isArchived) e.currentTarget.play();
                }}
                onMouseLeave={(e) => {
                  if (!isArchived) e.currentTarget.pause();
                }}
              />
            )}
            {!isArchived && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/40 rounded-full p-2 backdrop-blur-sm">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            )}
          </div>
        ) : item.thumbnailUrl || item.url ? (
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.altText || item.filename}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-muted-foreground">
            <Film className="w-6 h-6" />
          </div>
        )}

        {/* Always Visible Selection Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className="absolute top-1.5 right-1.5 z-30 opacity-100 transition-transform active:scale-95"
        >
          <div
            className={cn(
              "w-5 h-5 border rounded-sm flex items-center justify-center transition-all shadow-sm",
              isSelected
                ? "bg-brand-primary border-brand-primary"
                : "bg-white/90 border-neutral-300 hover:border-brand-primary"
            )}
          >
            {isSelected && (
              <Check className="w-3 h-3 text-brand-primary-foreground" />
            )}
          </div>
        </button>

        {/* Type Badge */}
        {(isVideo || isGif) && (
          <div className="absolute bottom-1.5 left-1.5 px-1 py-0.5 bg-black/60 text-white text-[8px] font-bold uppercase tracking-wider rounded-sm pointer-events-none z-20 backdrop-blur-sm">
            {isGif ? "GIF" : "Video"}
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="px-2 py-2 bg-surface border-t border-border flex flex-col gap-1.5">
        <p
          className={cn(
            "text-foreground text-[10px] font-medium truncate leading-tight",
            isArchived && "text-muted-foreground italic"
          )}
          title={item.filename}
        >
          {item.filename}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className="text-muted-foreground text-[9px] font-sans tabular-nums leading-none">
              {formatFileSize(item.fileSize)}
            </p>
            {item.usageCount > 0 && (
              <span className="text-[8px] font-bold text-brand-primary bg-brand-primary/10 px-1 py-px rounded-sm leading-none">
                {item.usageCount} Used
              </span>
            )}
          </div>

          <button
            onClick={handleEditClick}
            className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-transparent hover:border-border rounded-sm transition-all"
          >
            <Pencil className="h-2.5 w-2.5" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
