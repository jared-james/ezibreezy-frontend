// components/post-editor/media-upload.tsx

"use client";

import { useCallback, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Plus,
  AlertCircle,
  GripHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  mediaFiles: File[];
  mediaPreviews: string[];
  isUploading: boolean;
  onMediaChange: (files: File[], previews: string[]) => void;
  onRemoveMedia: (fileToRemove: File) => void;
  activePlatforms?: Set<string>;
}

export default function MediaUpload({
  mediaFiles,
  mediaPreviews,
  isUploading,
  onMediaChange,
  onRemoveMedia,
  activePlatforms,
}: MediaUploadProps) {
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const isXActive = activePlatforms?.has("x");
  const MAX_FILES = 10;
  const MAX_X_FILES = 4;

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles = newFiles.filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );

      if (validFiles.length === 0) return;

      const totalFiles = [...mediaFiles, ...validFiles].slice(0, MAX_FILES);
      const newPreviews = validFiles.map((f) => URL.createObjectURL(f));

      const existingPreviews = mediaFiles.map((_, i) => mediaPreviews[i]);

      const totalPreviews = [...existingPreviews, ...newPreviews].slice(
        0,
        MAX_FILES
      );

      onMediaChange(totalFiles, totalPreviews);
    },
    [mediaFiles, mediaPreviews, onMediaChange]
  );

  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(true);
  }, []);

  const handleFileDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(false);
  }, []);

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingFiles(false);

      if (draggedIndex !== null) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles, draggedIndex]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(selectedFiles);
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleSortDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleSortDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSortDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newFiles = [...mediaFiles];
    const newPreviews = [...mediaPreviews];

    const [movedFile] = newFiles.splice(draggedIndex, 1);
    const [movedPreview] = newPreviews.splice(draggedIndex, 1);

    newFiles.splice(dropIndex, 0, movedFile);
    newPreviews.splice(dropIndex, 0, movedPreview);

    onMediaChange(newFiles, newPreviews);
    setDraggedIndex(null);
  };

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      const fileToRemove = mediaFiles[indexToRemove];
      if (fileToRemove) {
        onRemoveMedia(fileToRemove);
      }
    },
    [mediaFiles, onRemoveMedia]
  );

  const hasMedia = mediaPreviews.length > 0;
  const isFull = mediaPreviews.length >= MAX_FILES;

  if (hasMedia) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {mediaPreviews.map((preview, index) => {
            const isVideo = mediaFiles[index]?.type.startsWith("video/");
            const isExcludedFromX = isXActive && index >= MAX_X_FILES;
            const isBeingDragged = draggedIndex === index;

            return (
              <div
                key={preview}
                draggable={!isUploading}
                onDragStart={(e) => handleSortDragStart(e, index)}
                onDragOver={handleSortDragOver}
                onDrop={(e) => handleSortDrop(e, index)}
                className={cn(
                  "relative group aspect-square bg-black/5 rounded-md overflow-hidden border border-[--border] cursor-move transition-all duration-200",
                  isExcludedFromX ? "opacity-60 grayscale" : "",
                  isBeingDragged
                    ? "opacity-0"
                    : "opacity-100 hover:ring-2 hover:ring-[--foreground]"
                )}
              >
                {isVideo ? (
                  <video
                    src={preview}
                    className="w-full h-full object-cover pointer-events-none"
                    onCanPlay={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/40 text-white p-1 rounded">
                  <GripHorizontal className="w-5 h-5" />
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 cursor-wait">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}

                {isExcludedFromX && (
                  <div className="absolute inset-0 bg-black/20 flex items-end justify-center p-1 pointer-events-none">
                    <div className="bg-red-500/90 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 w-full justify-center">
                      <AlertCircle className="w-2.5 h-2.5" />
                      <span className="font-bold">No X</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  disabled={isUploading}
                  className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors z-20 opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>

                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-medium text-white flex items-center gap-1 pointer-events-none">
                  {index + 1}
                </div>
              </div>
            );
          })}

          {!isFull && (
            <label className="relative aspect-square border-2 border-dashed border-[--border] hover:border-[--foreground] hover:bg-[--surface-hover] rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-[--muted-foreground] hover:text-[--foreground] transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Plus className="w-5 h-5" />
              <span className="text-[9px] uppercase font-bold">Add</span>
            </label>
          )}
        </div>

        {isXActive && mediaPreviews.length > MAX_X_FILES && (
          <p className="text-xs text-[--muted-foreground] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Drag media to the first {MAX_X_FILES} spots to publish them on X.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleFileDragOver}
      onDragLeave={handleFileDragLeave}
      onDrop={handleFileDrop}
      className={cn(
        "border-2 border-dashed rounded-lg transition-colors p-6",
        isDraggingFiles
          ? "border-[--foreground] bg-[--surface-hover]"
          : "border-[--border] hover:border-[--foreground]/50"
      )}
    >
      <label className="block cursor-pointer">
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
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-[--muted]">
            Up to {MAX_FILES} items (Main Post)
          </p>
        </div>
      </label>
    </div>
  );
}
