// app/(app)/editorial/components/thread-post-media-upload.tsx

"use client";

import { useCallback } from "react";
import { X, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreadPostMediaUploadProps {
  threadIndex: number;
  mediaFiles: File[];
  mediaPreviews: string[];
  isUploading: boolean;
  onMediaChange: (
    files: File[],
    previews: string[],
    threadIndex: number
  ) => void;
  onRemoveMedia: (fileToRemove: File, threadIndex: number) => void;
}

const MAX_FILES = 4;

export default function ThreadPostMediaUpload({
  threadIndex,
  mediaFiles,
  mediaPreviews,
  isUploading,
  onMediaChange,
  onRemoveMedia,
}: ThreadPostMediaUploadProps) {
  const hasMedia = mediaPreviews.length > 0;
  const isFull = mediaPreviews.length >= MAX_FILES;

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles = newFiles.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      );

      if (validFiles.length === 0) return;

      const totalFiles = [...mediaFiles, ...validFiles].slice(0, MAX_FILES);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      const existingPreviews = mediaFiles.map(
        (_, index) => mediaPreviews[index]
      );

      const totalPreviews = [...existingPreviews, ...newPreviews].slice(
        0,
        MAX_FILES
      );

      onMediaChange(totalFiles, totalPreviews, threadIndex);
    },
    [mediaFiles, mediaPreviews, onMediaChange, threadIndex]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(selectedFiles);
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      const fileToRemove = mediaFiles[indexToRemove];
      if (fileToRemove) {
        onRemoveMedia(fileToRemove, threadIndex);
      }
    },
    [mediaFiles, onRemoveMedia, threadIndex]
  );

  return (
    <div className="space-y-2">
      <div
        className={cn("grid gap-2", hasMedia ? "grid-cols-4" : "grid-cols-1")}
      >
        {mediaPreviews.map((preview, index) => {
          const isVideo = mediaFiles[index]?.type.startsWith("video/");

          return (
            <div
              key={preview}
              className="relative group aspect-square bg-black/5 rounded-md overflow-hidden border border-[--border]"
            >
              {isVideo ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover pointer-events-none"
                  onCanPlay={(event) => event.currentTarget.pause()}
                />
              ) : (
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 cursor-wait">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              )}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemove(index);
                }}
                disabled={isUploading}
                className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors z-20 opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {!isFull && (
          <label
            className={cn(
              "relative border-2 border-dashed border-[--border] hover:border-[--foreground] hover:bg-[--surface-hover] rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-[--muted-foreground] hover:text-[--foreground] transition-colors",
              hasMedia ? "aspect-square" : "h-20"
            )}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Plus className="w-5 h-5" />
            <span className="text-[9px] uppercase font-bold">
              {hasMedia ? "Add" : "Image / Video"}
            </span>
          </label>
        )}
      </div>

      {isUploading && (
        <p className="text-xs text-[--muted-foreground] flex items-center gap-1.5 pt-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Upload in progress...
        </p>
      )}
    </div>
  );
}
