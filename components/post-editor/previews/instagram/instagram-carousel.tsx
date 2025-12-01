// components/post-editor/previews/instagram/instagram-carousel.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial/draft-store";
import { UserTagDto, ProductTagDto } from "@/lib/api/publishing";
import { Product } from "@/lib/api/commerce";

interface InstagramCarouselProps {
  mediaItems: MediaItem[];
  aspectRatio: number;
  isTaggingMode: boolean;
  tags: Record<string, UserTagDto[]>; // Changed: keyed by mediaId
  onAddTag: (mediaId: string, tag: UserTagDto) => void;
  onRemoveTag: (mediaId: string, index: number) => void;
  isProductTaggingMode?: boolean;
  productTags?: Record<string, ProductTagDto[]>;
  onAddProductTag?: (
    mediaId: string,
    tag: ProductTagDto,
    product: Product
  ) => void;
  onRemoveProductTag?: (mediaId: string, index: number) => void;
  onProductTagClick?: (mediaId: string, x: number, y: number) => void;
  onVideoMetadataLoaded?: (duration: number) => void;
  isStory?: boolean;
  onCurrentIndexChange?: (index: number) => void;
}

export function InstagramCarousel({
  mediaItems,
  aspectRatio,
  isTaggingMode,
  tags,
  onAddTag,
  onRemoveTag,
  isProductTaggingMode = false,
  productTags = {},
  onAddProductTag,
  onRemoveProductTag,
  onProductTagClick,
  onVideoMetadataLoaded,
  isStory = false,
  onCurrentIndexChange,
}: InstagramCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);

  const currentMedia = mediaItems[currentIndex];

  // UPDATED: Use mediaUrl for video source if available, otherwise fallback to preview
  const displayMediaSrc =
    currentMedia?.croppedPreviews?.instagram ||
    (currentMedia?.type === "video" && currentMedia.mediaUrl
      ? currentMedia.mediaUrl
      : currentMedia?.preview);

  // Get tags for the current media item
  const currentMediaTags = currentMedia?.id ? tags[currentMedia.id] || [] : [];
  const currentMediaProductTags = currentMedia?.id
    ? productTags[currentMedia.id] || []
    : [];

  // Notify parent of index changes via useEffect to avoid setState during render
  useEffect(() => {
    onCurrentIndexChange?.(currentIndex);
  }, [currentIndex, onCurrentIndexChange]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handle product tagging mode
    if (
      isProductTaggingMode &&
      onProductTagClick &&
      currentMedia.type === "image"
    ) {
      if (!currentMedia.id) return;

      const mediaElement = imageRef.current;
      if (!mediaElement) return;

      const mediaRect = mediaElement.getBoundingClientRect();
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

      const x = (clickX - mediaRect.left) / mediaRect.width;
      const y = (clickY - mediaRect.top) / mediaRect.height;

      onProductTagClick(currentMedia.id, x, y);
      return;
    }

    // Handle user tagging mode
    // Only allow tagging on images, not videos
    if (
      !isTaggingMode ||
      !containerRef.current ||
      currentMedia.type === "video"
    )
      return;

    // Can only tag if media has been uploaded (has an ID)
    if (!currentMedia.id) return;

    const mediaElement = imageRef.current;
    if (!mediaElement) return;

    const mediaRect = mediaElement.getBoundingClientRect();
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

    const x = (clickX - mediaRect.left) / mediaRect.width;
    const y = (clickY - mediaRect.top) / mediaRect.height;

    setNewTag({ x, y, username: "" });
  };

  const finalizeTag = () => {
    if (newTag && newTag.username.trim() && currentMedia.id) {
      onAddTag(currentMedia.id, {
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
        (isTaggingMode || isProductTaggingMode) && "cursor-crosshair"
      )}
      style={{ aspectRatio }}
    >
      {/* Media Display */}
      {displayMediaSrc &&
        (currentMedia.type === "video" ? (
          <video
            ref={videoRef}
            src={displayMediaSrc}
            className={cn(
              "w-full h-full",
              isStory ? "object-cover" : "object-contain"
            )}
            muted
            controls={false}
            autoPlay
            loop
            playsInline
            onLoadedMetadata={(e) =>
              onVideoMetadataLoaded?.(e.currentTarget.duration)
            }
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            src={displayMediaSrc}
            alt={`Media ${currentIndex + 1}`}
            className={cn(
              "w-full h-full",
              isStory ? "object-cover" : "object-contain"
            )}
          />
        ))}

      {/* Navigation Arrows - Only show if more than 1 item */}
      {mediaItems.length > 1 && !isStory && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Tagging Overlay - Only show on images */}
      {isTaggingMode && currentMedia.type === "image" && (
        <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
          <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
            Click on the photo to tag a user
          </p>
        </div>
      )}

      {/* Product Tagging Overlay - Only show on images */}
      {isProductTaggingMode && currentMedia.type === "image" && (
        <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
          <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
            Click on the photo to tag a product
          </p>
        </div>
      )}

      {/* Existing User Tags for Current Media */}
      {currentMediaTags.map((tag, index) => (
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
                if (currentMedia.id) {
                  onRemoveTag(currentMedia.id, index);
                }
              }}
              className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/85" />
          </div>
        </div>
      ))}

      {/* Existing Product Tags for Current Media */}
      {currentMediaProductTags.map((tag, index) => (
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
                  if (currentMedia.id) {
                    onRemoveProductTag(currentMedia.id, index);
                  }
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

      {/* New Tag Input */}
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
              onMouseDown={(e) => e.preventDefault()}
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
                  if (!e.relatedTarget?.closest(".cancel-tag-btn")) {
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
