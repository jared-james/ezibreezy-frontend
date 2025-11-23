// components/post-editor/tiktok-preview.tsx

import { memo, useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Music, ImageIcon, Crop } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCaptionWithHashtags } from "./render-caption";
import { ImageCropperModal } from "./image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import { createCroppedPreviewUrl, type CropData } from "@/lib/utils/crop-utils";

interface TikTokPreviewProps {
  caption: string;
  mediaPreview: string | null;
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  originalMediaSrc?: string;
  croppedPreview?: string;
  onCropComplete?: (cropData: CropData, croppedPreviewUrl: string) => void;
}

const ProfileAvatar = ({
  size,
  avatarUrl,
  primaryName,
}: {
  size: number;
  avatarUrl: string | null;
  primaryName: string;
}) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        className="rounded-full border-2 border-white shrink-0 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border-2 border-white shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function TikTokPreview({
  caption,
  mediaPreview,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  originalMediaSrc,
  croppedPreview,
  onCropComplete,
}: TikTokPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const displayMediaSrc = croppedPreview || mediaPreview;
  const canCrop = originalMediaSrc && mediaType === "image" && onCropComplete;

  const handleCropComplete = async (
    croppedAreaPixels: PixelCrop,
    aspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => {
    if (!originalMediaSrc || !onCropComplete) return;

    try {
      const croppedUrl = await createCroppedPreviewUrl(
        originalMediaSrc,
        croppedAreaPixels,
        displayedWidth,
        displayedHeight
      );
      const cropData: CropData = {
        croppedAreaPixels,
        aspectRatio,
      };
      onCropComplete(cropData, croppedUrl);
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone-like container */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-[9/16] max-h-[500px]">
        {/* Video/Media area */}
        <div className="absolute inset-0">
          {displayMediaSrc ? (
            mediaType === "video" ? (
              <video
                src={displayMediaSrc}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={displayMediaSrc}
                alt="Media Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
              <ImageIcon className="w-12 h-12 mb-2" />
              <p className="text-sm">No video attached</p>
            </div>
          )}
        </div>

        {/* Right sidebar actions */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center">
            <ProfileAvatar size={44} avatarUrl={avatarUrl} primaryName={primaryName} />
            <div className="w-5 h-5 -mt-2.5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Heart className="w-7 h-7 text-white" />
            <span className="text-white text-xs">0</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="text-white text-xs">0</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Bookmark className="w-7 h-7 text-white" />
            <span className="text-white text-xs">0</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Share2 className="w-7 h-7 text-white" />
            <span className="text-white text-xs">Share</span>
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center animate-spin-slow">
            <Music className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-4 left-3 right-16 text-white">
          <p className="font-bold text-sm">@{accountName}</p>
          <p className="text-sm mt-1 line-clamp-3 whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Music className="w-3 h-3" />
            <p className="text-xs truncate">Original sound - {primaryName}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[--border]">
        {canCrop ? (
          <button
            onClick={() => setIsCropperOpen(true)}
            className="flex items-center gap-2 justify-center w-full font-serif font-bold text-sm text-brand-primary hover:text-brand-accent"
          >
            <Crop className="h-4 w-4" />
            Crop
          </button>
        ) : (
          <p className="text-xs text-[--muted-foreground] text-center italic">
            TikTok Preview
          </p>
        )}
      </div>

      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="tiktok"
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(TikTokPreview);
