// components/post-editor/media-upload.tsx

"use client";

import { useCallback, useState, useMemo } from "react";
import { Upload, X, Loader2, Plus, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getConnections } from "@/lib/api/integrations";
import MediaRoomModal from "./media-room-modal";
import type { MediaItem as LibraryMediaItem } from "@/lib/api/media";
import { Button } from "@/components/ui/button";

interface MediaUploadProps {
  mediaFiles: File[];
  mediaPreviews: string[];
  isUploading: boolean;
  onMediaChange: (files: File[], previews: string[]) => void;
  onRemoveMedia: (fileToRemove: File) => void;
  onLibraryMediaSelect?: (mediaItem: LibraryMediaItem) => void;
  selectedLibraryMediaIds?: Set<string>;
}

export default function MediaUpload({
  mediaFiles,
  mediaPreviews,
  isUploading,
  onMediaChange,
  onRemoveMedia,
  onLibraryMediaSelect,
  selectedLibraryMediaIds = new Set(),
}: MediaUploadProps) {
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isMediaRoomOpen, setIsMediaRoomOpen] = useState(false);

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const integrationId = useMemo(
    () => connections[0]?.id || null,
    [connections]
  );

  const MAX_FILES = 10;

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles = newFiles.filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );

      if (validFiles.length === 0) return;

      const currentFileCount = mediaFiles.length;
      const remainingSlots = MAX_FILES - currentFileCount;
      if (remainingSlots <= 0) return;

      const filesToAdd = validFiles.slice(0, remainingSlots);
      const newPreviews = filesToAdd.map((f) => URL.createObjectURL(f));

      onMediaChange(filesToAdd, newPreviews);
    },
    [mediaFiles, onMediaChange]
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

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
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
        onRemoveMedia(fileToRemove);
      }
    },
    [mediaFiles, onRemoveMedia]
  );

  const handleLibraryConfirm = useCallback(
    (selectedMedia: LibraryMediaItem[]) => {
      selectedMedia.forEach((media) => {
        onLibraryMediaSelect?.(media);
      });
      setIsMediaRoomOpen(false);
    },
    [onLibraryMediaSelect]
  );

  const hasMedia = mediaPreviews.length > 0;
  const isFull = mediaPreviews.length >= MAX_FILES;

  if (hasMedia) {
    return (
      <>
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {mediaPreviews.map((preview, index) => {
              const isVideo = mediaFiles[index]?.type.startsWith("video/");

              return (
                <div
                  key={preview}
                  className="relative group aspect-square bg-black/5 rounded-md overflow-hidden border border-[--border] transition-all duration-200 hover:ring-2 hover:ring-[--foreground]"
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

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
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

          <div className="flex items-center justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMediaRoomOpen(true)}
              className="gap-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <FolderOpen className="h-4 w-4" />
              Browse Media Library
            </Button>
          </div>
        </div>

        <MediaRoomModal
          isOpen={isMediaRoomOpen}
          onClose={() => setIsMediaRoomOpen(false)}
          onConfirmSelection={handleLibraryConfirm}
          integrationId={integrationId}
          preSelectedIds={selectedLibraryMediaIds}
        />
      </>
    );
  }

  // Empty state with drag & drop + browse library button
  return (
    <>
      <div
        onDragOver={handleFileDragOver}
        onDragLeave={handleFileDragLeave}
        onDrop={handleFileDrop}
        className={cn(
          "border-2 border-dashed rounded-lg transition-colors p-8",
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
            <Upload className="w-10 h-10 mx-auto mb-4 text-[--muted]" />
            <p className="font-serif text-base text-[--foreground] mb-2">
              Drag & drop or click to upload
            </p>
            <p className="text-sm text-[--muted] mb-4">
              Up to {MAX_FILES} items
            </p>
          </div>
        </label>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground uppercase">Or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsMediaRoomOpen(true)}
            className="gap-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            <FolderOpen className="h-4 w-4" />
            Browse Library
          </Button>
        </div>
      </div>

      <MediaRoomModal
        isOpen={isMediaRoomOpen}
        onClose={() => setIsMediaRoomOpen(false)}
        onConfirmSelection={handleLibraryConfirm}
        integrationId={integrationId}
        preSelectedIds={selectedLibraryMediaIds}
      />
    </>
  );
}
