// components/post-editor/instagram-preview.tsx

import { memo, useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ImageIcon,
  UserPlus,
  X,
  Crop,
  Grid3X3,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { renderCaptionWithHashtags } from "./render-caption";
import { UserTagDto } from "@/lib/api/publishing";
import { ImageCropperModal } from "./image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";

interface InstagramPreviewProps {
  caption: string;
  mediaPreview: string | null;
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  collaborators: string;
  location: string;
  postType: "post" | "reel" | "story";
  userTags: UserTagDto[];
  onUserTagsChange: (tags: UserTagDto[]) => void;
  originalMediaSrc?: string;
  croppedPreview?: string;
  onCropComplete?: (cropData: CropData, croppedPreviewUrl: string) => void;
  /** The aspect ratio of the cropped image (width/height). Defaults to 1 (square). */
  aspectRatio?: number;
}

const ProfileAvatar = ({
  size,
  avatarUrl,
  primaryName,
}: {
  size: number;
  avatarUrl: string | null;
  primaryName: string;
}) => {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        width={size}
        height={size}
        className="rounded-full border border-[--border] shrink-0 object-cover"
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border border-[--border] shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function InstagramPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  collaborators,
  location,
  postType,
  userTags,
  onUserTagsChange,
  originalMediaSrc,
  croppedPreview,
  onCropComplete,
  aspectRatio = 1,
}: InstagramPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [localTags, setLocalTags] = useState<UserTagDto[]>(userTags);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"post" | "grid">("post");

  const displayMediaSrc = croppedPreview || mediaPreview;
  const canCrop = originalMediaSrc && mediaType === "image" && onCropComplete;

  const handleCropComplete = async (
    croppedAreaPixels: PixelCrop,
    aspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => {
    if (!originalMediaSrc || !onCropComplete) return;

    try {
      // --- START OF NEW CODE ---

      // 1. Get the original image's dimensions
      const getOriginalDimensions = (
        src: string
      ): Promise<{ width: number; height: number }> =>
        new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () =>
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = reject;
          img.src = src;
        });

      const originalDimensions = await getOriginalDimensions(originalMediaSrc);

      // 2. Calculate the scaling factor
      const scalingFactor = originalDimensions.width / displayedWidth;

      // 3. Scale the crop coordinates to match the original image
      const scaledCroppedAreaPixels: PixelCrop = {
        ...croppedAreaPixels,
        x: Math.round(croppedAreaPixels.x * scalingFactor),
        y: Math.round(croppedAreaPixels.y * scalingFactor),
        width: Math.round(croppedAreaPixels.width * scalingFactor),
        height: Math.round(croppedAreaPixels.height * scalingFactor),
      };

      // --- END OF NEW CODE ---

      // This function creates the small preview for the UI, it can remain as is.
      const croppedUrl = await createCroppedPreviewUrl(
        originalMediaSrc,
        croppedAreaPixels, // Use original pixels for the UI preview function if needed
        displayedWidth,
        displayedHeight
      );

      // IMPORTANT: Pass the NEW, SCALED coordinates up to the parent.
      const cropData: CropData = {
        croppedAreaPixels: scaledCroppedAreaPixels, // Use the scaled version here
        aspectRatio,
      };

      onCropComplete(cropData, croppedUrl);
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  };

  useEffect(() => {
    setLocalTags(userTags);
  }, [userTags]);

  useEffect(() => {
    onUserTagsChange(localTags);
  }, [localTags, onUserTagsChange]);

  const isTaggingSupported = mediaPreview && postType === "post";

  useEffect(() => {
    if (!isTaggingSupported) {
      setIsTaggingMode(false);
    }
  }, [isTaggingSupported]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTaggingMode || !mediaContainerRef.current) return;
    const rect = mediaContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setNewTag({ x, y, username: "" });
  };

  const handleAddTag = () => {
    if (newTag && newTag.username.trim()) {
      const finalTag = {
        ...newTag,
        username: newTag.username.trim().replace(/^@/, ""),
      };
      setLocalTags((prev) => [...prev, finalTag]);
      setNewTag(null);
    }
  };

  const handleRemoveTag = (index: number) => {
    setLocalTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto">
      <div className="flex items-center justify-between p-3 border-b border-[--border]">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            size={32}
            avatarUrl={avatarUrl}
            primaryName={primaryName}
          />
          <div>
            <span className="font-semibold text-sm text-[--foreground]">
              {primaryName}
            </span>
            {location && (
              <p className="text-xs text-[--muted-foreground] leading-none">
                {location}
              </p>
            )}
          </div>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="font-serif text-sm">...</span>
        </div>
      </div>

      {viewMode === "grid" ? (
        // Grid view - shows how the image appears on Instagram profile grid (1:1 center-cropped)
        <div className="relative aspect-square bg-[--background] overflow-hidden">
          {displayMediaSrc ? (
            mediaType === "video" ? (
              <video
                src={displayMediaSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={displayMediaSrc}
                alt="Grid Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-[--muted-foreground]" />
            </div>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <p className="text-xs text-white bg-black/60 rounded-full px-3 py-1">
              Grid thumbnail (1:1 crop)
            </p>
          </div>
        </div>
      ) : (
        // Post view - shows how the image appears when viewing the full post (actual aspect ratio)
        <div
          ref={mediaContainerRef}
          onClick={handleImageClick}
          className={cn(
            "relative bg-[--background]",
            displayMediaSrc ? "" : "aspect-square flex items-center justify-center",
            isTaggingMode && "cursor-crosshair"
          )}
          style={displayMediaSrc ? { aspectRatio: aspectRatio } : undefined}
        >
          {displayMediaSrc ? (
            mediaType === "video" ? (
              <video
                src={displayMediaSrc}
                className="w-full h-full object-contain"
                muted
                loop
                autoPlay
                playsInline
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

          {isTaggingMode && (
            <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
              <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
                Click on the photo to tag a user
              </p>
            </div>
          )}

          {localTags.map((tag, index) => (
            <div
              key={index}
              className="absolute group"
              style={{
                left: `${tag.x * 100}%`,
                top: `${tag.y * 100}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div
                className="relative flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-lg"
                style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
              >
                <span>{tag.username}</span>
                <button
                  onClick={() => handleRemoveTag(index)}
                  className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
                <div
                  className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
                  style={{ borderTopColor: "rgba(0,0,0,0.85)" }}
                />
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
                      handleAddTag();
                    }
                  }}
                  onBlur={handleAddTag}
                  className="w-full border-none bg-transparent px-2 py-1 text-sm outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between p-3">
        <div className="flex items-center gap-4 text-[--muted-foreground]">
          <Heart className="size-6 hover:text-[--foreground] cursor-pointer" />
          <MessageCircle className="size-6 hover:text-[--foreground] cursor-pointer" />
          <Send className="size-6 hover:text-[--foreground] cursor-pointer" />
        </div>
        <Bookmark className="size-6 text-[--muted-foreground] hover:text-[--foreground] cursor-pointer" />
      </div>

      <div className="px-3 pb-4 space-y-2">
        <p className="text-xs font-semibold text-[--foreground]">0 likes</p>

        <div className="text-sm">
          <span className="font-semibold mr-1">{primaryName}</span>
          <span className="whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </span>
        </div>

        {collaborators && (
          <p className="text-xs text-[--brand-primary]">
            With <span className="font-semibold">{collaborators}</span>
          </p>
        )}

        <p className="text-xs text-[--muted-foreground]">View all 0 comments</p>
        <p className="text-[0.65rem] uppercase text-[--muted-foreground]">
          Now
        </p>
      </div>

      <div className="px-3 py-2 border-t border-border">
        {isTaggingSupported || canCrop || displayMediaSrc ? (
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            {displayMediaSrc && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("post")}
                  title="Post View"
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium transition-colors",
                    viewMode === "post"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Square className="h-3.5 w-3.5" />
                  Post
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                  Grid
                </button>
              </div>
            )}

            {/* Divider */}
            {displayMediaSrc && (canCrop || isTaggingSupported) && (
              <div className="h-4 w-px bg-border" />
            )}

            {/* Action Buttons */}
            {canCrop && (
              <button
                onClick={() => setIsCropperOpen(true)}
                title="Crop Image"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Crop className="h-3.5 w-3.5" />
                Crop
              </button>
            )}
            {isTaggingSupported && (
              <button
                onClick={() => {
                  if (viewMode === "grid") return;
                  if (isTaggingMode) {
                    setNewTag(null);
                  }
                  setIsTaggingMode(!isTaggingMode);
                }}
                title={viewMode === "grid" ? "Switch to Post view to tag" : isTaggingMode ? "Done Tagging" : "Tag People"}
                disabled={viewMode === "grid"}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors",
                  viewMode === "grid"
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : isTaggingMode
                      ? "text-brand-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                <UserPlus className="h-3.5 w-3.5" />
                {isTaggingMode ? "Done" : "Tag"}
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Instagram Preview
          </p>
        )}
      </div>

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="instagram"
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(InstagramPreview);
