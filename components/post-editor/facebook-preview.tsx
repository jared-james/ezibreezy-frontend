// components/post-editor/facebook-preview.tsx

import { memo, useState, useRef, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  ImageIcon,
  Crop,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "./render-caption";
import { ImageCropperModal } from "./image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import {
  createCroppedPreviewUrl,
  type CropData,
  STORY_ASPECT_RATIO,
  calculateCenteredCrop,
} from "@/lib/utils/crop-utils";
import { UserTagDto } from "@/lib/api/publishing";

interface FacebookPreviewProps {
  caption: string;
  mediaPreview: string | null;
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  originalMediaSrc?: string;
  croppedPreview?: string;
  onCropComplete?: (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => void;
  postType: "post" | "reel" | "story";
  userTags: UserTagDto[];
  onUserTagsChange: (tags: UserTagDto[]) => void;
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
      <img
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        className="rounded-full border border-[--border] shrink-0 object-cover"
        style={{ width: size, height: size }}
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

function FacebookPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  originalMediaSrc,
  croppedPreview,
  onCropComplete,
  postType,
  userTags,
  onUserTagsChange,
  aspectRatio = 1.91,
}: FacebookPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [localTags, setLocalTags] = useState<UserTagDto[]>(userTags);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);

  const displayMediaSrc = croppedPreview || mediaPreview;
  const canCrop = originalMediaSrc && mediaType === "image" && onCropComplete;

  // Disable tagging if video or if it's a story
  const isTaggingSupported =
    mediaPreview && postType === "post" && mediaType !== "video";

  // Track previous postType to detect transitions
  const prevPostTypeRef = useRef(postType);
  useEffect(() => {
    const applyAutoCrop = async () => {
      if (!originalMediaSrc || !onCropComplete) return;

      // If switching TO 'story', auto-crop to 9:16
      if (prevPostTypeRef.current !== "story" && postType === "story") {
        try {
          // Load image to get dimensions
          const img = new window.Image();
          img.src = originalMediaSrc;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });

          const displayedWidth = img.naturalWidth;
          const displayedHeight = img.naturalHeight;

          // Calculate centered crop for story aspect ratio
          const cropPixels = calculateCenteredCrop(
            displayedWidth,
            displayedHeight,
            STORY_ASPECT_RATIO
          );

          // Create cropped preview URL
          const croppedUrl = await createCroppedPreviewUrl(
            originalMediaSrc,
            cropPixels,
            displayedWidth,
            displayedHeight
          );

          const cropData: CropData = {
            croppedAreaPixels: cropPixels,
            aspectRatio: STORY_ASPECT_RATIO,
          };

          onCropComplete(cropData, croppedUrl);
        } catch (error) {
          console.error("Failed to auto-crop for story:", error);
        }
      }
      // If switching FROM 'story' to 'post' and the current aspect ratio is story (9:16),
      // reset the crop to prevent showing an invalid aspect ratio for posts
      else if (
        prevPostTypeRef.current === "story" &&
        postType === "post" &&
        aspectRatio === STORY_ASPECT_RATIO
      ) {
        // Reset the crop by passing undefined
        onCropComplete(undefined, "");
      }

      prevPostTypeRef.current = postType;
    };

    applyAutoCrop();
  }, [postType, aspectRatio, onCropComplete, originalMediaSrc]);

  const handleCropComplete = async (
    croppedAreaPixels: PixelCrop,
    newAspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => {
    if (!originalMediaSrc || !onCropComplete) return;

    try {
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
      const scalingFactor = originalDimensions.width / displayedWidth;

      const scaledCroppedAreaPixels: PixelCrop = {
        ...croppedAreaPixels,
        x: Math.round(croppedAreaPixels.x * scalingFactor),
        y: Math.round(croppedAreaPixels.y * scalingFactor),
        width: Math.round(croppedAreaPixels.width * scalingFactor),
        height: Math.round(croppedAreaPixels.height * scalingFactor),
      };

      const croppedUrl = await createCroppedPreviewUrl(
        originalMediaSrc,
        croppedAreaPixels,
        displayedWidth,
        displayedHeight
      );

      const cropData: CropData = {
        croppedAreaPixels: scaledCroppedAreaPixels,
        aspectRatio: newAspectRatio,
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
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <ProfileAvatar
          size={40}
          avatarUrl={avatarUrl}
          primaryName={primaryName}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[--foreground]">
            {primaryName}
          </p>
          <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
            <span>Just now</span>
            <span>·</span>
            <span>🌐</span>
          </div>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="text-lg">···</span>
        </div>
      </div>

      {/* Caption */}
      {postType !== "story" && (
        <div className="px-3 pb-3">
          <p className="text-sm text-[--foreground] whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </p>
        </div>
      )}

      {/* Media */}
      <div
        ref={mediaContainerRef}
        onClick={handleImageClick}
        className={cn(
          "relative bg-[--background]",
          !displayMediaSrc && "aspect-video flex items-center justify-center",
          isTaggingMode && "cursor-crosshair"
        )}
      >
        {displayMediaSrc ? (
          mediaType === "video" ? (
            <video
              src={displayMediaSrc}
              className="w-full h-auto block"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={displayMediaSrc}
              alt="Media Preview"
              className="w-full h-auto block"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-8">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">No media attached</p>
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

      {/* Engagement Stats - only for posts, not stories */}
      {postType !== "story" && (
        <div className="flex items-center justify-between px-3 py-2 text-xs text-[--muted-foreground]">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px]">
              👍
            </span>
            <span>0</span>
          </div>
          <div className="flex items-center gap-2">
            <span>0 comments</span>
            <span>0 shares</span>
          </div>
        </div>
      )}

      {/* Action Buttons - only for posts, not stories */}
      {postType !== "story" && (
        <div className="flex items-center justify-around py-1 border-t border-[--border] text-[--muted-foreground]">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
            <ThumbsUp className="w-5 h-5" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[--border]">
        {isTaggingSupported || canCrop ? (
          <div className="flex items-center gap-4">
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
                  if (isTaggingMode) {
                    setNewTag(null);
                  }
                  setIsTaggingMode(!isTaggingMode);
                }}
                title={isTaggingMode ? "Done Tagging" : "Tag People"}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors",
                  isTaggingMode
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
          <p className="text-xs text-[--muted-foreground] text-center italic">
            Facebook Preview
          </p>
        )}
      </div>

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="facebook"
          postType={postType}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(FacebookPreview);
