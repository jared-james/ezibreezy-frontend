"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Upload, X, Loader2, Video, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import MediaRoomModal from "../modals/media-room-modal";
import MediaSourceModal from "../modals/media-source-modal";
import type { MediaItem as LibraryMediaItem } from "@/lib/api/media";
import { Button } from "@/components/ui/button";
import { MediaItem } from "@/lib/store/editorial/draft-store";

interface MediaUploadProps {
  items?: MediaItem[];
  mediaFiles: File[];
  mediaPreviews: string[];
  isUploading: boolean;
  onMediaChange: (files: File[], previews: string[]) => void;
  onRemoveMedia: (fileToRemove: File | null, indexToRemove?: number) => void;
  onLibraryMediaSelect?: (mediaItem: LibraryMediaItem) => void;
  selectedLibraryMediaIds?: Set<string>;
}

export default function MediaUpload({
  items = [],
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
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: clientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: Infinity,
  });

  const organizationId = clientData?.organizationId || null;

  const MAX_FILES = 20;

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles = newFiles.filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );

      if (validFiles.length === 0) return;

      const currentTotalCount = mediaPreviews.length;
      const remainingSlots = MAX_FILES - currentTotalCount;
      if (remainingSlots <= 0) return;

      const filesToAdd = validFiles.slice(0, remainingSlots);
      const newPreviews = filesToAdd.map((f) => URL.createObjectURL(f));

      onMediaChange(filesToAdd, newPreviews);
    },
    [mediaPreviews.length, onMediaChange]
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      const fileToRemove = mediaFiles[indexToRemove] || null;
      const previewToRemove = mediaPreviews[indexToRemove];
      if (previewToRemove && previewToRemove.startsWith("blob:")) {
        URL.revokeObjectURL(previewToRemove);
      }
      onRemoveMedia(fileToRemove, indexToRemove);
    },
    [mediaFiles, mediaPreviews, onRemoveMedia]
  );

  const handleLibraryConfirm = useCallback(
    (selectedMedia: LibraryMediaItem[]) => {
      const selectedIdsSet = new Set(selectedMedia.map((m) => m.id));
      selectedMedia.forEach((media) => {
        if (!selectedLibraryMediaIds.has(media.id)) {
          onLibraryMediaSelect?.(media);
        }
      });
      selectedLibraryMediaIds.forEach((existingId) => {
        if (!selectedIdsSet.has(existingId)) {
          onLibraryMediaSelect?.({ id: existingId } as LibraryMediaItem);
        }
      });
      setIsMediaRoomOpen(false);
    },
    [onLibraryMediaSelect, selectedLibraryMediaIds]
  );

  const hasMedia = mediaPreviews.length > 0;
  const isFull = mediaPreviews.length >= MAX_FILES;

  const uploadingItems = items.filter((i) => i.isUploading);
  const showUploadStatus = uploadingItems.length > 0;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      {hasMedia ? (
        <div className="space-y-4">
          {/* INCREASED COLS FROM 5 TO 6 HERE */}
          <div className="grid grid-cols-6 gap-2">
            {mediaPreviews.map((preview, index) => {
              const itemState = items[index];
              const isItemUploading = itemState?.isUploading;

              const isVideo = itemState
                ? itemState.type === "video"
                : mediaFiles[index]?.type.startsWith("video/") ||
                  preview.includes(".mp4") ||
                  preview.includes(".mov");

              const mediaSrc =
                isVideo && itemState?.mediaUrl ? itemState.mediaUrl : preview;

              return (
                <div
                  key={preview}
                  className="relative group aspect-square bg-black/5 rounded-md overflow-hidden border border-[--border] transition-all duration-200 hover:ring-2 hover:ring-[--foreground]"
                >
                  {isVideo ? (
                    <video
                      src={mediaSrc}
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

                  {isItemUploading && (
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
                    disabled={isItemUploading}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors z-20 cursor-pointer disabled:opacity-0"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-medium text-white flex items-center gap-1 pointer-events-none">
                    {index + 1}
                  </div>

                  {isVideo && (
                    <div className="absolute bottom-1 right-1 p-1 bg-black/70 rounded pointer-events-none">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {!isFull && (
              <button
                type="button"
                onClick={() => setIsSourceModalOpen(true)}
                className="relative aspect-square border-2 border-dashed border-[--border] hover:border-brand-primary/50 hover:bg-brand-primary/5 rounded-md flex flex-col items-center justify-center gap-1 text-[--muted-foreground] transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[9px] uppercase font-bold text-center leading-tight">
                  Add Media
                </span>
              </button>
            )}
          </div>

          {showUploadStatus && (
            <div className="border rounded-md border-border bg-surface overflow-hidden">
              <div className="bg-muted/30 px-3 py-1.5 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Uploading {uploadingItems.length} item
                {uploadingItems.length !== 1 ? "s" : ""}...
              </div>
              <div className="max-h-32 overflow-y-auto">
                {uploadingItems.map((item) => (
                  <div
                    key={item.uid}
                    className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-0 text-sm"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-brand-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">
                        {item.file?.name || "Uploading..."}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {item.file ? formatSize(item.file.size) : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          onDrop={handleFileDrop}
          className={cn(
            "border-2 border-dashed rounded-lg transition-colors flex flex-col items-center justify-center text-center",
            "min-h-[220px] py-6 px-4",
            isDraggingFiles
              ? "border-brand-primary bg-brand-primary/5"
              : "border-border hover:border-brand-primary/50"
          )}
        >
          <div className="flex flex-col gap-3 w-full max-w-xs items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSourceModalOpen(true)}
              className="w-full gap-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white h-11"
            >
              <Upload className="h-4 w-4" />
              Upload Media
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Drag and drop files here to upload
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <MediaSourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onUploadClick={handleUploadClick}
        onLibraryClick={() => setIsMediaRoomOpen(true)}
      />

      <MediaRoomModal
        isOpen={isMediaRoomOpen}
        onClose={() => setIsMediaRoomOpen(false)}
        onConfirmSelection={handleLibraryConfirm}
        organizationId={organizationId}
        preSelectedIds={selectedLibraryMediaIds}
      />
    </>
  );
}
