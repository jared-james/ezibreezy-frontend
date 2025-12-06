// components/media-room/media-list-item.tsx

"use client";

import { Play, Check, Film, Pencil, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { MediaItem } from "@/lib/types/media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";

interface MediaListItemProps {
  item: MediaItem;
  organizationId: string | null;
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
        "group relative flex items-center gap-3 bg-surface border-b border-border px-3 py-2 cursor-pointer transition-colors hover:bg-surface-hover select-none",
        isSelected && "bg-brand-primary/5",
        isArchived && "opacity-75 grayscale-[0.5]"
      )}
    >
      <button
        onClick={handleCheckboxClick}
        className="shrink-0 flex items-center justify-center"
      >
        <div
          className={cn(
            "w-4 h-4 border rounded-sm flex items-center justify-center transition-all shadow-sm",
            isSelected
              ? "bg-brand-primary border-brand-primary"
              : "bg-white border-neutral-300 hover:border-brand-primary"
          )}
        >
          {isSelected && (
            <Check className="w-2.5 h-2.5 text-brand-primary-foreground" />
          )}
        </div>
      </button>

      <div className="relative w-10 h-10 shrink-0 overflow-hidden bg-neutral-100 rounded-sm border border-border">
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
                <Film className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/40 rounded-full p-1">
                <Play className="w-2 h-2 text-white fill-white" />
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
            <Film className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <div className="flex items-center gap-2">
          <p
            className="text-foreground text-xs font-medium truncate"
            title={item.filename}
          >
            {item.filename}
          </p>
          {(isVideo || isGif) && (
            <span className="shrink-0 px-1 py-0.5 bg-neutral-100 text-neutral-600 text-[8px] font-bold uppercase tracking-wider rounded border border-border">
              {isGif ? "GIF" : "Video"}
            </span>
          )}
          {isArchived && (
            <span className="shrink-0 flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider">
              <Archive className="w-3 h-3" />
              Archived
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans tabular-nums">
          <span>{formatFileSize(item.fileSize)}</span>
          <span>·</span>
          <span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
          {"width" in item && "height" in item && (
            <>
              <span>·</span>
              <span>
                {item.width} × {item.height}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {item.usageCount > 0 && (
          <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-sm">
            {item.usageCount} Used
          </span>
        )}

        <button
          onClick={handleEditClick}
          className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-transparent hover:border-border rounded-sm transition-all"
        >
          <Pencil className="h-2.5 w-2.5" />
          Edit
        </button>
      </div>
    </div>
  );
}
