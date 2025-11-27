// components/post-editor/previews/tiktok/index.tsx

"use client";

import { memo, useState, useRef } from "react";
import { ImageIcon, Crop, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { TikTokVideoOptions } from "./tiktok-video-options";
import { TikTokSidebar } from "./tiktok-sidebar";
import { TikTokFooter } from "./tiktok-footer";
import { TikTokCarousel } from "./tiktok-carousel";
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TikTokPreviewProps {
  caption: string;
  title?: string;
  singleMediaItem: MediaItem | null;
  mediaItems?: MediaItem[];
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
}

function TikTokPreview({
  caption,
  title,
  singleMediaItem,
  mediaItems = [],
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const setState = useEditorialStore((state) => state.setState);
  const tiktokVideoCoverTimestamp = useEditorialStore(
    (state) => state.tiktokVideoCoverTimestamp
  );
  const integrationId =
    useEditorialStore.getState().selectedAccounts["tiktok"]?.[0];

  const isCarousel = mediaItems && mediaItems.length > 1;

  const handleCarouselNav = (direction: 'prev' | 'next') => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      const newIndex = direction === 'prev'
        ? Math.max(0, carouselIndex - 1)
        : Math.min((mediaItems?.length ?? 1) - 1, carouselIndex + 1);

      carouselRef.current.scrollTo({
        left: width * newIndex,
        behavior: "smooth",
      });
    }
  };

  const croppedPreview = singleMediaItem?.croppedPreviews?.tiktok;

  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

  // Get the active media item for cropping (current carousel item or single item)
  const activeMediaForCrop = isCarousel
    ? mediaItems?.[carouselIndex]
    : singleMediaItem;

  const canCrop = !!activeMediaForCrop?.id && activeMediaForCrop?.type === "image";
  const originalMediaSrc = activeMediaForCrop?.file
    ? activeMediaForCrop.preview
    : activeMediaForCrop?.originalUrlForCropping;

  const onCropComplete = (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => {
    if (activeMediaForCrop) {
      setCropForMedia(
        activeMediaForCrop.uid,
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
    if (!canCrop || !activeMediaForCrop || !activeMediaForCrop.id) return;

    if (activeMediaForCrop.originalUrlForCropping) {
      setIsCropperOpen(true);
      return;
    }

    setIsFetchingOriginal(true);
    try {
      if (!integrationId) throw new Error("TikTok account not selected.");
      const { downloadUrl } = await getMediaViewUrl(
        activeMediaForCrop.id,
        integrationId
      );

      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === activeMediaForCrop.uid
          ? { ...item, originalUrlForCropping: downloadUrl }
          : item
      );
      useEditorialStore.getState().setStagedMediaItems(updatedItems);
      setIsCropperOpen(true);
    } catch (error) {
      console.error(error);
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
        <div className="relative bg-black aspect-[9/16] overflow-hidden group">
          {/* Main Content Layer */}
          <div className="absolute inset-0 z-0">
            {isCarousel ? (
              <TikTokCarousel
                mediaItems={mediaItems}
                onIndexChange={setCarouselIndex}
                containerRef={carouselRef}
              />
            ) : displayMediaSrc ? (
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
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <img
                    src={displayMediaSrc}
                    alt="Media Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>

          {/* UI Overlays */}
          <TikTokSidebar avatarUrl={avatarUrl} primaryName={primaryName} />

          <TikTokFooter
            accountName={accountName}
            primaryName={primaryName}
            caption={caption}
            title={title}
          />

          {/* Carousel Navigation Arrows - Only show for carousel */}
          {isCarousel && (
            <>
              <button
                onClick={() => handleCarouselNav('prev')}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all",
                  carouselIndex === 0 && "invisible"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleCarouselNav('next')}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all",
                  carouselIndex === (mediaItems?.length ?? 1) - 1 && "invisible"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Carousel Pagination Dots - Only show for carousel */}
          {isCarousel && (
            <div className="absolute bottom-20 left-0 right-0 z-50 flex items-center justify-center gap-2 pointer-events-none">
              {mediaItems.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    idx === carouselIndex
                      ? "w-2.5 h-2.5 bg-white shadow-lg"
                      : "w-2 h-2 bg-white/70 shadow-md"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
                Crop {isCarousel && `(${carouselIndex + 1}/${mediaItems?.length})`}
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center italic">
              TikTok Preview
            </p>
          )}
        </div>
      </div>

      {!isCarousel && mediaType === "video" && displayMediaSrc && (
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
