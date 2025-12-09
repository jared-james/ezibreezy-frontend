"use client";

import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/ui/social-icon";

interface YouTubeHeaderProps {
  avatarUrl: string | null;
  primaryName: string;
}

export function YouTubeHeader({ avatarUrl, primaryName }: YouTubeHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-[--border] bg-[--surface]">
      <div className="flex items-center gap-2">
        <SocialIcon network="youtube" style={{ height: "24px", width: "24px" }} />
        <span className="font-bold text-sm tracking-tight">YouTube</span>
      </div>

      <div className="flex items-center gap-2">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={primaryName}
            className="w-6 h-6 rounded-full object-cover border border-[--border]"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[--muted] border border-[--border]" />
        )}
      </div>
    </div>
  );
}
