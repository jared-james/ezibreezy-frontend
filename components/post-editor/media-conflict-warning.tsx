// components/post-editor/media-conflict-warning.tsx

"use client";

import { AlertCircle, ImageIcon, Video } from "lucide-react";
import { MediaConflict } from "@/lib/utils/media-validation";

interface MediaConflictWarningProps {
  conflicts: MediaConflict[];
  onKeepPhotos: (platformId: string) => void;
  onKeepVideo: (platformId: string) => void;
}

export default function MediaConflictWarning({
  conflicts,
  onKeepPhotos,
  onKeepVideo,
}: MediaConflictWarningProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="space-y-2">
      {conflicts.map((conflict) => (
        <div
          key={conflict.platform}
          className="border-2 border-red-500/50 bg-red-50 dark:bg-red-950/20 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Media Conflict for {conflict.platformName}
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                {conflict.message}
              </p>

              {conflict.issue === "mixed_media" && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => onKeepPhotos(conflict.platform)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-red-500 text-red-900 dark:text-red-100 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-sm font-medium"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Keep {conflict.imageCount} Photo{conflict.imageCount !== 1 ? "s" : ""} Only
                  </button>
                  <button
                    type="button"
                    onClick={() => onKeepVideo(conflict.platform)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-red-500 text-red-900 dark:text-red-100 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-sm font-medium"
                  >
                    <Video className="h-4 w-4" />
                    Keep {conflict.videoCount} Video{conflict.videoCount !== 1 ? "s" : ""} Only
                  </button>
                </div>
              )}

              {conflict.issue === "video_limit" && (
                <p className="text-xs text-red-700 dark:text-red-300">
                  Please remove excess videos before publishing.
                </p>
              )}

              {conflict.issue === "image_limit" && (
                <p className="text-xs text-red-700 dark:text-red-300">
                  Please remove excess images before publishing.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
