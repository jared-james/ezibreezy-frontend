// components/post-editor/previews/instagram/instagram-media-display.tsx

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import { UserTagDto, ProductTagDto } from "@/lib/types/publishing";
import { Product } from "@/lib/types/commerce";

interface InstagramMediaDisplayProps {
  displayMediaSrc?: string;
  mediaType: "image" | "video" | "text";
  aspectRatio: number;
  isTaggingMode: boolean;
  mediaId: string | null; // Added: need media ID for tagging
  tags: UserTagDto[]; // Kept as array since this is for a single media item
  onAddTag: (tag: UserTagDto) => void;
  onRemoveTag: (index: number) => void;
  isProductTaggingMode?: boolean;
  productTags?: ProductTagDto[];
  onAddProductTag?: (tag: ProductTagDto, product: Product) => void;
  onRemoveProductTag?: (index: number) => void;
  onProductTagClick?: (x: number, y: number) => void;
  coverUrl?: string | null;
  onVideoMetadataLoaded?: (duration: number) => void;
  isStory?: boolean;
}

export function InstagramMediaDisplay({
  displayMediaSrc,
  mediaType,
  aspectRatio,
  isTaggingMode,
  mediaId,
  tags,
  onAddTag,
  onRemoveTag,
  isProductTaggingMode = false,
  productTags = [],
  onAddProductTag,
  onRemoveProductTag,
  onProductTagClick,
  coverUrl,
  onVideoMetadataLoaded,
  isStory = false,
}: InstagramMediaDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handle product tagging mode
    if (isProductTaggingMode && onProductTagClick) {
      if (!mediaId) return;

      // Get the actual media element (image or video)
      const mediaElement = imageRef.current || videoRef.current;
      if (!mediaElement) return;

      // Get the media element's bounding box
      const mediaRect = mediaElement.getBoundingClientRect();

      // Check if click is within the actual media bounds
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (
        clickX < mediaRect.left ||
        clickX > mediaRect.right ||
        clickY < mediaRect.top ||
        clickY > mediaRect.bottom
      ) {
        return;
      }

      // Calculate position and open product selector
      const x = (clickX - mediaRect.left) / mediaRect.width;
      const y = (clickY - mediaRect.top) / mediaRect.height;

      onProductTagClick(x, y);
      return;
    }

    // Handle user tagging mode
    if (!isTaggingMode || !containerRef.current) return;

    // Can only tag if media has been uploaded (has an ID)
    if (!mediaId) return;

    // Get the actual media element (image or video)
    const mediaElement = imageRef.current || videoRef.current;
    if (!mediaElement) return;

    // Get the media element's bounding box
    const mediaRect = mediaElement.getBoundingClientRect();

    // Check if click is within the actual media bounds
    const clickX = e.clientX;
    const clickY = e.clientY;

    if (
      clickX < mediaRect.left ||
      clickX > mediaRect.right ||
      clickY < mediaRect.top ||
      clickY > mediaRect.bottom
    ) {
      return; // Click is outside the actual media, ignore it
    }

    // Calculate position relative to the media element
    const x = (clickX - mediaRect.left) / mediaRect.width;
    const y = (clickY - mediaRect.top) / mediaRect.height;
    setNewTag({ x, y, username: "" });
  };

  const finalizeTag = () => {
    if (newTag && newTag.username.trim() && mediaId) {
      onAddTag({
        ...newTag,
        username: newTag.username.trim().replace(/^@/, ""),
      });
      setNewTag(null);
    }
  };

  const cancelTag = () => {
    setNewTag(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleImageClick}
      className={cn(
        "relative bg-[--background]",
        displayMediaSrc && isStory ? "aspect-9/16" : displayMediaSrc ? "" : "aspect-square flex items-center justify-center",
        (isTaggingMode || isProductTaggingMode) && "cursor-crosshair"
      )}
      style={displayMediaSrc && !isStory ? { aspectRatio } : undefined}
    >
      {displayMediaSrc ? (
        mediaType === "video" ? (
          <video
            ref={videoRef}
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
            ref={imageRef}
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

      {/* Product Tagging Overlay UI */}
      {isProductTaggingMode && (
        <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
          <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
            Click on the photo to tag a product
          </p>
        </div>
      )}

      {/* User Tags */}
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

      {/* Product Tags */}
      {productTags.map((tag, index) => (
        <div
          key={`product-${index}`}
          className="absolute group"
          style={{
            left: `${tag.x * 100}%`,
            top: `${tag.y * 100}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="relative flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-lg bg-blue-600/90">
            <span className="max-w-[120px] truncate">Product</span>
            {onRemoveProductTag && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveProductTag(index);
                }}
                className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-600/90" />
          </div>
        </div>
      ))}

      {newTag && (
        <div
          className="absolute pointer-events-auto"
          style={{
            left: `${newTag.x * 100}%`,
            top: `${newTag.y * 100}%`,
            transform: "translate(-50%, 8px)",
          }}
        >
          <div className="relative">
            <button
              className="cancel-tag-btn absolute -top-2 -left-2 p-0.5 bg-white hover:bg-gray-100 rounded-full shadow-md z-10"
              onClick={(e) => {
                e.stopPropagation();
                cancelTag();
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing
              type="button"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
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
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelTag();
                  }
                }}
                onBlur={(e) => {
                  // Only finalize if the blur wasn't caused by clicking the X button
                  if (!e.relatedTarget?.closest('.cancel-tag-btn')) {
                    finalizeTag();
                  }
                }}
                className="w-full border-none bg-transparent px-2 py-1 text-sm outline-none text-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
