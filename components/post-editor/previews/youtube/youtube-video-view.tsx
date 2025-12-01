"use client";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
} from "lucide-react";
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
      <div className="p-3">
        <h1 className="text-lg font-bold leading-tight text-[--foreground] mb-2 line-clamp-2">
          {title || "Add a title to your video..."}
        </h1>

        <div className="flex items-center justify-between pb-3 border-b border-[--border]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[--muted] overflow-hidden border border-[--border]">
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
            <div>
              <p className="text-sm font-semibold text-[--foreground] leading-none">
                {primaryName}
              </p>
              <p className="text-xs text-[--muted-foreground]">
                1.2K subscribers
              </p>
            </div>
            <button className="ml-2 bg-[--foreground] text-[--background] text-xs font-medium px-3 py-1.5 rounded-full">
              Subscribe
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <div className="flex items-center bg-[--muted]/50 rounded-full h-8">
            <button className="flex items-center gap-1.5 pl-3 pr-2 h-full hover:bg-[--muted] rounded-l-full border-r border-[--border]">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs font-medium">Like</span>
            </button>
            <button className="flex items-center px-3 h-full hover:bg-[--muted] rounded-r-full">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3 h-8 bg-[--muted]/50 hover:bg-[--muted] rounded-full whitespace-nowrap">
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">Share</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 h-8 bg-[--muted]/50 hover:bg-[--muted] rounded-full whitespace-nowrap">
            <Download className="w-4 h-4" />
            <span className="text-xs font-medium">Download</span>
          </button>

          <button className="flex items-center justify-center w-8 h-8 bg-[--muted]/50 hover:bg-[--muted] rounded-full shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Description Box */}
        <div className="bg-[--muted]/30 rounded-lg p-3 text-sm">
          <div className="flex gap-2 font-bold text-xs mb-1">
            <span>0 views</span>
            <span>Just now</span>
          </div>
          <p className="whitespace-pre-wrap text-[--foreground] line-clamp-3 text-xs leading-relaxed">
            {renderCaptionWithHashtags(caption)}
          </p>
        </div>
      </div>
    </div>
  );
}
