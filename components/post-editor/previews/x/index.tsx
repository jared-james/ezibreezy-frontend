// components/post-editor/previews/x/index.tsx

"use client";

import { memo, useState } from "react";
import { MessageSquare, Repeat2, ImageIcon, Crop, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

interface XPreviewProps {
  caption: string;
  mediaPreview: string[];
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  postType?: "text" | "image" | "video";
  singleMediaItem?: MediaItem;
  mediaItems?: MediaItem[]; // Added support for multiple items in cropper
}

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
        "mt-3 overflow-hidden rounded-xl border border-border bg-muted",
        images.length === 1 ? "max-h-[350px]" : "h-64 grid grid-cols-2 gap-0.5"
      )}
    >
      {images.map((src, index) => {
        const isThreeImages = images.length === 3;
        const isFirstOfThree = isThreeImages && index === 0;

        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden",
              isFirstOfThree && "row-span-2"
            )}
          >
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
                className="w-full h-full object-cover transition-opacity hover:opacity-95"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

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
        className="shrink-0 rounded-full border border-border bg-surface object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="shrink-0 rounded-full border border-border bg-muted"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

const XPostFooter = ({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: number;
}) => (
  <div className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand-primary">
    <Icon className="h-4 w-4" />
    <span className="mt-px">{value}</span>
  </div>
);

function XPreview({
  caption,
  mediaPreview,
  platformUsername,
  displayName,
  avatarUrl,
  postType = "text",
  singleMediaItem,
  mediaItems = [],
}: XPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const handle = accountName ? `@${accountName}` : "";
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const integrationId = useEditorialStore.getState().selectedAccounts["x"]?.[0];

  const croppedPreview = singleMediaItem?.croppedPreviews?.x;

  // Calculate the first media source
  const firstMediaSrc =
    postType === "video" && singleMediaItem?.mediaUrl
      ? singleMediaItem.mediaUrl
      : croppedPreview || mediaPreview[0];

  // Construct the images array ensuring the first item uses the correct source
  const mainPostImages = [firstMediaSrc, ...mediaPreview.slice(1, 4)].filter(
    Boolean
  );

  const canCrop =
    singleMediaItem?.id && postType === "image" && mediaPreview.length > 0;

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "x", cropData, previewUrl);
  };

  const handleGetOriginalUrl = async (
    item: MediaItem
  ): Promise<string | null> => {
    if (!item.id || !integrationId) return null;
    try {
      const { downloadUrl } = await getMediaViewUrl(item.id, integrationId);
      return downloadUrl;
    } catch (error) {
      console.error("Failed to fetch original URL", error);
      toast.error("Failed to load high-quality image");
      return null;
    }
  };

  // Construct list for cropper modal
  const cropperMediaItems =
    mediaItems.length > 0
      ? mediaItems
      : singleMediaItem
      ? [singleMediaItem]
      : [];

  return (
    <div className="mx-auto w-full max-w-sm border border-border rounded-lg overflow-hidden bg-surface">
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
              <span className="truncate font-bold text-foreground">
                {primaryName}
              </span>
              {handle && (
                <span className="shrink text-muted-foreground truncate">
                  {handle}
                </span>
              )}
              <span className="shrink-0 text-muted-foreground">· Now</span>
            </div>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[0.95rem] leading-normal text-foreground">
              {renderCaptionWithHashtags(caption)}
            </p>

            {mainPostImages.length > 0 ? (
              <MediaGrid images={mainPostImages} mediaType={postType} />
            ) : (
              (caption.length === 0 || caption.trim() === "") &&
              postType !== "text" && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-background p-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  No media attached.
                </div>
              )
            )}

            <div className="mt-3 flex justify-between px-2">
              <XPostFooter icon={MessageSquare} value={0} />
              <XPostFooter icon={Repeat2} value={0} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-[--border]">
        <div className="flex items-center gap-4">
          {canCrop && (
            <button
              onClick={handleCropClick}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Crop className="h-3.5 w-3.5" />
              Crop
            </button>
          )}

          {!canCrop && (
            <p className="text-xs text-muted-foreground text-center italic w-full">
              X Preview
            </p>
          )}
        </div>
      </div>

      {isCropperOpen && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={cropperMediaItems}
          initialIndex={0}
          platform="x"
          onCropSave={handleCropSave}
          getOriginalUrl={handleGetOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(XPreview);
