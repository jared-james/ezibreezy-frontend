// components/post-editor/facebook-preview.tsx

import { memo, useState, useRef, useEffect } from "react";
import { ThumbsUp, MessageCircle, Share2, ImageIcon, Crop } from "lucide-react";
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
  aspectRatio = 1.91,
}: FacebookPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const displayMediaSrc = croppedPreview || mediaPreview;
  const canCrop = originalMediaSrc && mediaType === "image" && onCropComplete;

  const prevPostTypeRef = useRef(postType);
  useEffect(() => {
    const applyAutoCrop = async () => {
      if (!originalMediaSrc || !onCropComplete) return;

      if (prevPostTypeRef.current !== "story" && postType === "story") {
        try {
          const img = new window.Image();
          img.src = originalMediaSrc;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });

          const displayedWidth = img.naturalWidth;
          const displayedHeight = img.naturalHeight;

          const cropPixels = calculateCenteredCrop(
            displayedWidth,
            displayedHeight,
            STORY_ASPECT_RATIO
          );

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
      } else if (
        prevPostTypeRef.current === "story" &&
        postType === "post" &&
        aspectRatio === STORY_ASPECT_RATIO
      ) {
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

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
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

      {postType !== "story" && (
        <div className="px-3 pb-3">
          <p className="text-sm text-[--foreground] whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </p>
        </div>
      )}

      <div
        className={cn(
          "relative bg-[--background]",
          !displayMediaSrc && "aspect-video flex items-center justify-center"
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
      </div>

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

      <div className="px-3 py-2 border-t border-[--border]">
        {canCrop ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCropperOpen(true)}
              title="Crop Image"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Crop className="h-3.5 w-3.5" />
              Crop
            </button>
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
