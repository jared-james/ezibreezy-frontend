// components/post-editor/previews/linkedin/index.tsx

"use client";

import { memo, useState } from "react";
import { ImageIcon, Crop, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { AltTextModal } from "../../modals/alt-text-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";

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
  const [isAltTextModalOpen, setIsAltTextModalOpen] = useState(false);
  const [altTextInitialIndex, setAltTextInitialIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);

  // Data Hooks
  const { organizationId } = useClientData();
  const { getOriginalUrl } = useOriginalUrl(organizationId);

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

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "linkedin", cropData, previewUrl);
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

  // Construct list for cropper modal
  const cropperMediaItems =
    mediaItems.length > 0
      ? mediaItems
      : singleMediaItem
      ? [singleMediaItem]
      : [];

  const cropperInitialIndex = isCarousel ? currentCarouselIndex : 0;

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
            >
              <Crop className="h-3.5 w-3.5" />
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
      {isCropperOpen && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={cropperMediaItems}
          initialIndex={cropperInitialIndex}
          platform="linkedin"
          onCropSave={handleCropSave}
          getOriginalUrl={getOriginalUrl}
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
