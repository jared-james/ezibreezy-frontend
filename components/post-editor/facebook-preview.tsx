// components/post-editor/facebook-preview.tsx

import { memo } from "react";
import { ThumbsUp, MessageCircle, Share2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "./render-caption";

interface FacebookPreviewProps {
  caption: string;
  mediaPreview: string | null;
  mediaType?: "image" | "video" | "text";
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
        alt={`${primaryName} profile picture`}
        className="rounded-full border border-[--border] shrink-0 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border border-[--border] shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function FacebookPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
}: FacebookPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <ProfileAvatar
          size={40}
          avatarUrl={avatarUrl}
          primaryName={primaryName}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[--foreground]">
            {primaryName}
          </p>
          <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
            <span>Just now</span>
            <span>·</span>
            <span>🌐</span>
          </div>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="text-lg">···</span>
        </div>
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-sm text-[--foreground] whitespace-pre-wrap">
          {renderCaptionWithHashtags(caption)}
        </p>
      </div>

      {/* Media */}
      <div
        className={cn(
          "aspect-video bg-[--background]",
          mediaPreview ? "" : "flex items-center justify-center"
        )}
      >
        {mediaPreview ? (
          mediaType === "video" ? (
            <video
              src={mediaPreview}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={mediaPreview}
              alt="Media Preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-8">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">No media attached</p>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-[--muted-foreground]">
        <div className="flex items-center gap-1">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px]">
            👍
          </span>
          <span>0</span>
        </div>
        <div className="flex items-center gap-2">
          <span>0 comments</span>
          <span>0 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-1 border-t border-[--border] text-[--muted-foreground]">
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
          <ThumbsUp className="w-5 h-5" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[--surface-hover] rounded flex-1 justify-center text-sm">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 text-xs text-[--muted-foreground] text-center italic border-t border-[--border]">
        Facebook Preview
      </div>
    </div>
  );
}

export default memo(FacebookPreview);
