// components/post-editor/previews/facebook/index.tsx

"use client";

import { memo, useState, useMemo } from "react";
import { Crop, Link2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

// Sub-components
import { FacebookHeader } from "./facebook-header";
import { FacebookPostFooter } from "./facebook-post-footer";
import { FacebookStoryView } from "./facebook-story-view";
import { FacebookMediaGrid } from "./facebook-media-grid";

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
  mediaItems?: MediaItem[];
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  postType: "post" | "reel" | "story";
  aspectRatio?: number;
}

function FacebookPreview({
  caption,
  singleMediaItem,
  mediaItems = [],
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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const integrationId =
    useEditorialStore.getState().selectedAccounts["facebook"]?.[0];

  const isStory = postType === "story";

  // Determine if we have multiple media items
  const hasMultipleMedia = mediaItems.length > 1;

  // Determine the active media item for cropping context
  const activeMediaForCrop =
    mediaItems.length > 0 ? mediaItems[currentCarouselIndex] : singleMediaItem;

  const croppedPreview = singleMediaItem?.croppedPreviews?.facebook;

  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

  const canCrop =
    !!activeMediaForCrop?.id && activeMediaForCrop?.type === "image";

  const detectedUrl = useMemo(() => extractFirstUrl(caption), [caption]);
  const showLinkPreview = detectedUrl && !displayMediaSrc && !hasMultipleMedia;

  const displayCaption = useMemo(() => {
    if (showLinkPreview && detectedUrl) {
      return stripUrlFromCaption(caption, detectedUrl);
    }
    return caption;
  }, [caption, showLinkPreview, detectedUrl]);

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "facebook", cropData, previewUrl);
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

  const cropperInitialIndex = hasMultipleMedia ? currentCarouselIndex : 0;

  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto shadow-lg overflow-hidden transition-all duration-300",
        isStory
          ? "rounded-t-[1rem] rounded-b-lg border border-[--border] bg-white"
          : "rounded-lg border border-[--border] bg-[--surface]"
      )}
    >
      {isStory ? (
        // Facebook Story View
        <div className="relative aspect-[9/16] overflow-hidden group border-b border-[--border]">
          <FacebookStoryView
            mediaItems={
              mediaItems.length > 0
                ? mediaItems
                : singleMediaItem
                ? [singleMediaItem]
                : []
            }
            avatarUrl={avatarUrl}
            primaryName={primaryName}
            onIndexChange={setCurrentCarouselIndex}
          />
        </div>
      ) : (
        // Facebook Feed Post View
        <>
          <FacebookHeader avatarUrl={avatarUrl} primaryName={primaryName} />

          {displayCaption && (
            <div className="px-3 pb-3">
              <p className="text-sm text-[--foreground] whitespace-pre-wrap">
                {renderCaptionWithHashtags(displayCaption)}
              </p>
            </div>
          )}

          {hasMultipleMedia ? (
            // Use MediaGrid for multiple items in Feed
            <FacebookMediaGrid
              mediaItems={mediaItems}
              selectedIndex={currentCarouselIndex}
              onSelect={setCurrentCarouselIndex}
            />
          ) : displayMediaSrc ? (
            // Single Item View
            <div className="relative bg-gray-100">
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
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayMediaSrc}
                  alt="Media Preview"
                  className="w-full h-auto block"
                />
              )}
            </div>
          ) : showLinkPreview && detectedUrl ? (
            // Link Preview
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

          <FacebookPostFooter />
        </>
      )}

      {/* Toolbar */}
      <div className="px-3 py-2 border-t border-[--border] bg-[--surface]">
        {canCrop ? (
          <button
            onClick={handleCropClick}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Crop className="h-3.5 w-3.5" />
            Crop{" "}
            {(hasMultipleMedia || (isStory && mediaItems.length > 1)) &&
              `(${currentCarouselIndex + 1}/${Math.max(mediaItems.length, 1)})`}
          </button>
        ) : (
          <p className="text-xs text-muted-foreground text-center italic">
            Facebook Preview
          </p>
        )}
      </div>

      {/* Cropper Modal */}
      {isCropperOpen && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={cropperMediaItems}
          initialIndex={cropperInitialIndex}
          platform="facebook"
          postType={postType}
          onCropSave={handleCropSave}
          getOriginalUrl={handleGetOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(FacebookPreview);
