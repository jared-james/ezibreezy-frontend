// components/post-editor/previews/tiktok/tiktok-sidebar.tsx

"use client";

import { Heart, MessageCircle, Bookmark, Share2, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface TikTokSidebarProps {
  avatarUrl: string | null;
  primaryName: string;
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
      className={cn("rounded-full bg-[--muted] border-2 border-white shrink-0")}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

export function TikTokSidebar({ avatarUrl, primaryName }: TikTokSidebarProps) {
  return (
    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 z-20">
      <div className="flex flex-col items-center">
        <ProfileAvatar
          size={40}
          avatarUrl={avatarUrl}
          primaryName={primaryName}
        />
        <div className="w-5 h-5 -mt-2.5 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">+</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <Heart className="w-6 h-6 text-white drop-shadow-md" />
        <span className="text-white text-xs font-medium drop-shadow-md">0</span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <MessageCircle className="w-6 h-6 text-white drop-shadow-md" />
        <span className="text-white text-xs font-medium drop-shadow-md">0</span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <Bookmark className="w-6 h-6 text-white drop-shadow-md" />
        <span className="text-white text-xs font-medium drop-shadow-md">0</span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <Share2 className="w-6 h-6 text-white drop-shadow-md" />
        <span className="text-white text-xs font-medium drop-shadow-md">
          Share
        </span>
      </div>

      <div className="w-9 h-9 rounded-full border-2 border-white/30 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center animate-spin-slow">
        <Music className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}
