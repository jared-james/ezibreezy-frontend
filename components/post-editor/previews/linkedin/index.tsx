// components/post-editor/previews/linkedin/index.tsx

"use client";

import { memo, useState } from "react";
import { ImageIcon, Crop, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { AltTextModal } from "../../modals/alt-text-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import {
  MediaItem,
  useEditorialDraftStore,
} from "@/lib/store/editorial/draft-store";
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

  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );

  const { getOriginalUrl } = useOriginalUrl();

  const hasMultipleMedia = mediaItems.length > 1;
  const isCarousel = hasMultipleMedia;

  const previewAspectRatio = isCarousel ? 1 : aspectRatio;

  const currentCarouselMedia = isCarousel
    ? mediaItems[currentCarouselIndex]
    : null;

  const activeMediaForCrop = currentCarouselMedia || singleMediaItem;

  const croppedPreview = singleMediaItem?.croppedPreviews?.linkedin;

  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

  const canCrop =
    !!activeMediaForCrop?.id && activeMediaForCrop?.type === "image";

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

  const cropperMediaItems =
    mediaItems.length > 0
      ? mediaItems
      : singleMediaItem
      ? [singleMediaItem]
      : [];

  const cropperInitialIndex = isCarousel ? currentCarouselIndex : 0;

  // Standardized toolbar button class
  const btnClass =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors hover:bg-muted focus:bg-muted text-muted-foreground hover:text-foreground";

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Header */}
        <LinkedInHeader
          avatarUrl={avatarUrl}
          primaryName={primaryName}
          accountName={accountName}
        />

        {/* Caption */}
        <div className="px-3 pb-3">
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
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
                <img
                  src={displayMediaSrc}
                  alt="Media Preview"
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground text-center p-8">
                <ImageIcon className="w-8 h-8 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>
        )}

        {/* Post Footer */}
        <LinkedInPostFooter />

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
                {isCarousel &&
                  ` (${currentCarouselIndex + 1}/${mediaItems.length})`}
              </span>
            </button>
          )}

          {canEditAltText && (
            <button
              onClick={handleAltTextClick}
              className={cn(btnClass)}
              title="Edit Alt Text"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Alt Text</span>
            </button>
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
