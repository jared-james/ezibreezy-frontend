// components/post-editor/previews/pinterest/pinterest-footer.tsx

"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "../../render-caption";

interface PinterestFooterProps {
  title?: string;
  description: string;
  primaryName: string;
  avatarUrl: string | null;
  link?: string;
}

export function PinterestFooter({
  title,
  description,
  primaryName,
  avatarUrl,
  link,
}: PinterestFooterProps) {
  return (
    <div className="p-4 bg-white space-y-3">
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {title || "Add a title"}
        </h1>
      </div>

      <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
        {renderCaptionWithHashtags(description)}
      </p>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={primaryName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
              {primaryName.charAt(0)}
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900">
            {primaryName}
          </span>
        </div>

        <button className="px-4 py-2 bg-[#E60023] text-white text-sm font-bold rounded-full hover:bg-[#ad081b] transition-colors">
          Save
        </button>
      </div>

      {link && (
        <div className="pt-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors w-full justify-center">
            <ExternalLink className="w-4 h-4" />
            <span className="truncate max-w-[200px]">
              {link.replace(/^https?:\/\//, "").split("/")[0]}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
