"use client";

import { useCallback, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Film,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  // Now accepts arrays
  mediaFiles: File[];
  mediaPreviews: string[];
  // We can track uploading generically or per item,
  // but for UI simplicity we'll use the global loading state passed down
  isUploading: boolean;
  onMediaChange: (files: File[], previews: string[]) => void;
}

export default function MediaUpload({
  mediaFiles,
  mediaPreviews,
  isUploading,
  onMediaChange,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      // Filter for valid types
      const validFiles = newFiles.filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );

      if (validFiles.length === 0) return;

      // Combine current + new, cap at 4
      const totalFiles = [...mediaFiles, ...validFiles].slice(0, 4);

      // Generate previews for ONLY the new files and append to existing previews
      const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
      const totalPreviews = [...mediaPreviews, ...newPreviews].slice(0, 4);

      onMediaChange(totalFiles, totalPreviews);
    },
    [mediaFiles, mediaPreviews, onMediaChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(selectedFiles);
      // Reset input so same file can be selected again if needed
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      const newFiles = mediaFiles.filter((_, i) => i !== indexToRemove);
      const newPreviews = mediaPreviews.filter((_, i) => i !== indexToRemove);
      onMediaChange(newFiles, newPreviews);
    },
    [mediaFiles, mediaPreviews, onMediaChange]
  );

  const hasMedia = mediaPreviews.length > 0;
  const isFull = mediaPreviews.length >= 4;

  // Render the preview grid
  if (hasMedia) {
    return (
      <div className="space-y-3">
        {/* Grid Container */}
        <div
          className={cn(
            "grid gap-2 overflow-hidden rounded-lg border border-[--border] bg-[--surface]",
            mediaPreviews.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}
        >
          {mediaPreviews.map((preview, index) => {
            const isVideo = mediaFiles[index]?.type.startsWith("video/");

            return (
              <div
                key={preview}
                className={cn(
                  "relative group aspect-square bg-black/5",
                  // If 3 items, make the first one span 2 rows (big left image)
                  mediaPreviews.length === 3 && index === 0
                    ? "row-span-2 h-full"
                    : ""
                )}
              >
                {isVideo ? (
                  <video
                    src={preview}
                    className="w-full h-full object-cover"
                    controls={false} // Hide controls in thumbnail
                  />
                ) : (
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Upload Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={isUploading}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-20"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Type Indicator */}
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 rounded text-[10px] font-medium text-white flex items-center gap-1 pointer-events-none">
                  {isVideo ? (
                    <Film className="w-3 h-3" />
                  ) : (
                    <ImageIcon className="w-3 h-3" />
                  )}
                  {index + 1}
                </div>
              </div>
            );
          })}

          {/* Add Button (Visual placeholder if not full, though usually we use the dropzone below) */}
        </div>

        {/* Add More / Drop Zone (Only if not full) */}
        {!isFull && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg transition-colors h-24 flex items-center justify-center",
              isDragging
                ? "border-[--foreground] bg-[--surface-hover]"
                : "border-[--border] hover:border-[--foreground]/50"
            )}
          >
            <label className="cursor-pointer w-full h-full flex items-center justify-center gap-2">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-[--muted-foreground]">
                <Plus className="w-5 h-5" />
                <span className="font-serif text-sm">
                  Add media ({4 - mediaFiles.length} remaining)
                </span>
              </div>
            </label>
          </div>
        )}
      </div>
    );
  }

  // Empty State
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded transition-colors",
        isDragging
          ? "border-[--foreground] bg-[--surface]"
          : "border-[--border] hover:border-[--foreground]/50"
      )}
    >
      <label className="block cursor-pointer p-8">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto mb-3 text-[--muted]" />
          <p className="font-serif text-sm text-[--foreground] mb-1">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-[--muted]">Up to 4 images or videos</p>
        </div>
      </label>
    </div>
  );
}
