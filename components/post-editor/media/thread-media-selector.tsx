// components/post-editor/media/thread-media-selector.tsx

"use client";

import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { cn } from "@/lib/utils";
import { Film, Image as ImageIcon, Grid, Play } from "lucide-react";
import {
  PLATFORM_RULES,
  shouldShowMediaOrdering,
} from "@/lib/utils/media-validation";

interface ThreadMediaSelectorProps {
  platformId: string;
  threadIndex: number;
  selectedMediaIds: string[]; // These are UIDs
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

  const isVideo = item.type === "video";
  const videoSrc = item.mediaUrl || item.preview;

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
      {isVideo ? (
        <video
          src={videoSrc}
          className="w-full h-full object-cover pointer-events-none"
          onCanPlay={(e) => e.currentTarget.pause()}
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = Math.min(
              5 / 30,
              e.currentTarget.duration
            );
          }}
        />
      ) : (
        <>
          <img
            src={item.preview}
            alt="Media thumbnail"
            className="w-full h-full object-cover pointer-events-none"
          />
          {item.type === "video" && (
            <div className="absolute top-1 right-1 p-1 bg-black/60 rounded-full">
              <Play className="w-2 h-2 text-white fill-white" />
            </div>
          )}
        </>
      )}

      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-200",
          isSelected ? "bg-black/20" : "bg-transparent group-hover:bg-black/10"
        )}
      >
        {/* Only show ordering UI for carousel platforms with multiple selections */}
        {showOrderingUI && (
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
        )}
      </div>
    </button>
  );
};

export default function ThreadMediaSelector({
  platformId,
  threadIndex,
  selectedMediaIds = [],
}: ThreadMediaSelectorProps) {
  // Migrated to Atomic Selectors from Draft Store
  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const toggleThreadMediaSelection = useEditorialDraftStore(
    (state) => state.toggleThreadMediaSelection
  );

  const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];

  if (stagedMediaItems.length === 0 || !rules) {
    return null;
  }

  // Compute whether to show ordering UI
  const showOrderingUI = shouldShowMediaOrdering(
    platformId,
    selectedMediaIds.length
  );

  const orderedSelectedItems = selectedMediaIds
    .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
    .filter(Boolean) as MediaItem[];

  const imageCount = orderedSelectedItems.filter(
    (item) => item.type === "image"
  ).length;
  const videoCount = orderedSelectedItems.filter(
    (item) => item.type === "video"
  ).length;

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Media
        </p>
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

      <div className="grid grid-cols-6 gap-2">
        {stagedMediaItems.map((item) => (
          <MediaThumbnail
            key={item.uid}
            item={item}
            selectionIndex={selectedMediaIds.indexOf(item.uid)}
            onClick={() =>
              toggleThreadMediaSelection(platformId, threadIndex, item.uid)
            }
            showOrderingUI={showOrderingUI}
          />
        ))}
      </div>
    </div>
  );
}
