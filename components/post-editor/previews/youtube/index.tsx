"use client";

import { memo, useState } from "react";
import { Crop, ImageIcon } from "lucide-react";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { YouTubeHeader } from "./youtube-header";
import { YouTubeShortsView } from "./youtube-shorts-view";
import { YouTubeVideoView } from "./youtube-video-view";

interface YouTubePreviewProps {
  caption: string;
  title?: string;
  singleMediaItem: MediaItem | null;
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
}

function YouTubePreview({
  caption,
  title,
  singleMediaItem,
  platformUsername,
  displayName,
  avatarUrl,
}: YouTubePreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const integrationId =
    useEditorialStore.getState().selectedAccounts["youtube"]?.[0];

  // Determine viewing mode based on media aspect ratio or type
  // Shorts = 9:16 aspect ratio OR explicit crop
  const cropData = singleMediaItem?.crops?.youtube;
  const isShorts = cropData
    ? Math.abs(cropData.aspectRatio - 9 / 16) < 0.01
    : singleMediaItem?.type === "video"; // Default video to shorts preview? Maybe better default to landscape if not cropped.

  // Actually, standard videos are landscape. Shorts are vertical.
  // If no crop is set, we can infer from dimensions if available, but here we don't have dims easily.
  // Let's toggle view based on the aspect ratio stored in the crop data.
  // If no crop data, default to Video View (16:9) unless user selects Shorts crop.
  const previewMode =
    cropData && Math.abs(cropData.aspectRatio - 9 / 16) < 0.01
      ? "shorts"
      : "video";

  const canCrop = !!singleMediaItem?.id && singleMediaItem?.type === "image";

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "youtube", cropData, previewUrl);
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

  return (
    <div className="w-full max-w-[320px] mx-auto space-y-4 transition-all duration-300">
      <div
        className={cn(
          "bg-[--surface] border border-[--border] shadow-lg overflow-hidden transition-all",
          previewMode === "shorts"
            ? "rounded-t-[2rem] rounded-b-lg"
            : "rounded-lg"
        )}
      >
        {previewMode === "video" && (
          <YouTubeHeader avatarUrl={avatarUrl} primaryName={primaryName} />
        )}

        {previewMode === "shorts" ? (
          <div className="relative bg-black aspect-[9/16] overflow-hidden group">
            {singleMediaItem ? (
              <YouTubeShortsView
                mediaItem={singleMediaItem}
                caption={caption}
                title={title}
                avatarUrl={avatarUrl}
                primaryName={primaryName}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative bg-[--surface]">
            {singleMediaItem ? (
              <YouTubeVideoView
                mediaItem={singleMediaItem}
                caption={caption}
                title={title}
                avatarUrl={avatarUrl}
                primaryName={primaryName}
                accountName={accountName}
              />
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center text-[--muted-foreground] bg-[--muted]/30">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div className="px-3 py-2 border-t border-[--border] bg-[--surface]">
          {canCrop ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleCropClick}
                title="Crop Image"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Crop className="h-3.5 w-3.5" />
                Crop
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center italic">
              YouTube {previewMode === "shorts" ? "Shorts" : "Video"} Preview
            </p>
          )}
        </div>
      </div>

      {isCropperOpen && singleMediaItem && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={[singleMediaItem]}
          initialIndex={0}
          platform="youtube"
          onCropSave={handleCropSave}
          getOriginalUrl={handleGetOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(YouTubePreview);
