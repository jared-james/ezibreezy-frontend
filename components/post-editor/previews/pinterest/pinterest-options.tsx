// components/post-editor/previews/pinterest/pinterest-options.tsx

"use client";

import { useState } from "react";
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
import { MediaItem } from "@/lib/store/editorial-store";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/api/media";
import { useClientData } from "@/lib/hooks/use-client-data";

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
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const { organizationId } = useClientData();

  const isVideo = activeMediaItem?.type === "video";
  const displayMediaSrc = activeMediaItem?.mediaUrl || activeMediaItem?.preview;

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!integrationId) {
      toast.error("Please select a Pinterest account first.");
      return;
    }

    if (!organizationId) {
      toast.error("Organization context missing.");
      return;
    }

    try {
      setIsUploadingCover(true);
      // Fixed: Passing organizationId instead of integrationId
      const response = await uploadMedia(file, organizationId);
      onCoverChange?.(response.url);
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error(error);
    } finally {
      setIsUploadingCover(false);
    }
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
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border hover:bg-surface-hover rounded-md text-xs font-medium cursor-pointer transition-colors w-full justify-center">
                  {isUploadingCover ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Upload Custom Cover
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                  />
                </label>
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
    </div>
  );
}
