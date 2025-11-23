// components/post-editor/linkedin-preview.tsx

import { memo } from "react";
import { ThumbsUp, MessageSquare, Repeat2, Send, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "./render-caption";

interface LinkedInPreviewProps {
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

function LinkedInPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
}: LinkedInPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-3">
        <ProfileAvatar
          size={48}
          avatarUrl={avatarUrl}
          primaryName={primaryName}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[--foreground] truncate">
            {primaryName}
          </p>
          <p className="text-xs text-[--muted-foreground] truncate">
            @{accountName}
          </p>
          <p className="text-xs text-[--muted-foreground]">Now · 🌐</p>
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
      <div className="flex items-center justify-between px-3 py-2 text-xs text-[--muted-foreground] border-b border-[--border]">
        <div className="flex items-center gap-1">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]">
            👍
          </span>
          <span>0</span>
        </div>
        <div className="flex items-center gap-2">
          <span>0 comments</span>
          <span>·</span>
          <span>0 reposts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-2 text-[--muted-foreground]">
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 hover:bg-[--surface-hover] rounded text-xs">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 text-xs text-[--muted-foreground] text-center italic border-t border-[--border]">
        LinkedIn Preview
      </div>
    </div>
  );
}

export default memo(LinkedInPreview);
