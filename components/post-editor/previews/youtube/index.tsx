// components/post-editor/previews/youtube/index.tsx

"use client";

import { memo, useState } from "react";
import { Crop, ImageIcon } from "lucide-react";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";
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

  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );

  const { getOriginalUrl } = useOriginalUrl();

  // Determine viewing mode based on media aspect ratio or type
  // Shorts = 9:16 aspect ratio OR explicit crop
  const cropData = singleMediaItem?.crops?.youtube;

  // If crop data exists and is vertical, default to shorts view
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

  // Standardized toolbar button class
  const btnClass =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors hover:bg-muted focus:bg-muted text-muted-foreground hover:text-foreground";

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Header - Only for Video Mode */}
        {previewMode === "video" && (
          <YouTubeHeader avatarUrl={avatarUrl} primaryName={primaryName} />
        )}

        {/* Content Area */}
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
          <div className="relative bg-surface">
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
              <div className="aspect-video w-full flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-t border-border">
          {canCrop && (
            <button
              onClick={handleCropClick}
              className={cn(btnClass)}
              title="Crop Image"
            >
              <Crop className="h-3.5 w-3.5" />
              <span>Crop</span>
            </button>
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
          getOriginalUrl={getOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(YouTubePreview);
