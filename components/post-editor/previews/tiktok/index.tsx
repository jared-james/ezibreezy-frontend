// components/post-editor/previews/tiktok/index.tsx

"use client";

import { memo, useState, useRef } from "react";
import {
  ImageIcon,
  Crop,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { TikTokVideoOptions } from "./tiktok-video-options";
import { TikTokSidebar } from "./tiktok-sidebar";
import { TikTokFooter } from "./tiktok-footer";
import { TikTokCarousel } from "./tiktok-carousel";
import { type CropData } from "@/lib/utils/crop-utils";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";
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
  const [videoDuration, setVideoDuration] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );
  const setDraftState = useEditorialDraftStore((state) => state.setDraftState);
  const tiktokVideoCoverTimestamp = useEditorialDraftStore(
    (state) => state.tiktokVideoCoverTimestamp
  );

  const { getOriginalUrl } = useOriginalUrl();

  const isCarousel = mediaItems && mediaItems.length > 1;

  const handleCarouselNav = (direction: "prev" | "next") => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      const newIndex =
        direction === "prev"
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

  const canCrop = isCarousel
    ? mediaItems.some((item) => item.type === "image")
    : singleMediaItem?.type === "image";

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "tiktok", cropData, previewUrl);
  };

  const cropperMediaItems =
    mediaItems.length > 0
      ? mediaItems
      : singleMediaItem
      ? [singleMediaItem]
      : [];

  const cropperInitialIndex = isCarousel ? carouselIndex : 0;

  // Standardized toolbar button class
  const btnClass =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors hover:bg-muted focus:bg-muted text-muted-foreground hover:text-foreground";

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Main Content Layer - Vertical Ratio */}
        <div className="relative bg-black aspect-[9/16] overflow-hidden group">
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

          {/* Carousel Navigation Arrows */}
          {isCarousel && (
            <>
              <button
                onClick={() => handleCarouselNav("prev")}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all",
                  carouselIndex === 0 && "invisible"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleCarouselNav("next")}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all",
                  carouselIndex === (mediaItems?.length ?? 1) - 1 && "invisible"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Carousel Pagination Dots */}
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-t border-border">
          {canCrop && (
            <button
              onClick={handleCropClick}
              className={cn(btnClass)}
              title="Crop Media"
            >
              <Crop className="h-3.5 w-3.5" />
              <span>
                Crop
                {isCarousel && ` (${carouselIndex + 1}/${mediaItems?.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {!isCarousel && mediaType === "video" && displayMediaSrc && (
        <TikTokVideoOptions
          displayMediaSrc={displayMediaSrc}
          videoCoverTimestamp={tiktokVideoCoverTimestamp}
          onVideoCoverTimestampChange={(timestamp) =>
            setDraftState({ tiktokVideoCoverTimestamp: timestamp })
          }
          videoDuration={videoDuration || 0}
        />
      )}

      {isCropperOpen && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={cropperMediaItems}
          initialIndex={cropperInitialIndex}
          platform="tiktok"
          onCropSave={handleCropSave}
          getOriginalUrl={getOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(TikTokPreview);
