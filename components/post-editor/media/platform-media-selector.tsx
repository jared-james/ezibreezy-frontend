"use client";

import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { cn } from "@/lib/utils";
import {
  Film,
  Image as ImageIcon,
  Grid,
  Play,
  AlertCircle,
} from "lucide-react";
import {
  PLATFORM_RULES,
  shouldShowMediaOrdering,
} from "@/lib/utils/media-validation";

interface PlatformMediaSelectorProps {
  platformId: string;
  mediaErrors?: Record<string, string[]>;
}

interface MediaThumbnailProps {
  item: MediaItem;
  selectionIndex: number;
  onClick: () => void;
  showOrderingUI: boolean;
  errors?: string[];
}

const MediaThumbnail = ({
  item,
  selectionIndex,
  onClick,
  showOrderingUI,
  errors,
}: MediaThumbnailProps) => {
  const isSelected = selectionIndex > -1;
  const isCover = selectionIndex === 0;
  const hasError = errors && errors.length > 0;

  const isVideo = item.type === "video";
  const videoSrc = item.mediaUrl || item.preview;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative group aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 w-full",
          isSelected && hasError
            ? "border-error ring-2 ring-error ring-offset-2 ring-offset-surface"
            : isSelected
            ? "border-brand-primary ring-2 ring-brand-primary ring-offset-2 ring-offset-surface"
            : "border-border hover:border-brand-primary/50"
        )}
      >
        {isVideo ? (
          <video
            src={videoSrc}
            className="w-full h-full object-cover pointer-events-none"
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              e.currentTarget.currentTime = Math.min(
                5 / 30,
                e.currentTarget.duration
              );
            }}
            onCanPlay={(e) => e.currentTarget.pause()}
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

        <div
          className={cn(
            "absolute inset-0 transition-all duration-200",
            isSelected
              ? "bg-black/20"
              : "bg-transparent group-hover:bg-black/10"
          )}
        >
          {showOrderingUI && !hasError && (
            <>
              <div className="absolute bottom-1.5 left-1.5 z-10">
                {isSelected ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white font-bold text-xs shadow-md ring-1 ring-white/30">
                    {selectionIndex + 1}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-white/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {isSelected && isCover && (
                <div className="absolute top-1.5 left-1.5 z-10">
                  <span className="text-[9px] uppercase font-bold text-white tracking-wider bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 shadow-sm">
                    Cover
                  </span>
                </div>
              )}
            </>
          )}

          {isSelected && hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <AlertCircle className="w-8 h-8 text-error drop-shadow-md" />
            </div>
          )}
        </div>
      </button>

      {isSelected && hasError && (
        <p className="text-[10px] font-medium text-error leading-tight animate-in slide-in-from-top-1 text-center">
          {errors[0]}
        </p>
      )}
    </div>
  );
};

export default function PlatformMediaSelector({
  platformId,
  mediaErrors = {},
}: PlatformMediaSelectorProps) {
  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const platformMediaSelections = useEditorialDraftStore(
    (state) => state.platformMediaSelections
  );
  const togglePlatformMediaSelection = useEditorialDraftStore(
    (state) => state.togglePlatformMediaSelection
  );

  const selectedUids = platformMediaSelections[platformId] || [];
  const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];

  if (stagedMediaItems.length === 0 || !rules) {
    return null;
  }

  const showOrderingUI = shouldShowMediaOrdering(
    platformId,
    selectedUids.length
  );

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

      {/* INCREASED COLS FROM 5 TO 6 HERE */}
      <div className="grid grid-cols-6 gap-x-2 gap-y-4">
        {stagedMediaItems.map((item) => (
          <MediaThumbnail
            key={item.uid}
            item={item}
            selectionIndex={selectedUids.indexOf(item.uid)}
            onClick={() => togglePlatformMediaSelection(platformId, item.uid)}
            showOrderingUI={showOrderingUI}
            errors={mediaErrors[item.uid]}
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
