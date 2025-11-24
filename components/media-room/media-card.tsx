// components/media-room/media-card.tsx

"use client";

import { useState } from "react";
import { Heart, Play, Check, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { MediaItem } from "@/lib/api/media";
import { useUpdateMedia } from "@/lib/hooks/use-media";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface MediaCardProps {
  item: MediaItem;
  integrationId: string | null;
  isSelected: boolean;
  onSelect: (id: string, isShiftKey: boolean, isCtrlKey: boolean) => void;
  onOpenDetail: (id: string) => void;
  isDragDisabled?: boolean;
}

export default function MediaCard({
  item,
  integrationId,
  isSelected,
  onSelect,
  onOpenDetail,
  isDragDisabled = false,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const updateMedia = useUpdateMedia(integrationId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `media-${item.id}`,
    data: {
      type: "media",
      mediaId: item.id,
      item,
    },
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const isVideo = item.type.startsWith("video/");
  const isGif = item.type === "image/gif";

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateMedia.mutate({ id: item.id, data: { isFavorite: !item.isFavorite } });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      onOpenDetail(item.id);
    } else {
      onSelect(item.id, e.shiftKey, e.ctrlKey || e.metaKey);
    }
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
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative aspect-square bg-surface border cursor-pointer transition-all duration-200 overflow-hidden",
        isSelected
          ? "border-foreground ring-2 ring-foreground"
          : "border-border hover:border-foreground",
        isDragging && "ring-2 ring-brand-primary"
      )}
      {...listeners}
      {...attributes}
    >
      {/* Thumbnail */}
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

      {/* Selection checkbox */}
      <button
        onClick={handleCheckboxClick}
        className={cn(
          "absolute top-2 left-2 w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all",
          isSelected
            ? "bg-foreground border-foreground"
            : "bg-white/80 border-border hover:border-foreground",
          !isSelected && !isHovered && "opacity-0 group-hover:opacity-100"
        )}
      >
        {isSelected && <Check className="w-3 h-3 text-background" />}
      </button>

      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        disabled={updateMedia.isPending}
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-full transition-all",
          item.isFavorite
            ? "bg-red-500 text-white"
            : "bg-white/80 text-muted-foreground hover:text-foreground",
          !item.isFavorite && !isHovered && "opacity-0 group-hover:opacity-100"
        )}
      >
        <Heart
          className={cn("w-3.5 h-3.5", item.isFavorite && "fill-current")}
        />
      </button>

      {/* Type badge */}
      {(isVideo || isGif) && (
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold uppercase tracking-wider rounded">
          {isGif ? "GIF" : "Video"}
        </div>
      )}

      {/* Usage count badge */}
      {item.usageCount > 0 && (
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-brand-primary text-white text-[9px] font-bold rounded">
          {item.usageCount} {item.usageCount === 1 ? "post" : "posts"}
        </div>
      )}

      {/* Hover overlay with info */}
      {isHovered && (
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          <p className="text-white text-xs font-serif truncate">{item.filename}</p>
          <p className="text-white/70 text-[10px] font-serif">
            {formatFileSize(item.fileSize)} &middot;{" "}
            {format(new Date(item.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      )}

      {/* Tags */}
      {item.tags.length > 0 && !isHovered && (
        <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded"
              style={{
                backgroundColor: tag.color + "20",
                color: tag.color,
                border: `1px solid ${tag.color}40`,
              }}
            >
              {tag.name}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="px-1.5 py-0.5 bg-black/50 text-white text-[8px] font-bold rounded">
              +{item.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
