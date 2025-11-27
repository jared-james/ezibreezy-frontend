// components/post-editor/previews/linkedin/index.tsx

"use client";

import { memo, useState } from "react";
import { ImageIcon, Crop, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { AltTextModal } from "../../modals/alt-text-modal"; // Import AltTextModal
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

// Sub-components
import { LinkedInHeader } from "./linkedin-header";
import { LinkedInPostFooter } from "./linkedin-post-footer";
import { LinkedInCarousel } from "./linkedin-carousel";

interface LinkedInPreviewProps {
  caption: string;
  singleMediaItem: MediaItem | null;
  mediaItems?: MediaItem[];
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  aspectRatio?: number;
}

function LinkedInPreview({
  caption,
  singleMediaItem,
  mediaItems = [],
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  aspectRatio = 1.91,
}: LinkedInPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isAltTextModalOpen, setIsAltTextModalOpen] = useState(false); // Alt Text State
  const [altTextInitialIndex, setAltTextInitialIndex] = useState(0); // Alt Text State
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const integrationId =
    useEditorialStore.getState().selectedAccounts["linkedin"]?.[0];

  // Determine if we have multiple media items
  const hasMultipleMedia = mediaItems.length > 1;
  const isCarousel = hasMultipleMedia;

  // LinkedIn uses 1:1 for carousels, 1.91:1 for single posts
  const previewAspectRatio = isCarousel ? 1 : aspectRatio;

  // For carousel mode, get the current media item
  const currentCarouselMedia = isCarousel
    ? mediaItems[currentCarouselIndex]
    : null;

  // Determine which media to use for cropping: carousel item or single item
  const activeMediaForCrop = currentCarouselMedia || singleMediaItem;

  const croppedPreview = singleMediaItem?.croppedPreviews?.linkedin;

  // UPDATED: Use mediaUrl for video source if available
  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

  // Can crop if we have an uploaded image (either single or in carousel)
  const canCrop =
    !!activeMediaForCrop?.id && activeMediaForCrop?.type === "image";

  // Alt text editing: Filter to only uploaded images
  const editableMediaItems = isCarousel
    ? mediaItems.filter((item) => item.type === "image" && !!item.id)
    : singleMediaItem?.type === "image" && singleMediaItem?.id
    ? [singleMediaItem]
    : [];

  const canEditAltText = editableMediaItems.length > 0;

  const originalMediaSrc = activeMediaForCrop?.file
    ? activeMediaForCrop.preview
    : activeMediaForCrop?.originalUrlForCropping;

  const onCropComplete = (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => {
    // Use activeMediaForCrop (handles both carousel and single media)
    if (activeMediaForCrop) {
      setCropForMedia(
        activeMediaForCrop.uid,
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
    // Use activeMediaForCrop which already handles carousel vs single media
    if (
      !activeMediaForCrop ||
      !activeMediaForCrop.id ||
      activeMediaForCrop.type !== "image"
    ) {
      return;
    }

    if (activeMediaForCrop.originalUrlForCropping) {
      setIsCropperOpen(true);
      return;
    }

    setIsFetchingOriginal(true);
    try {
      if (!integrationId) throw new Error("LinkedIn account not selected.");

      const { downloadUrl } = await getMediaViewUrl(
        activeMediaForCrop.id,
        integrationId
      );

      // Update store so next time we don't fetch
      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === activeMediaForCrop.uid
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

  const handleAltTextClick = () => {
    if (isCarousel) {
      // Find the index of current carousel item in editable items
      const currentMedia = mediaItems[currentCarouselIndex];
      const editableIndex = editableMediaItems.findIndex(
        (item) => item.uid === currentMedia.uid
      );
      setAltTextInitialIndex(editableIndex >= 0 ? editableIndex : 0);
    } else {
      setAltTextInitialIndex(0);
    }
    setIsAltTextModalOpen(true);
  };

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
      {/* Header */}
      <LinkedInHeader
        avatarUrl={avatarUrl}
        primaryName={primaryName}
        accountName={accountName}
      />

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-sm text-[--foreground] whitespace-pre-wrap">
          {renderCaptionWithHashtags(caption)}
        </p>
      </div>

      {/* Media Content */}
      {isCarousel ? (
        <LinkedInCarousel
          mediaItems={mediaItems}
          aspectRatio={previewAspectRatio}
          onCurrentIndexChange={setCurrentCarouselIndex}
        />
      ) : (
        <div
          className={cn(
            "bg-gray-100",
            displayMediaSrc ? "" : "flex items-center justify-center"
          )}
          style={{ aspectRatio: previewAspectRatio }}
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayMediaSrc}
                alt="Media Preview"
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-8">
              <ImageIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">No media attached</p>
            </div>
          )}
        </div>
      )}

      {/* Post Footer */}
      <LinkedInPostFooter />

      {/* Toolbar */}
      <div className="px-3 py-2 border-t border-[--border]">
        <div className="flex items-center gap-4">
          {canCrop && (
            <button
              onClick={handleCropClick}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              disabled={isFetchingOriginal}
            >
              {isFetchingOriginal ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Crop className="h-3.5 w-3.5" />
              )}
              Crop{" "}
              {isCarousel &&
                `(${currentCarouselIndex + 1}/${mediaItems?.length})`}
            </button>
          )}

          {canEditAltText && (
            <button
              onClick={handleAltTextClick}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Alt Text
            </button>
          )}

          {!canCrop && !canEditAltText && (
            <p className="text-xs text-muted-foreground text-center italic w-full">
              LinkedIn Preview
            </p>
          )}
        </div>
      </div>

      {/* Cropper Modal */}
      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="linkedin"
          initialCrop={activeMediaForCrop?.crops?.linkedin?.croppedAreaPixels}
          initialAspectRatio={activeMediaForCrop?.crops?.linkedin?.aspectRatio}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Alt Text Modal */}
      {editableMediaItems.length > 0 && (
        <AltTextModal
          open={isAltTextModalOpen}
          onClose={() => setIsAltTextModalOpen(false)}
          mediaItems={editableMediaItems}
          initialMediaIndex={altTextInitialIndex}
        />
      )}
    </div>
  );
}

export default memo(LinkedInPreview);
