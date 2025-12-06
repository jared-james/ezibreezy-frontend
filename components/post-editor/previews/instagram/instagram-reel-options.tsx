// components/post-editor/previews/instagram/instagram-reel-options.tsx

"use client";

import { useState, useRef } from "react";
import { Film, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/app/actions/media";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import MediaSourceModal from "../../modals/media-source-modal";
import MediaRoomModal from "../../modals/media-room-modal";
import type { MediaItem as LibraryMediaItem } from "@/lib/types/media";

interface InstagramReelOptionsProps {
  integrationId?: string;
  shareToFeed?: boolean;
  onShareToFeedChange?: (val: boolean) => void;
  coverUrl?: string | null;
  onCoverChange?: (url: string | null) => void;
  displayMediaSrc?: string;
  thumbOffset?: number | null;
  onThumbOffsetChange?: (offset: number | null) => void;
  videoDuration: number;
}

export function InstagramReelOptions({
  integrationId,
  shareToFeed = true,
  onShareToFeedChange,
  coverUrl,
  onCoverChange,
  displayMediaSrc,
  thumbOffset,
  onThumbOffsetChange,
  videoDuration,
}: InstagramReelOptionsProps) {
  const { currentWorkspace } = useWorkspaceStore();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isMediaRoomOpen, setIsMediaRoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!integrationId || !currentWorkspace) {
      toast.error("Please select an Instagram account first.");
      return;
    }

    try {
      setIsUploadingCover(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadMediaAction(formData, currentWorkspace.id);
      if (!result.success) throw new Error(result.error);
      onCoverChange?.(result.data!.url);
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error(error);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLibraryConfirm = async (selectedMedia: LibraryMediaItem[]) => {
    if (selectedMedia.length === 0) return;

    const media = selectedMedia[0];
    if (!media.type.startsWith("image/")) {
      toast.error("Please select an image for the cover.");
      return;
    }

    onCoverChange?.(media.url);
    toast.success("Cover image selected from media room");
    setIsMediaRoomOpen(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeSeconds = parseFloat(e.target.value);
    onThumbOffsetChange?.(Math.floor(timeSeconds * 1000));
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
          <Film className="w-4 h-4" />
          Reel Options
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium text-foreground">
            Share to Feed
          </label>
          <p className="text-xs text-muted-foreground">
            Also show this Reel on your main profile grid
          </p>
        </div>
        <input
          type="checkbox"
          checked={shareToFeed}
          onChange={(e) => onShareToFeedChange?.(e.target.checked)}
          className="h-4 w-4 rounded border-brand-primary accent-brand-primary"
        />
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Cover Image
        </label>

        <div className="flex gap-4 items-start">
          <div className="relative w-20 aspect-[9/16] bg-muted border border-border rounded-md overflow-hidden shrink-0">
            {coverUrl ? (
              <>
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onCoverChange?.(null)}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            ) : displayMediaSrc ? (
              <video
                src={displayMediaSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                ref={(el) => {
                  if (el && thumbOffset !== undefined && thumbOffset !== null) {
                    el.currentTime = thumbOffset / 1000;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-[10px] text-center p-1">
                <span>Auto</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setIsSourceModalOpen(true)}
                disabled={isUploadingCover}
                className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border hover:bg-surface-hover rounded-md text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                Upload Custom Cover
              </button>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Must be a JPEG image (max 8MB). Overrides video frame.
              </p>
            </div>

            {!coverUrl && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Select Frame</span>
                  <span>
                    {thumbOffset ? (thumbOffset / 1000).toFixed(1) : "0.0"}s
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={videoDuration || 100}
                  step={0.1}
                  value={thumbOffset ? thumbOffset / 1000 : 0}
                  onChange={handleSliderChange}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg"
        onChange={handleCoverUpload}
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
        preSelectedIds={new Set()}
      />
    </div>
  );
}
