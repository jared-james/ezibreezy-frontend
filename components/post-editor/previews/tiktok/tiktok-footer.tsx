// components/post-editor/previews/tiktok/tiktok-footer.tsx

"use client";

import { Music } from "lucide-react";
import { renderCaptionWithHashtags } from "../../render-caption";

interface TikTokFooterProps {
  accountName: string;
  title?: string;
  caption: string;
  primaryName: string;
}

export function TikTokFooter({
  accountName,
  title,
  caption,
  primaryName,
}: TikTokFooterProps) {
  return (
    <div className="absolute bottom-4 left-3 right-16 text-white z-20 pointer-events-none">
      <p className="font-bold text-sm drop-shadow-md">@{accountName}</p>

      {title && (
        <p className="font-semibold text-sm mt-1 line-clamp-2 drop-shadow-md">
          {title}
        </p>
      )}

      <div className="text-sm mt-1 line-clamp-3 whitespace-pre-wrap drop-shadow-md">
        {renderCaptionWithHashtags(caption)}
      </div>

      <div className="flex items-center gap-2 mt-2 opacity-90">
        <Music className="w-3 h-3" />
        <div className="overflow-hidden w-full">
          <p className="text-xs whitespace-nowrap drop-shadow-md">
            Original sound - {primaryName}
          </p>
        </div>
      </div>
    </div>
  );
}
