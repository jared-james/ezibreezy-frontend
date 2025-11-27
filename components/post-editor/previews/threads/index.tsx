// components/post-editor/previews/threads/index.tsx

import { memo, useState } from "react";
import {
  Heart,
  MessageCircle,
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
import LocationSearchInput from "../../location-search-input";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from "lucide-react";

interface ThreadsPreviewProps {
  caption: string;
  mediaPreview: string[];
  mediaType?: "text" | "image" | "video";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  singleMediaItem?: MediaItem;
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

const MediaGrid = ({
  images,
  mediaType = "image",
}: {
  images: string[];
  mediaType?: "text" | "image" | "video";
}) => {
  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-xl border border-[--border] bg-[--muted]",
        images.length === 1 ? "max-h-[300px]" : "h-48 grid grid-cols-2 gap-0.5"
      )}
    >
      {images.slice(0, 4).map((src, index) => (
        <div key={index} className="relative overflow-hidden">
          {mediaType === "video" ? (
            <video
              src={src}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={src}
              alt={`Media ${index + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

function ThreadsPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  singleMediaItem,
}: ThreadsPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const setState = useEditorialStore((state) => state.setState);
  const integrationId =
    useEditorialStore.getState().selectedAccounts["threads"]?.[0];

  // Threads-specific state
  const threadsTopicTag = useEditorialStore((state) => state.threadsTopicTag);
  const threadsLinkAttachment = useEditorialStore(
    (state) => state.threadsLinkAttachment
  );
  const location = useEditorialStore((state) => state.location);

  const croppedPreview = singleMediaItem?.croppedPreviews?.threads;
  const mainPostImages = croppedPreview
    ? [croppedPreview, ...mediaPreview.slice(1, 4)]
    : mediaPreview.slice(0, 4);

  const canCrop =
    singleMediaItem?.id && mediaType === "image" && mediaPreview.length > 0;
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
      console.error("Failed to get view URL for cropping:", error);
      toast.error(
        "Could not load original image for cropping. Please try again."
      );
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  // Handlers for Threads-specific inputs
  const handleTopicTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Strip leading # if present
    if (value.startsWith("#")) {
      value = value.slice(1);
    }

    // Remove periods and ampersands
    value = value.replace(/[.&]/g, "");

    // Limit to 50 characters
    if (value.length <= 50) {
      setState({ threadsTopicTag: value });
    }
  };

  const handleLinkAttachmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ threadsLinkAttachment: e.target.value });
  };

  return (
    <div className="mx-auto w-full max-w-sm bg-[--surface] border border-[--border] rounded-lg overflow-visible">
      <div className="relative p-4">
        <div className="relative z-10 flex items-start gap-3">
          <div
            className="flex shrink-0 flex-col items-center"
            style={{ width: 40 }}
          >
            <ProfileAvatar
              size={40}
              avatarUrl={avatarUrl}
              primaryName={primaryName}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm">
              <span className="truncate font-bold text-[--foreground]">
                {primaryName}
              </span>
              <span className="shrink-0 text-[--muted-foreground]">· now</span>
            </div>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-normal text-[--foreground]">
              {renderCaptionWithHashtags(caption)}
            </p>

            {mainPostImages.length > 0 ? (
              <MediaGrid images={mainPostImages} mediaType={mediaType} />
            ) : (
              caption.length === 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-[--background] p-2 text-sm text-[--muted-foreground]">
                  <ImageIcon className="h-4 w-4" />
                  No media attached.
                </div>
              )
            )}

            <div className="mt-3 flex items-center gap-4 text-[--muted-foreground]">
              <Heart className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
              <MessageCircle className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
              <Repeat2 className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
              <Send className="h-5 w-5 cursor-pointer hover:text-[--foreground]" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-[--border]">
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
          <p className="text-xs text-[--muted-foreground] text-center italic">
            Threads Preview
          </p>
        )}
      </div>

      {/* Topic Tag Input - Always visible */}
      <div className="px-3 py-2 border-t border-[--border]">
        <label htmlFor="topic-tag" className="eyebrow mb-2 flex items-center">
          Topic Tag
        </label>
        <Input
          id="topic-tag"
          value={threadsTopicTag}
          onChange={handleTopicTagChange}
          placeholder="Enter topic (max 50 chars)"
          className="h-9"
          maxLength={50}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {threadsTopicTag.length}/50 characters • No periods or ampersands
        </p>
      </div>

      {/* Link Attachment Input - Only show when no media */}
      {mainPostImages.length === 0 && (
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
            onChange={handleLinkAttachmentChange}
            placeholder="https://example.com"
            className="h-9"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Only available for text-only posts
          </p>
        </div>
      )}

      {/* Location Search - Reuse existing component */}
      <div className="px-3 py-2 border-t border-[--border] overflow-visible">
        <LocationSearchInput
          initialLocation={location}
          onLocationSelect={(newLocation) =>
            setState({
              location: newLocation || { id: null, name: "" },
            })
          }
          integrationId={integrationId || null}
          isEnabled={true}
        />
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
