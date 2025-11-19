// app/(app)/editorial/components/instagram-preview.tsx

import { Heart, MessageCircle, Send, Bookmark, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface InstagramPreviewProps {
  caption: string;
  mediaPreview: string | null;
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  collaborators: string;
  location: string;
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
      <Image
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        width={size}
        height={size}
        className="rounded-full border border-[--border] shrink-0 object-cover"
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

export default function InstagramPreview({
  caption,
  mediaPreview,
  platformUsername,
  displayName,
  avatarUrl,
  collaborators,
  location,
}: InstagramPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto">
      <div className="flex items-center justify-between p-3 border-b border-[--border]">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            size={32}
            avatarUrl={avatarUrl}
            primaryName={primaryName}
          />
          <div>
            <span className="font-semibold text-sm text-[--foreground]">
              {primaryName}
            </span>
            {location && (
              <p className="text-xs text-[--muted-foreground] leading-none">
                {location}
              </p>
            )}
          </div>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="font-serif text-sm">...</span>
        </div>
      </div>

      <div
        className={cn(
          "aspect-square bg-[--background]",
          mediaPreview ? "" : "flex items-center justify-center"
        )}
      >
        {mediaPreview ? (
          <img // NOTE: Keeping <img> for media preview as it's a dynamic Blob URL or Data URL
            src={mediaPreview}
            alt="Media Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-12">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p>No Image/Video Attached</p>
          </div>
        )}
      </div>

      <div className="flex justify-between p-3">
        <div className="flex items-center gap-4 text-[--muted-foreground]">
          <Heart className="size-6 hover:text-[--foreground] cursor-pointer" />
          <MessageCircle className="size-6 hover:text-[--foreground] cursor-pointer" />
          <Send className="size-6 hover:text-[--foreground] cursor-pointer" />
        </div>
        <Bookmark className="size-6 text-[--muted-foreground] hover:text-[--foreground] cursor-pointer" />
      </div>

      <div className="px-3 pb-4 space-y-2">
        <p className="text-xs font-semibold text-[--foreground]">0 likes</p>

        <div className="text-sm">
          <span className="font-semibold mr-1">{primaryName}</span>
          <span className="whitespace-pre-wrap">{caption}</span>
        </div>

        {collaborators && (
          <p className="text-xs text-[--brand-primary]">
            With <span className="font-semibold">{collaborators}</span>
          </p>
        )}

        <p className="text-xs text-[--muted-foreground]">View all 0 comments</p>
        <p className="text-[0.65rem] uppercase text-[--muted-foreground]">
          Now
        </p>
      </div>

      <div className="p-3 text-xs text-[--muted-foreground] text-center italic border-t border-[--border]">
        Instagram Preview
      </div>
    </div>
  );
}
