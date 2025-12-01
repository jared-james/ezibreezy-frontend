// components/post-editor/previews/pinterest/index.tsx

"use client";

import { memo, useState } from "react";
import { Crop, ImageIcon, Play, Loader2 } from "lucide-react";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";
import { cn } from "@/lib/utils";

import { PinterestFooter } from "./pinterest-footer";

interface PinterestPreviewProps {
  caption: string;
  title?: string;
  singleMediaItem: MediaItem | null;
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  link?: string;
}

function PinterestPreview({
  caption,
  title,
  singleMediaItem,
  platformUsername,
  displayName,
  avatarUrl,
  link,
}: PinterestPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );

  const { organizationId } = useClientData();
  const { getOriginalUrl, isFetching } = useOriginalUrl(organizationId);

  const croppedPreview = singleMediaItem?.croppedPreviews?.pinterest;

  const displayMediaSrc =
    croppedPreview ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);

  const canCrop = !!singleMediaItem?.id && singleMediaItem?.type === "image";

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "pinterest", cropData, previewUrl);
  };

  // Standardized toolbar button class
  const btnClass =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors hover:bg-muted focus:bg-muted text-muted-foreground hover:text-foreground";

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Main Content */}
        <div className="relative bg-gray-100 overflow-hidden group">
          <div className="relative w-full">
            {displayMediaSrc ? (
              singleMediaItem?.type === "video" ? (
                <div className="relative aspect-[9/16]">
                  <video
                    src={displayMediaSrc}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={displayMediaSrc}
                  alt="Pin Preview"
                  className="w-full h-auto object-cover min-h-[300px]"
                />
              )
            ) : (
              <div className="aspect-[2/3] w-full flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No media attached</p>
              </div>
            )}
          </div>
        </div>

        <PinterestFooter
          title={title}
          description={caption}
          primaryName={primaryName}
          avatarUrl={avatarUrl}
          link={link}
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-t border-border">
          {canCrop && (
            <button
              onClick={handleCropClick}
              disabled={isFetching}
              className={cn(btnClass)}
              title="Crop Image"
            >
              {isFetching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Crop className="h-3.5 w-3.5" />
              )}
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
          platform="pinterest"
          onCropSave={handleCropSave}
          getOriginalUrl={getOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(PinterestPreview);
