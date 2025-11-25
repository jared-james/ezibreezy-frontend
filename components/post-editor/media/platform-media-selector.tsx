// components/post-editor/platform-media-selector.tsx

"use client";

import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { cn } from "@/lib/utils";
import { CheckCircle, Film, Image as ImageIcon, Grid } from "lucide-react";
import { PLATFORM_RULES } from "@/lib/utils/media-validation";

interface PlatformMediaSelectorProps {
  platformId: string;
}

const MediaThumbnail = ({
  item,
  isSelected,
  onClick,
}: {
  item: MediaItem;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "relative group aspect-square rounded-md overflow-hidden border-2 transition-all duration-200",
      isSelected
        ? "border-brand-primary ring-2 ring-brand-primary ring-offset-2 ring-offset-surface"
        : "border-border hover:border-brand-primary/50"
    )}
  >
    {item.type === "video" ? (
      <video
        src={item.preview}
        className="w-full h-full object-cover pointer-events-none"
        onCanPlay={(e) => e.currentTarget.pause()}
      />
    ) : (
      <img
        src={item.preview}
        alt="Media thumbnail"
        className="w-full h-full object-cover pointer-events-none"
      />
    )}
    <div
      className={cn(
        "absolute inset-0 bg-black/40 transition-opacity",
        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
    >
      {isSelected && (
        <CheckCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white" />
      )}
    </div>
  </button>
);

export default function PlatformMediaSelector({
  platformId,
}: PlatformMediaSelectorProps) {
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);
  const platformMediaSelections = useEditorialStore(
    (state) => state.platformMediaSelections
  );
  const togglePlatformMediaSelection = useEditorialStore(
    (state) => state.togglePlatformMediaSelection
  );

  const selectedUids = platformMediaSelections[platformId] || [];
  const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];

  if (stagedMediaItems.length === 0 || !rules) {
    return null;
  }

  const selectedItems = selectedUids
    .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
    .filter(Boolean) as MediaItem[];

  const imageCount = selectedItems.filter(
    (item) => item.type === "image"
  ).length;
  const videoCount = selectedItems.filter(
    (item) => item.type === "video"
  ).length;

  let ruleMessage = "";
  if (rules.allowMixedMedia) {
    const totalLimit = rules.maxImages; // In mixed media cases, maxImages serves as the total limit
    ruleMessage = `Select up to ${totalLimit} total items.`;
  } else if (rules.maxVideos > 0 && rules.maxImages === 0) {
    ruleMessage = `Select up to ${rules.maxVideos} video.`;
  } else if (!rules.allowMixedMedia) {
    ruleMessage = `Select up to ${rules.maxImages} photos OR up to ${rules.maxVideos} videos.`;
  }

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-xs">Media for {rules.name}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {rules.allowMixedMedia ? (
            <div className="flex items-center gap-1.5">
              <Grid className="h-3 w-3" />
              <span>
                {imageCount + videoCount} / {rules.maxImages}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <ImageIcon className="h-3 w-3" />
                <span>
                  {imageCount} / {rules.maxImages}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Film className="h-3 w-3" />
                <span>
                  {videoCount} / {rules.maxVideos}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {stagedMediaItems.map((item) => (
          <MediaThumbnail
            key={item.uid}
            item={item}
            isSelected={selectedUids.includes(item.uid)}
            onClick={() => togglePlatformMediaSelection(platformId, item.uid)}
          />
        ))}
      </div>
      {ruleMessage && (
        <p className="text-center text-xs text-muted-foreground pt-1">
          {ruleMessage}
        </p>
      )}
    </div>
  );
}
