// app/(app)/ideas/components/edit-modal/media-panel.tsx

"use client";

import { useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPanelProps {
  postType: "text" | "image" | "video";
  mediaFile?: File | null;
  mediaPreview?: string | null;
  onMediaChange?: (file: File | null, preview: string | null) => void;
  isUploading?: boolean;
}

export default function MediaPanel({
  postType,
  mediaFile: externalMediaFile,
  mediaPreview: externalMediaPreview,
  onMediaChange,
  isUploading = false,
}: MediaPanelProps) {
  const [internalMediaFile, setInternalMediaFile] = useState<File | null>(null);
  const [internalMediaPreview, setInternalMediaPreview] = useState<
    string | null
  >(null);

  const mediaFile =
    externalMediaFile !== undefined ? externalMediaFile : internalMediaFile;
  const mediaPreview =
    externalMediaPreview !== undefined
      ? externalMediaPreview
      : internalMediaPreview;

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      if (onMediaChange) {
        onMediaChange(file, preview);
      } else {
        setInternalMediaFile(file);
        setInternalMediaPreview(preview);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    if (onMediaChange) {
      onMediaChange(null, null);
    } else {
      setInternalMediaFile(null);
      setInternalMediaPreview(null);
    }
  };

  if (postType === "text") return null;

  const Icon = postType === "image" ? ImageIcon : VideoIcon;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Media Attachment
        </h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mt-4 border border-border bg-surface p-3">
        {!mediaPreview ? (
          <label className="relative block cursor-pointer">
            {isUploading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="mt-2 font-serif text-xs text-foreground">
                  Uploading...
                </p>
              </div>
            )}
            <div className="flex items-center justify-center border-2 border-dashed border-border bg-background p-3 text-center transition-colors hover:border-foreground">
              <Upload className="mr-3 h-6 w-6 text-muted-foreground" />
              <div className="text-left">
                <p className="font-serif text-sm text-foreground">
                  Click to upload {postType}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {postType === "image"
                    ? "PNG, JPG, GIF up to 15MB"
                    : "MP4, MOV up to 512MB"}
                </p>
              </div>
            </div>
            <input
              type="file"
              accept={postType === "image" ? "image/*" : "video/*"}
              onChange={handleMediaUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        ) : (
          <div className="relative flex items-center justify-between border border-border bg-background p-2">
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-2 font-serif text-xs text-foreground">
                  Uploading...
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                {postType === "image" ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="h-full w-full border border-border object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="h-full w-full border border-border object-cover"
                  />
                )}
                <Icon className="absolute right-0 top-0 h-4 w-4 rounded-bl bg-black/50 p-0.5 text-white" />
              </div>
              <p className="max-w-[200px] truncate font-serif text-sm text-foreground">
                {mediaFile?.name || `Uploaded ${postType}`}
              </p>
            </div>
            <button
              onClick={removeMedia}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-sm bg-transparent text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500",
                isUploading && "pointer-events-none opacity-50"
              )}
              aria-label="Remove media"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
