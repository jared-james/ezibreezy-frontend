// components/post-editor/linkedin-preview.tsx

import { memo, useState } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  ImageIcon,
  Crop,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

interface LinkedInPreviewProps {
  caption: string;
  singleMediaItem: MediaItem | null;
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
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

function LinkedInPreview({
  caption,
  singleMediaItem,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
}: LinkedInPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const integrationId =
    useEditorialStore.getState().selectedAccounts["linkedin"]?.[0];

  const croppedPreview = singleMediaItem?.croppedPreviews?.linkedin;
  const displayMediaSrc = croppedPreview || singleMediaItem?.preview;
  const canCrop = singleMediaItem?.id && mediaType === "image";
  const originalMediaSrc = singleMediaItem?.file
    ? singleMediaItem.preview
    : singleMediaItem?.originalUrlForCropping;

  const onCropComplete = (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => {
    if (singleMediaItem) {
      setCropForMedia(
        singleMediaItem.uid,
        "linkedin",
        cropData,
        croppedPreviewUrl
      );
    }
  };

  const handleCropComplete = async (
    croppedAreaPixels: PixelCrop,
    aspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => {
    if (!originalMediaSrc) return;

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
        aspectRatio,
      };
      onCropComplete(cropData, croppedUrl);
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  };

  const handleCropClick = async () => {
    if (!canCrop || !singleMediaItem || !singleMediaItem.id) return;

    if (singleMediaItem.originalUrlForCropping) {
      setIsCropperOpen(true);
      return;
    }

    setIsFetchingOriginal(true);
    try {
      if (!integrationId) throw new Error("LinkedIn account not selected.");

      const { downloadUrl } = await getMediaViewUrl(
        singleMediaItem.id,
        integrationId
      );

      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === singleMediaItem.uid
          ? { ...item, originalUrlForCropping: downloadUrl }
          : item
      );
      useEditorialStore.getState().setStagedMediaItems(updatedItems);

      setIsCropperOpen(true);
    } catch (error) {
      console.error("Failed to get view URL for cropping:", error);
      toast.error(
        "Could not load original image for cropping. Please try again."
      );
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
      <div className="flex items-start gap-3 p-3">
        <ProfileAvatar
          size={48}
          avatarUrl={avatarUrl}
          primaryName={primaryName}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[--foreground] truncate">
            {primaryName}
          </p>
          <p className="text-xs text-[--muted-foreground] truncate">
            @{accountName}
          </p>
          <p className="text-xs text-[--muted-foreground]">Now · 🌐</p>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="text-lg">···</span>
        </div>
      </div>

      <div className="px-3 pb-3">
        <p className="text-sm text-[--foreground] whitespace-pre-wrap">
          {renderCaptionWithHashtags(caption)}
        </p>
      </div>

      <div
        className={cn(
          "aspect-video bg-[--background]",
          displayMediaSrc ? "" : "flex items-center justify-center"
        )}
      >
        {displayMediaSrc ? (
          mediaType === "video" ? (
            <video
              src={displayMediaSrc}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={displayMediaSrc}
              alt="Media Preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-8">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">No media attached</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-2 text-xs text-[--muted-foreground] border-b border-[--border]">
        <div className="flex items-center gap-1">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]">
            👍
          </span>
          <span>0</span>
        </div>
        <div className="flex items-center gap-2">
          <span>0 comments</span>
          <span>·</span>
          <span>0 reposts</span>
        </div>
      </div>

      <div className="flex items-center justify-around py-2 text-[--muted-foreground]">
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>

      <div className="p-3 border-t border-[--border]">
        {canCrop ? (
          <button
            onClick={handleCropClick}
            className="flex items-center gap-2 justify-center w-full font-serif font-bold text-sm text-brand-primary hover:text-brand-accent"
            disabled={isFetchingOriginal}
          >
            {isFetchingOriginal ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Crop className="h-4 w-4" />
            )}
            Crop
          </button>
        ) : (
          <p className="text-xs text-[--muted-foreground] text-center italic">
            LinkedIn Preview
          </p>
        )}
      </div>

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="linkedin"
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(LinkedInPreview);
