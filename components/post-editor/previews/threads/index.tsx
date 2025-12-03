// components/post-editor/previews/threads/index.tsx

"use client";

import { memo, useState } from "react";
import { Crop, ImageIcon } from "lucide-react";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import {
  MediaItem,
  useEditorialDraftStore,
} from "@/lib/store/editorial/draft-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";
import { cn } from "@/lib/utils";

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

  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );

  const { getOriginalUrl } = useOriginalUrl();

  const canCrop = mediaItems.some((item) => item.id && item.type === "image");

  const handleCropClick = () => {
    setIsCropperOpen(true);
  };

  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "threads", cropData, previewUrl);
  };

  // Standardized toolbar button class
  const btnClass =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors hover:bg-muted focus:bg-muted text-muted-foreground hover:text-foreground";

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Post Content */}
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-t border-border">
          {canCrop && (
            <button
              onClick={handleCropClick}
              className={cn(btnClass)}
              title="Crop Media"
            >
              <Crop className="h-3.5 w-3.5" />
              <span>Crop</span>
            </button>
          )}
        </div>
      </div>

      {isCropperOpen && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={mediaItems}
          initialIndex={0}
          platform="threads"
          onCropSave={handleCropSave}
          getOriginalUrl={getOriginalUrl}
        />
      )}
    </div>
  );
}

export default memo(ThreadsPreview);
