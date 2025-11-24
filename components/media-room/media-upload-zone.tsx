// components/media-room/media-upload-zone.tsx

"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUploadMedia } from "@/lib/hooks/use-media";

interface MediaUploadZoneProps {
  integrationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UploadItem {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function MediaUploadZone({
  integrationId,
  isOpen,
  onClose,
}: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);

  const uploadMedia = useUploadMedia(integrationId);

  const uploadFile = async (file: File) => {
    // Set status to uploading
    setUploadQueue((prev) =>
      prev.map((u) => (u.file === file ? { ...u, status: "uploading" } : u))
    );

    try {
      await uploadMedia.mutateAsync(file);
      // Set status to success
      setUploadQueue((prev) =>
        prev.map((u) => (u.file === file ? { ...u, status: "success" } : u))
      );
    } catch (error) {
      // Set status to error
      setUploadQueue((prev) =>
        prev.map((u) =>
          u.file === file
            ? {
                ...u,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : u
        )
      );
    }
  };

  const processFiles = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter(
        (f) =>
          f.type.startsWith("image/") ||
          f.type.startsWith("video/") ||
          f.type === "image/gif"
      );

      if (validFiles.length === 0) return;

      // Add all valid files to queue as 'pending'
      const newItems: UploadItem[] = validFiles.map((file) => ({
        file,
        status: "pending",
      }));

      setUploadQueue((prev) => [...prev, ...newItems]);

      // Trigger all uploads concurrently
      // Browsers will automatically throttle requests to the per-domain limit (usually 6)
      await Promise.all(validFiles.map((file) => uploadFile(file)));
    },
    [uploadMedia]
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
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      processFiles(files);
      // Reset input value so the same file can be selected again if needed
      e.target.value = "";
    },
    [processFiles]
  );

  const handleClearCompleted = () => {
    setUploadQueue((prev) =>
      prev.filter(
        (item) => item.status !== "success" && item.status !== "error"
      )
    );
  };

  const handleClose = () => {
    setUploadQueue([]);
    onClose();
  };

  const hasCompletedItems = uploadQueue.some(
    (item) => item.status === "success" || item.status === "error"
  );

  const isUploading = uploadQueue.some((item) => item.status === "uploading");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-background border-2 border-foreground shadow-2xl rounded-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <p className="eyebrow">Upload Media</p>
            <h2 className="font-serif text-xl font-bold">
              Add files to your library
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-surface-hover rounded-sm transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drop zone */}
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-sm transition-colors p-8",
              isDragging
                ? "border-brand-primary bg-brand-primary/5"
                : "border-border hover:border-brand-primary hover:bg-surface-hover"
            )}
          >
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <div className="text-center">
                <Upload
                  className={cn(
                    "w-12 h-12 mx-auto mb-4 transition-colors",
                    isDragging ? "text-brand-primary" : "text-muted-foreground"
                  )}
                />
                <p className="font-serif text-lg text-foreground mb-2">
                  Drag & drop files here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, GIF, WebP, MP4, MOV (max 512MB)
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Upload queue */}
        {uploadQueue.length > 0 && (
          <div className="border-t border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-surface">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {uploadQueue.filter((i) => i.status === "success").length} of{" "}
                {uploadQueue.length} uploaded
              </span>
              {hasCompletedItems && !isUploading && (
                <button
                  onClick={handleClearCompleted}
                  className="text-xs text-muted-foreground hover:text-brand-primary transition-colors font-medium"
                >
                  Clear completed
                </button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto">
              {uploadQueue.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="flex items-center gap-3 px-4 py-2 border-b border-border last:border-0"
                >
                  {/* Status icon */}
                  <div className="shrink-0">
                    {item.status === "pending" && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    {item.status === "uploading" && (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                    )}
                    {item.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {item.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-error" />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate">
                      {item.file.name}
                    </p>
                    {item.error && (
                      <p className="text-xs text-error truncate">
                        {item.error}
                      </p>
                    )}
                  </div>

                  {/* File size */}
                  <span className="text-xs text-muted-foreground shrink-0">
                    {(item.file.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
          <Button
            variant="primary"
            onClick={handleClose}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}
