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

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    }
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
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Media Attachment
        </h3>
        <Icon className="w-4 h-4 text-[--muted]" />
      </div>

      <div className="bg-[--surface] border border-[--border] p-3 mt-4">
        {!mediaPreview ? (
          <label className="block cursor-pointer relative">
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-10">
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                <p className="font-serif text-xs text-foreground mt-2">
                  Uploading...
                </p>
              </div>
            )}
            <div className="border-2 border-dashed border-[--border] flex items-center justify-center text-center hover:border-[--foreground] transition-colors bg-[--background] p-3">
              <Upload className="w-6 h-6 mr-3 text-[--muted-foreground]" />
              <div className="text-left">
                <p className="font-serif text-sm text-[--foreground]">
                  Click to upload {postType}
                </p>
                <p className="text-xs text-[--muted-foreground] mt-1">
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
          <div className="relative border border-[--border] p-2 bg-[--background] flex items-center justify-between">
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                <p className="font-serif text-xs text-foreground ml-2">
                  Uploading...
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                {postType === "image" ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-full object-cover border border-border"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="w-full h-full object-cover border border-border"
                  />
                )}
                <Icon className="absolute top-0 right-0 w-4 h-4 text-white bg-black/50 p-0.5 rounded-bl" />
              </div>
              <p className="font-serif text-sm text-foreground truncate max-w-[200px]">
                {mediaFile?.name || `Uploaded ${postType}`}
              </p>
            </div>
            <button
              onClick={removeMedia}
              className={cn(
                "flex-shrink-0 size-7 flex items-center justify-center bg-transparent text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-sm transition-colors",
                isUploading && "opacity-50 pointer-events-none"
              )}
              aria-label="Remove media"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
