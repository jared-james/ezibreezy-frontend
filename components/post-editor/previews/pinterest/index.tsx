// components/post-editor/previews/pinterest/index.tsx

"use client";

import { memo, useState } from "react";
import { Crop, ImageIcon, Play } from "lucide-react";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";

// import { PinterestHeader } from "./pinterest-header";
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

  // Migrated to Draft Store
  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );

  // Data Hooks
  const { organizationId } = useClientData();
  const { getOriginalUrl } = useOriginalUrl(organizationId);

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

  return (
    <div className="w-full max-w-[300px] mx-auto space-y-4 transition-all duration-300">
      <div className="bg-white border border-[--border] shadow-lg rounded-[2rem] overflow-hidden">
        <div className="relative bg-gray-100 overflow-hidden group">
          {/* <PinterestHeader /> */}

          {/* Media Layer */}
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
              <div className="aspect-[2/3] w-full flex flex-col items-center justify-center text-gray-400">
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
              Pinterest Preview
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
          platform="pinterest"
          onCropSave={handleCropSave}
          getOriginalUrl={getOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(PinterestPreview);
