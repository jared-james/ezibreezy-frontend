// components/post-editor/previews/instagram/instagram-media-display.tsx

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import { UserTagDto } from "@/lib/api/publishing";

interface InstagramMediaDisplayProps {
  displayMediaSrc?: string;
  mediaType: "image" | "video" | "text";
  aspectRatio: number;
  isTaggingMode: boolean;
  tags: UserTagDto[];
  onAddTag: (tag: UserTagDto) => void;
  onRemoveTag: (index: number) => void;
  coverUrl?: string | null;
  onVideoMetadataLoaded?: (duration: number) => void;
}

export function InstagramMediaDisplay({
  displayMediaSrc,
  mediaType,
  aspectRatio,
  isTaggingMode,
  tags,
  onAddTag,
  onRemoveTag,
  coverUrl,
  onVideoMetadataLoaded,
}: InstagramMediaDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTaggingMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setNewTag({ x, y, username: "" });
  };

  const finalizeTag = () => {
    if (newTag && newTag.username.trim()) {
      onAddTag({
        ...newTag,
        username: newTag.username.trim().replace(/^@/, ""),
      });
      setNewTag(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleImageClick}
      className={cn(
        "relative bg-[--background]",
        displayMediaSrc ? "" : "aspect-square flex items-center justify-center",
        isTaggingMode && "cursor-crosshair"
      )}
      style={displayMediaSrc ? { aspectRatio } : undefined}
    >
      {displayMediaSrc ? (
        mediaType === "video" ? (
          <video
            src={displayMediaSrc}
            className="w-full h-full object-contain"
            muted
            controls={false}
            autoPlay
            loop
            playsInline
            onLoadedMetadata={(e) =>
              onVideoMetadataLoaded?.(e.currentTarget.duration)
            }
            poster={coverUrl || undefined}
          />
        ) : (
          <img
            src={displayMediaSrc}
            alt="Media Preview"
            className="w-full h-full object-contain"
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-12">
          <ImageIcon className="w-8 h-8 mb-2" />
          <p>No Image/Video Attached</p>
        </div>
      )}

      {/* Tagging Overlay UI */}
      {isTaggingMode && (
        <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
          <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
            Click on the photo to tag a user
          </p>
        </div>
      )}

      {tags.map((tag, index) => (
        <div
          key={index}
          className="absolute group"
          style={{
            left: `${tag.x * 100}%`,
            top: `${tag.y * 100}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="relative flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-lg bg-black/85">
            <span>{tag.username}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(index);
              }}
              className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/85" />
          </div>
        </div>
      ))}

      {newTag && (
        <div
          className="absolute"
          style={{
            left: `${newTag.x * 100}%`,
            top: `${newTag.y * 100}%`,
            transform: "translate(-50%, 8px)",
          }}
        >
          <div className="w-40 rounded bg-white p-1 shadow-lg">
            <input
              type="text"
              autoFocus
              placeholder="@username"
              value={newTag.username}
              onChange={(e) =>
                setNewTag({ ...newTag, username: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  finalizeTag();
                }
              }}
              onBlur={finalizeTag}
              className="w-full border-none bg-transparent px-2 py-1 text-sm outline-none text-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
