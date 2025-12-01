// components/post-editor/previews/youtube/youtube-video-view.tsx

"use client";

import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial/draft-store";
import { renderCaptionWithHashtags } from "../../render-caption";

interface YouTubeVideoViewProps {
  mediaItem: MediaItem;
  caption: string;
  title?: string;
  avatarUrl: string | null;
  primaryName: string;
  accountName: string;
}

export function YouTubeVideoView({
  mediaItem,
  caption,
  title,
  avatarUrl,
  primaryName,
  accountName,
}: YouTubeVideoViewProps) {
  const displaySrc =
    mediaItem.croppedPreviews?.youtube ||
    (mediaItem.type === "video" && mediaItem.mediaUrl
      ? mediaItem.mediaUrl
      : mediaItem.preview);

  return (
    <div className="w-full bg-[--surface] flex flex-col">
      {/* Video Player Area */}
      <div className="w-full aspect-video bg-black relative">
        {displaySrc ? (
          mediaItem.type === "video" ? (
            <video
              src={displaySrc}
              className="w-full h-full object-contain"
              muted
              controls
              playsInline
            />
          ) : (
            <img
              src={displaySrc}
              alt="Video Preview"
              className="w-full h-full object-contain"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No media
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3 space-y-3">
        <h1 className="text-base font-bold leading-tight text-[--foreground] line-clamp-2">
          {title || "Add a title to your video..."}
        </h1>

        {/* Channel & Subscribe Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[--muted] overflow-hidden border border-[--border] shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={primaryName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[--muted-foreground]">
                  {primaryName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[--foreground] leading-none">
                {primaryName}
              </span>
              <span className="text-xs text-[--muted-foreground] mt-0.5">
                1.2K subscribers
              </span>
            </div>
          </div>

          <button className="bg-[--foreground] text-[--background] text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
            Subscribe
          </button>
        </div>

        {/* Caption / Description (Simplified) */}
        {caption && (
          <div className="bg-[--muted]/30 rounded-lg p-2.5">
            <p className="whitespace-pre-wrap text-[--foreground] line-clamp-3 text-xs leading-relaxed">
              {renderCaptionWithHashtags(caption)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
