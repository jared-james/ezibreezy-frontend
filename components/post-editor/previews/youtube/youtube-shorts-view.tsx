"use client";

import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreVertical,
  Music2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/lib/store/editorial/draft-store";

interface YouTubeShortsViewProps {
  mediaItem: MediaItem;
  caption: string;
  title?: string;
  avatarUrl: string | null;
  primaryName: string;
}

export function YouTubeShortsView({
  mediaItem,
  caption,
  title,
  avatarUrl,
  primaryName,
}: YouTubeShortsViewProps) {
  const displaySrc =
    mediaItem.croppedPreviews?.youtube ||
    (mediaItem.type === "video" && mediaItem.mediaUrl
      ? mediaItem.mediaUrl
      : mediaItem.preview);

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden flex flex-col">
      {/* Media Layer */}
      <div className="absolute inset-0 z-0">
        {displaySrc ? (
          mediaItem.type === "video" ? (
            <video
              src={displaySrc}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={displaySrc}
              alt="Shorts Preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <span className="text-gray-500">No media attached</span>
          </div>
        )}
      </div>

      {/* Right Action Bar */}
      <div className="absolute right-2 bottom-12 z-20 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 transition-colors">
            <ThumbsUp className="w-6 h-6 fill-white text-white" />
          </div>
          <span className="text-xs font-medium">Like</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 transition-colors">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium">0</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium">Share</span>
        </div>

        <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 transition-colors mt-2">
          <MoreVertical className="w-6 h-6 text-white" />
        </div>

        <div className="relative mt-2">
          <div className="w-10 h-10 bg-gray-800 rounded-md border-2 border-white/20 overflow-hidden">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute bottom-0 left-0 right-16 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent pt-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-white/20">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={primaryName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs">
                {primaryName.charAt(0)}
              </div>
            )}
          </div>
          <span className="font-bold text-sm">@{primaryName}</span>
          <button className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full">
            Subscribe
          </button>
        </div>

        <div className="space-y-1 mb-2">
          <p className="text-sm font-medium line-clamp-2">
            {title || "Add a title..."}
          </p>
          <p className="text-sm opacity-90 line-clamp-1 font-light">
            {caption}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs opacity-80">
          <Music2 className="w-3 h-3" />
          <div className="overflow-hidden">
            <p className="whitespace-nowrap">Original Sound - {primaryName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
