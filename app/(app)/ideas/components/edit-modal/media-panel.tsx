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

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          {postType === "image" ? "Image" : "Video"}
        </h3>
        {postType === "image" ? (
          <ImageIcon className="w-4 h-4 text-[--muted]" />
        ) : (
          <VideoIcon className="w-4 h-4 text-[--muted]" />
        )}
      </div>

      <div className="bg-[--surface] border border-[--border] p-5 mt-4">
        {!mediaPreview ? (
          <label className="block cursor-pointer relative">
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-10">
                <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                <p className="font-serif text-sm text-foreground mt-2">
                  Uploading...
                </p>
              </div>
            )}
            <div className="border-2 border-dashed border-[--border] aspect-square flex flex-col items-center justify-center text-center hover:border-[--foreground] transition-colors bg-[--background]">
              <Upload className="w-12 h-12 mb-3 text-[--muted-foreground]" />
              <p className="font-serif text-sm text-[--foreground] mb-1">
                Click to upload {postType}
              </p>
              <p className="text-xs text-[--muted-foreground]">
                {postType === "image"
                  ? "PNG, JPG, GIF up to 15MB"
                  : "MP4, MOV up to 512MB"}
              </p>
              <p className="text-xs text-[--muted-foreground] mt-2">
                Recommended: 1:1 aspect ratio
              </p>
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
          <div className="relative aspect-square bg-[--background] border border-[--border]">
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-10">
                <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                <p className="font-serif text-sm text-foreground mt-2">
                  Uploading...
                </p>
              </div>
            )}
            {postType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-[--foreground] text-[--background] p-1.5 hover:bg-[--muted] transition-colors disabled:opacity-50"
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
