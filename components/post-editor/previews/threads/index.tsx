// components/post-editor/previews/threads/index.tsx

"use client";

import { memo, useState } from "react";
import { Crop, Loader2, Link as LinkIcon, ImageIcon } from "lucide-react";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";
import LocationSearchInput from "../../location-search-input";
import { Input } from "@/components/ui/input";

import { ThreadsHeader } from "./threads-header";
import { ThreadsCarousel } from "./threads-carousel";
import { ThreadsPostFooter } from "./threads-post-footer";

interface ThreadsPreviewProps {
  caption: string;
  mediaItems: MediaItem[];
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
        alt={primaryName}
        className="shrink-0 rounded-full border border-[--border] bg-[--surface] object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="shrink-0 rounded-full border border-[--border] bg-[--muted]"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function ThreadsPreview({
  caption,
  mediaItems = [],
  platformUsername,
  displayName,
  avatarUrl,
}: ThreadsPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);

  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const setState = useEditorialStore((state) => state.setState);

  const integrationId =
    useEditorialStore.getState().selectedAccounts["threads"]?.[0];
  const threadsTopicTag = useEditorialStore((state) => state.threadsTopicTag);
  const threadsLinkAttachment = useEditorialStore(
    (state) => state.threadsLinkAttachment
  );
  const location = useEditorialStore((state) => state.location);

  // For cropping logic, currently defaulting to the first item
  // Future enhancement: Allow selecting which item to crop in carousel
  const singleMediaItem = mediaItems[0];

  const canCrop =
    singleMediaItem?.id &&
    singleMediaItem.type === "image" &&
    mediaItems.length > 0;

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
        "threads",
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

      onCropComplete(
        { croppedAreaPixels: scaledCroppedAreaPixels, aspectRatio },
        croppedUrl
      );
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
      if (!integrationId) throw new Error("Threads account not selected.");
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
      console.error(error);
      toast.error("Could not load original image for cropping.");
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  const handleTopicTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith("#")) value = value.slice(1);
    value = value.replace(/[.&]/g, "");
    if (value.length <= 50) setState({ threadsTopicTag: value });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <div className="bg-[--surface] border border-[--border] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 flex gap-3">
          <div className="flex-shrink-0 flex flex-col items-center">
            <ProfileAvatar
              size={36}
              avatarUrl={avatarUrl}
              primaryName={primaryName}
            />
            {/* Thread line visual */}
            <div className="w-0.5 grow mt-2 bg-border rounded-full" />
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <ThreadsHeader primaryName={primaryName} />

            <div className="mt-1 text-[0.95rem] whitespace-pre-wrap leading-normal text-foreground">
              {renderCaptionWithHashtags(caption)}
            </div>

            {mediaItems.length > 0 ? (
              <ThreadsCarousel mediaItems={mediaItems} />
            ) : caption.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                No media attached.
              </div>
            ) : null}

            <ThreadsPostFooter />
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="bg-[--background] border-t border-[--border]">
          <div className="px-3 py-2">
            {canCrop ? (
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
                Crop (First Item)
              </button>
            ) : (
              <p className="text-xs text-muted-foreground text-center italic">
                Threads Preview
              </p>
            )}
          </div>

          <div className="px-3 py-2 border-t border-[--border]">
            <label
              htmlFor="topic-tag"
              className="eyebrow mb-2 flex items-center"
            >
              Topic Tag
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                #
              </span>
              <Input
                id="topic-tag"
                value={threadsTopicTag}
                onChange={handleTopicTagChange}
                placeholder="Topic (max 50 chars)"
                className="h-9 pl-7"
                maxLength={50}
              />
            </div>
          </div>

          {mediaItems.length === 0 && (
            <div className="px-3 py-2 border-t border-[--border]">
              <label
                htmlFor="link-attachment"
                className="eyebrow mb-2 flex items-center"
              >
                <LinkIcon className="mr-1.5 h-3 w-3" />
                Link Attachment
              </label>
              <Input
                id="link-attachment"
                type="url"
                value={threadsLinkAttachment}
                onChange={(e) =>
                  setState({ threadsLinkAttachment: e.target.value })
                }
                placeholder="https://example.com"
                className="h-9"
              />
            </div>
          )}

          <div className="px-3 py-2 border-t border-[--border]">
            <LocationSearchInput
              initialLocation={location}
              onLocationSelect={(newLocation) =>
                setState({ location: newLocation || { id: null, name: "" } })
              }
              integrationId={integrationId || null}
              isEnabled={true}
            />
          </div>
        </div>
      </div>

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="threads"
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(ThreadsPreview);
