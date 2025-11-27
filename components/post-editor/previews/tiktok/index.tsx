// components/post-editor/previews/tiktok/index.tsx

"use client";

import { memo, useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  ImageIcon,
  Crop,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { TikTokVideoOptions } from "./tiktok-video-options";
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

interface TikTokPreviewProps {
  caption: string;
  title?: string;
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
        className="rounded-full border-2 border-white shrink-0 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn("rounded-full bg-[--muted] border-2 border-white shrink-0")}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function TikTokPreview({
  caption,
  title,
  singleMediaItem,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
}: TikTokPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const setState = useEditorialStore((state) => state.setState);
  const tiktokVideoCoverTimestamp = useEditorialStore(
    (state) => state.tiktokVideoCoverTimestamp
  );
  const integrationId =
    useEditorialStore.getState().selectedAccounts["tiktok"]?.[0];

  const croppedPreview = singleMediaItem?.croppedPreviews?.tiktok;

  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

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
        "tiktok",
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
      if (!integrationId) throw new Error("TikTok account not selected.");

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
    <div className="w-full max-w-[300px] mx-auto space-y-4 transition-all duration-300">
      <div className="bg-[--surface] border border-[--border] shadow-lg rounded-[2rem] overflow-hidden">
        <div className="relative bg-black aspect-9/16 overflow-hidden">
          <div className="absolute inset-0">
            {displayMediaSrc ? (
              mediaType === "video" ? (
                <video
                  src={displayMediaSrc}
                  className="w-full h-full object-contain"
                  muted
                  loop
                  autoPlay
                  playsInline
                  onLoadedMetadata={(e) =>
                    setVideoDuration(e.currentTarget.duration)
                  }
                />
              ) : (
                <img
                  src={displayMediaSrc}
                  alt="Media Preview"
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>

          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
              <ProfileAvatar
                size={44}
                avatarUrl={avatarUrl}
                primaryName={primaryName}
              />
              <div className="w-5 h-5 -mt-2.5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Heart className="w-7 h-7 text-white" />
              <span className="text-white text-xs">0</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-white text-xs">0</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Bookmark className="w-7 h-7 text-white" />
              <span className="text-white text-xs">0</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Share2 className="w-7 h-7 text-white" />
              <span className="text-white text-xs">Share</span>
            </div>

            <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center animate-spin-slow">
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="absolute bottom-4 left-3 right-16 text-white">
            <p className="font-bold text-sm">@{accountName}</p>
            {title && (
              <p className="font-semibold text-sm mt-1 line-clamp-2">{title}</p>
            )}
            <p className="text-sm mt-1 line-clamp-3 whitespace-pre-wrap">
              {renderCaptionWithHashtags(caption)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Music className="w-3 h-3" />
              <p className="text-xs truncate">Original sound - {primaryName}</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 border-t border-border bg-surface">
          {canCrop ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleCropClick}
                title="Crop Image"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                disabled={isFetchingOriginal}
              >
                {isFetchingOriginal ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Crop className="h-3.5 w-3.5" />
                )}
                Crop
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center italic">
              TikTok Preview
            </p>
          )}
        </div>
      </div>

      {mediaType === "video" && displayMediaSrc && (
        <TikTokVideoOptions
          displayMediaSrc={displayMediaSrc}
          videoCoverTimestamp={tiktokVideoCoverTimestamp}
          onVideoCoverTimestampChange={(timestamp) =>
            setState({ tiktokVideoCoverTimestamp: timestamp })
          }
          videoDuration={videoDuration || 0}
        />
      )}

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="tiktok"
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(TikTokPreview);
