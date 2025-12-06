// components/post-editor/previews/pinterest/pinterest-options.tsx

"use client";

import { useState, useRef } from "react";
import {
  Link as LinkIcon,
  FileText,
  Film,
  Upload,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { PinterestBoardSelector } from "./pinterest-board-selector";
import { MediaItem } from "@/lib/store/editorial/draft-store";
import { toast } from "sonner";
import { uploadMediaAction } from "@/app/actions/media";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import MediaSourceModal from "../../modals/media-source-modal";
import MediaRoomModal from "../../modals/media-room-modal";
import type { MediaItem as LibraryMediaItem } from "@/lib/api/media";

interface PinterestOptionsProps {
  integrationId: string | null;
  boardId: string | null;
  onBoardChange: (boardId: string) => void;
  link: string;
  onLinkChange: (link: string) => void;
  altText?: string;
  onAltTextChange?: (text: string) => void;
  activeMediaItem?: MediaItem;
  coverUrl?: string | null;
  onCoverChange?: (url: string | null) => void;
}

export function PinterestOptions({
  integrationId,
  boardId,
  onBoardChange,
  link,
  onLinkChange,
  altText = "",
  onAltTextChange,
  activeMediaItem,
  coverUrl,
  onCoverChange,
}: PinterestOptionsProps) {
  const { currentWorkspace } = useWorkspaceStore();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isMediaRoomOpen, setIsMediaRoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = activeMediaItem?.type === "video";
  const displayMediaSrc = activeMediaItem?.mediaUrl || activeMediaItem?.preview;

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!integrationId || !currentWorkspace) {
      toast.error("Please select a Pinterest account first.");
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
    } finally{
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

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
          Pinterest Settings
        </h3>
      </div>

      <PinterestBoardSelector
        integrationId={integrationId}
        selectedBoardId={boardId}
        onBoardSelect={onBoardChange}
      />

      {/* --- VIDEO COVER OPTIONS (Only show if video) --- */}
      {isVideo && displayMediaSrc && (
        <>
          <div className="h-px bg-border" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Film className="w-3 h-3" />
                Cover Image <span className="text-red-500">*</span>
              </label>
              {!coverUrl && (
                <span className="text-[10px] text-amber-500 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" /> Required
                </span>
              )}
            </div>

            <div className="flex gap-4 items-start">
              {/* Preview Box */}
              <div className="relative w-20 aspect-[9/16] bg-muted border border-border rounded-md overflow-hidden shrink-0">
                {coverUrl ? (
                  <>
                    <img
                      src={coverUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onCoverChange?.(null)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <video
                    src={displayMediaSrc}
                    className="w-full h-full object-cover opacity-50"
                    muted
                    playsInline
                  />
                )}
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsSourceModalOpen(true)}
                  disabled={isUploadingCover}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border hover:bg-surface-hover rounded-md text-xs font-medium cursor-pointer transition-colors w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingCover ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Upload Custom Cover
                </button>
                <p className="text-[10px] text-muted-foreground">
                  A custom cover image is required for Pinterest videos.
                </p>
              </div>
            </div>
          </div>
          <div className="h-px bg-border" />
        </>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <LinkIcon className="w-3 h-3" />
          Destination Link
        </label>
        <Input
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder="https://your-website.com"
          className="h-9"
        />
      </div>

      {onAltTextChange && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            Pin Alt Text
          </label>
          <Input
            value={altText}
            onChange={(e) => onAltTextChange(e.target.value)}
            placeholder="Describe your Pin for screen readers"
            className="h-9"
            maxLength={500}
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {altText.length}/500
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
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
