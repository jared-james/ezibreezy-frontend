"use client";

import { cn } from "@/lib/utils";
import { Youtube } from "lucide-react";

interface YouTubeHeaderProps {
  avatarUrl: string | null;
  primaryName: string;
}

export function YouTubeHeader({ avatarUrl, primaryName }: YouTubeHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-[--border] bg-[--surface]">
      <div className="flex items-center gap-2">
        <Youtube className="w-6 h-6 text-red-600" />
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
