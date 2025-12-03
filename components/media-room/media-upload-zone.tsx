// components/media-room/media-upload-zone.tsx

"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadMedia } from "@/lib/hooks/use-media";

interface MediaUploadZoneProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadItem {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function MediaUploadZone({
  isOpen,
  onClose,
}: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);

  const uploadMedia = useUploadMedia();

  const uploadFile = async (file: File) => {
    setUploadQueue((prev) =>
      prev.map((u) => (u.file === file ? { ...u, status: "uploading" } : u))
    );

    try {
      await uploadMedia.mutateAsync(file);
      setUploadQueue((prev) =>
        prev.map((u) => (u.file === file ? { ...u, status: "success" } : u))
      );
    } catch (error) {
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

      const newItems: UploadItem[] = validFiles.map((file) => ({
        file,
        status: "pending",
      }));

      setUploadQueue((prev) => [...prev, ...newItems]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-surface border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div>
            <p className="eyebrow mb-1">Upload Media</p>
            <h2 className="font-serif text-xl font-bold uppercase tracking-tight">
              Add files to library
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="btn btn-icon hover:bg-surface-hover disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 bg-surface">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-sm transition-all duration-200 p-10 flex flex-col items-center justify-center text-center",
              isDragging
                ? "border-brand-primary bg-brand-primary/5 scale-[0.99]"
                : "border-border hover:border-brand-primary hover:bg-surface-hover"
            )}
          >
            <label className="block cursor-pointer w-full h-full">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "p-4 rounded-full mb-4 transition-colors",
                    isDragging ? "bg-brand-primary/10" : "bg-neutral-100"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-8 h-8 transition-colors",
                      isDragging
                        ? "text-brand-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <p className="font-serif text-lg font-bold text-foreground mb-2">
                  Drag & drop files here
                </p>
                <p className="text-sm text-muted-foreground mb-4 font-serif">
                  or click to browse from your device
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  JPG, PNG, GIF, WebP, MP4, MOV (Max 512MB)
                </p>
              </div>
            </label>
          </div>
        </div>

        {uploadQueue.length > 0 && (
          <div className="border-t border-border flex-1 flex flex-col min-h-0 bg-surface">
            <div className="flex items-center justify-between px-6 py-3 bg-neutral-50 border-b border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {uploadQueue.filter((i) => i.status === "success").length} of{" "}
                {uploadQueue.length} uploaded
              </span>
              {hasCompletedItems && !isUploading && (
                <button
                  onClick={handleClearCompleted}
                  className="text-[10px] font-bold uppercase tracking-wider text-brand-primary hover:text-brand-primary-hover transition-colors"
                >
                  Clear completed
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              {uploadQueue.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="flex items-center gap-4 px-6 py-3 border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                >
                  <div className="shrink-0">
                    {item.status === "pending" && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
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

                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-medium truncate text-foreground">
                      {item.file.name}
                    </p>
                    {item.error && (
                      <p className="text-xs text-error truncate font-serif mt-0.5">
                        {item.error}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] font-bold tabular-nums text-muted-foreground shrink-0 uppercase tracking-wider">
                    {(item.file.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-surface">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="btn btn-primary"
          >
            {isUploading ? "Uploading..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
