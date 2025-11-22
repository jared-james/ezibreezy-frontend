// components/post-editor/tiktok-preview.tsx

import { memo } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Music, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "./render-caption";

interface TikTokPreviewProps {
  caption: string;
  mediaPreview: string | null;
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
        className="rounded-full border-2 border-white shrink-0 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border-2 border-white shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function TikTokPreview({
  caption,
  mediaPreview,
  platformUsername,
  displayName,
  avatarUrl,
}: TikTokPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone-like container */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-[9/16] max-h-[500px]">
        {/* Video/Media area */}
        <div className="absolute inset-0">
          {mediaPreview ? (
            <img
              src={mediaPreview}
              alt="Media Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
              <ImageIcon className="w-12 h-12 mb-2" />
              <p className="text-sm">No video attached</p>
            </div>
          )}
        </div>

        {/* Right sidebar actions */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center">
            <ProfileAvatar size={44} avatarUrl={avatarUrl} primaryName={primaryName} />
            <div className="w-5 h-5 -mt-2.5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Heart className="w-7 h-7 text-white" />
            <span className="text-white text-xs">0</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="text-white text-xs">0</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Bookmark className="w-7 h-7 text-white" />
            <span className="text-white text-xs">0</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Share2 className="w-7 h-7 text-white" />
            <span className="text-white text-xs">Share</span>
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center animate-spin-slow">
            <Music className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-4 left-3 right-16 text-white">
          <p className="font-bold text-sm">@{accountName}</p>
          <p className="text-sm mt-1 line-clamp-3 whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Music className="w-3 h-3" />
            <p className="text-xs truncate">Original sound - {primaryName}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-xs text-[--muted-foreground] text-center italic">
        TikTok Preview
      </div>
    </div>
  );
}

export default memo(TikTokPreview);
