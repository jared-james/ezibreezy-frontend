// components/post-editor/previews/facebook/index.tsx

"use client";

import { memo, useState, useRef, useEffect, useMemo } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Crop,
  Link2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import {
  createCroppedPreviewUrl,
  type CropData,
  STORY_ASPECT_RATIO,
  calculateCenteredCrop,
} from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

const URL_REGEX =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;

function extractFirstUrl(text: string): string | null {
  const matches = text.match(URL_REGEX);
  if (!matches) return null;

  const validUrl = matches.find((match) => {
    if (match.startsWith("http") || match.startsWith("www.")) return true;
    const commonTlds =
      /\.(com|org|net|io|co|app|dev|me|info|biz|edu|gov|uk|ca|au|de|fr|jp|cn|br|in|ru|nl|it|es|pl|be|ch|at|se|no|dk|fi|nz|za|mx|ar|cl|sg|hk|kr|tw|my|ph|th|vn|id)\b/i;
    return commonTlds.test(match);
  });

  return validUrl || null;
}

function getDomainFromUrl(url: string): string {
  try {
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
    const urlObj = new URL(urlWithProtocol);
    return urlObj.hostname.replace(/^www\./, "").toUpperCase();
  } catch {
    return url
      .replace(/^www\./, "")
      .split("/")[0]
      .toUpperCase();
  }
}

function stripUrlFromCaption(caption: string, url: string): string {
  return caption.replace(url, "").trim();
}

interface FacebookPreviewProps {
  caption: string;
  singleMediaItem: MediaItem | null;
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  postType: "post" | "reel" | "story";
  aspectRatio?: number;
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

function FacebookPreview({
  caption,
  singleMediaItem,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  postType,
  aspectRatio = 1.91,
}: FacebookPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const integrationId =
    useEditorialStore.getState().selectedAccounts["facebook"]?.[0];

  const croppedPreview = singleMediaItem?.croppedPreviews?.facebook;

  // UPDATED: Use mediaUrl for video source if available
  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

  const canCrop = singleMediaItem?.id && mediaType === "image";
  const originalMediaSrc = singleMediaItem?.file
    ? singleMediaItem.preview
    : singleMediaItem?.originalUrlForCropping;

  const detectedUrl = useMemo(() => extractFirstUrl(caption), [caption]);
  const showLinkPreview = detectedUrl && !displayMediaSrc;

  const displayCaption = useMemo(() => {
    if (showLinkPreview && detectedUrl) {
      return stripUrlFromCaption(caption, detectedUrl);
    }
    return caption;
  }, [caption, showLinkPreview, detectedUrl]);

  const onCropComplete = (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => {
    if (singleMediaItem) {
      setCropForMedia(
        singleMediaItem.uid,
        "facebook",
        cropData,
        croppedPreviewUrl
      );
    }
  };

  const prevPostTypeRef = useRef(postType);
  useEffect(() => {
    const applyAutoCrop = async () => {
      if (!originalMediaSrc) return;

      if (prevPostTypeRef.current !== "story" && postType === "story") {
        try {
          const img = new window.Image();
          img.src = originalMediaSrc;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });

          const displayedWidth = img.naturalWidth;
          const displayedHeight = img.naturalHeight;

          const cropPixels = calculateCenteredCrop(
            displayedWidth,
            displayedHeight,
            STORY_ASPECT_RATIO
          );

          const croppedUrl = await createCroppedPreviewUrl(
            originalMediaSrc,
            cropPixels,
            displayedWidth,
            displayedHeight
          );

          const cropData: CropData = {
            croppedAreaPixels: cropPixels,
            aspectRatio: STORY_ASPECT_RATIO,
          };

          onCropComplete(cropData, croppedUrl);
        } catch (error) {
          console.error("Failed to auto-crop for story:", error);
        }
      } else if (
        prevPostTypeRef.current === "story" &&
        postType === "post" &&
        aspectRatio === STORY_ASPECT_RATIO
      ) {
        onCropComplete(undefined, "");
      }

      prevPostTypeRef.current = postType;
    };

    applyAutoCrop();
  }, [postType, aspectRatio, onCropComplete, originalMediaSrc]);

  const handleCropComplete = async (
    croppedAreaPixels: PixelCrop,
    newAspectRatio: number,
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
        aspectRatio: newAspectRatio,
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
      if (!integrationId) throw new Error("Facebook account not selected.");

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
      console.error("Failed to get download URL for cropping:", error);
      toast.error(
        "Could not load original image for cropping. Please try again."
      );
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <ProfileAvatar
          size={40}
          avatarUrl={avatarUrl}
          primaryName={primaryName}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[--foreground]">
            {primaryName}
          </p>
          <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
            <span>Just now</span>
            <span>·</span>
            <span>🌐</span>
          </div>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="text-lg">···</span>
        </div>
      </div>

      {postType !== "story" && displayCaption && (
        <div className="px-3 pb-3">
          <p className="text-sm text-[--foreground] whitespace-pre-wrap">
            {renderCaptionWithHashtags(displayCaption)}
          </p>
        </div>
      )}

      {displayMediaSrc ? (
        <div className="relative bg-[--background]">
          {mediaType === "video" ? (
            <video
              src={displayMediaSrc}
              className="w-full h-auto block"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={displayMediaSrc}
              alt="Media Preview"
              className="w-full h-auto block"
            />
          )}
        </div>
      ) : showLinkPreview && detectedUrl ? (
        <div className="border-t border-b border-[--border] bg-[--background]">
          <div className="aspect-[1.91/1] bg-[--muted] flex items-center justify-center">
            <Link2 className="w-12 h-12 text-[--muted-foreground]" />
          </div>
          <div className="p-3 bg-[--surface]">
            <p className="text-xs text-[--muted-foreground] uppercase">
              {getDomainFromUrl(detectedUrl)}
            </p>
            <p className="text-sm font-semibold text-[--foreground] mt-1 line-clamp-2">
              Link Preview
            </p>
          </div>
        </div>
      ) : null}

      {postType !== "story" && (
        <div className="flex items-center justify-between px-3 py-2 text-xs text-[--muted-foreground]">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px]">
              👍
            </span>
            <span>0</span>
          </div>
          <div className="flex items-center gap-2">
            <span>0 comments</span>
            <span>0 shares</span>
          </div>
        </div>
      )}

      {postType !== "story" && (
        <div className="flex items-center justify-around py-1 border-t border-[--border] text-[--muted-foreground]">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
            <ThumbsUp className="w-5 h-5" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      )}

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
            Facebook Preview
          </p>
        )}
      </div>

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="facebook"
          postType={postType}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(FacebookPreview);
