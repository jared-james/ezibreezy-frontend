// components/post-editor/media/platform-media-selector.tsx

"use client";

import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { cn } from "@/lib/utils";
import { Film, Image as ImageIcon, Grid } from "lucide-react";
import { PLATFORM_RULES, shouldShowMediaOrdering } from "@/lib/utils/media-validation";

interface PlatformMediaSelectorProps {
  platformId: string;
}

interface MediaThumbnailProps {
  item: MediaItem;
  selectionIndex: number; // -1 if not selected, 0+ if selected
  onClick: () => void;
  showOrderingUI: boolean;
}

const MediaThumbnail = ({
  item,
  selectionIndex,
  onClick,
  showOrderingUI,
}: MediaThumbnailProps) => {
  const isSelected = selectionIndex > -1;
  const isCover = selectionIndex === 0;

  return (
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

      {/* Overlay - lighter now to see image better */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-200",
          isSelected ? "bg-black/20" : "bg-transparent group-hover:bg-black/10"
        )}
      >
        {/* Only show ordering UI for carousel platforms with multiple selections */}
        {showOrderingUI && (
          <>
            {/* Number Badge - Bottom Left */}
            <div className="absolute bottom-1.5 left-1.5 z-10">
              {isSelected ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white font-bold text-xs shadow-md ring-1 ring-white/30">
                  {selectionIndex + 1}
                </div>
              ) : (
                // Empty ring on hover to indicate clickable area
                <div className="w-6 h-6 rounded-full border-2 border-white/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>

            {/* Cover Label - Top Left (keeps center clear) */}
            {isSelected && isCover && (
              <div className="absolute top-1.5 left-1.5 z-10">
                <span className="text-[9px] uppercase font-bold text-white tracking-wider bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 shadow-sm">
                  Cover
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </button>
  );
};

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

  // Compute whether to show ordering UI
  const showOrderingUI = shouldShowMediaOrdering(platformId, selectedUids.length);

  const orderedSelectedItems = selectedUids
    .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
    .filter(Boolean) as MediaItem[];

  const imageCount = orderedSelectedItems.filter(
    (item) => item.type === "image"
  ).length;
  const videoCount = orderedSelectedItems.filter(
    (item) => item.type === "video"
  ).length;

  let ruleMessage = "";
  if (rules.allowMixedMedia) {
    const totalLimit = rules.maxImages;
    // Only mention carousel cover for platforms that support it
    if (rules.supportsCarousel) {
      ruleMessage = `Select up to ${totalLimit} items. #1 is the carousel cover.`;
    } else {
      ruleMessage = `Select up to ${totalLimit} items.`;
    }
  } else if (rules.maxVideos > 0 && rules.maxImages === 0) {
    ruleMessage = `Select up to ${rules.maxVideos} video.`;
  } else if (!rules.allowMixedMedia) {
    ruleMessage = `Select up to ${rules.maxImages} photos OR up to ${rules.maxVideos} videos.`;
  }

  return (
    <div className="space-y-4 pt-4 border-t border-border">
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

      <div className="grid grid-cols-5 gap-2">
        {stagedMediaItems.map((item) => (
          <MediaThumbnail
            key={item.uid}
            item={item}
            selectionIndex={selectedUids.indexOf(item.uid)}
            onClick={() => togglePlatformMediaSelection(platformId, item.uid)}
            showOrderingUI={showOrderingUI}
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
