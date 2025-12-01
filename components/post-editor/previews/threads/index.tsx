// components/post-editor/previews/threads/index.tsx

"use client";

import { memo, useState } from "react";
import { Crop, Link as LinkIcon, ImageIcon } from "lucide-react";
import { renderCaptionWithHashtags } from "../../render-caption";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { type CropData } from "@/lib/utils/crop-utils";
import { MediaItem, useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";
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

  const setCropForMedia = useEditorialDraftStore((state) => state.setCropForMedia);
  const setPublishingState = usePublishingStore((state) => state.setPublishingState);
  const selectedAccounts = usePublishingStore((state) => state.selectedAccounts);
  const integrationId = selectedAccounts["threads"]?.[0];
  const threadsTopicTag = usePublishingStore((state) => state.threadsTopicTag);
  const threadsLinkAttachment = usePublishingStore(
    (state) => state.threadsLinkAttachment
  );
  const location = usePublishingStore((state) => state.location);

  // Data Hooks
  const { organizationId } = useClientData();
  const { getOriginalUrl } = useOriginalUrl(organizationId);

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

  const handleTopicTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith("#")) value = value.slice(1);
    value = value.replace(/[.&]/g, "");
    if (value.length <= 50) setPublishingState({ threadsTopicTag: value });
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
              >
                <Crop className="h-3.5 w-3.5" />
                Crop
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
                  setPublishingState({ threadsLinkAttachment: e.target.value })
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
                setPublishingState({ location: newLocation || { id: null, name: "" } })
              }
              integrationId={integrationId || null}
              isEnabled={true}
            />
          </div>
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
