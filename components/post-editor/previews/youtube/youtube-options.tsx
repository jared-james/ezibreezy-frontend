// components/post-editor/previews/youtube/youtube-options.tsx

"use client";

import { useState, useRef } from "react";
import { Settings, Upload, Trash2, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/api/media";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientData } from "@/lib/hooks/use-client-data";
import MediaSourceModal from "../../modals/media-source-modal";
import MediaRoomModal from "../../modals/media-room-modal";
import type { MediaItem as LibraryMediaItem } from "@/lib/api/media";

const YOUTUBE_CATEGORIES = [
  { id: "22", name: "People & Blogs" },
  { id: "10", name: "Music" },
  { id: "20", name: "Gaming" },
  { id: "24", name: "Entertainment" },
  { id: "28", name: "Science & Technology" },
  { id: "27", name: "Education" },
  { id: "23", name: "Comedy" },
  { id: "17", name: "Sports" },
  { id: "1", name: "Film & Animation" },
  { id: "25", name: "News & Politics" },
];

interface YouTubeOptionsProps {
  integrationId?: string;
  privacy: "public" | "private" | "unlisted";
  onPrivacyChange: (val: "public" | "private" | "unlisted") => void;
  category: string;
  onCategoryChange: (val: string) => void;
  tags: string;
  onTagsChange: (val: string) => void;
  madeForKids: boolean;
  onMadeForKidsChange: (val: boolean) => void;
  thumbnailUrl: string | null;
  onThumbnailChange: (url: string | null) => void;
}

export function YouTubeOptions({
  integrationId,
  privacy,
  onPrivacyChange,
  category,
  onCategoryChange,
  tags,
  onTagsChange,
  madeForKids,
  onMadeForKidsChange,
  thumbnailUrl,
  onThumbnailChange,
}: YouTubeOptionsProps) {
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isMediaRoomOpen, setIsMediaRoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { organizationId } = useClientData();

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!integrationId) {
      toast.error("Please select a YouTube account first.");
      return;
    }

    if (!organizationId) {
      toast.error("Organization context missing.");
      return;
    }

    try {
      setIsUploadingThumb(true);
      // Fixed: Passing organizationId instead of integrationId
      const response = await uploadMedia(file, organizationId);
      onThumbnailChange(response.url);
      toast.success("Thumbnail uploaded");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error(error);
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLibraryConfirm = async (selectedMedia: LibraryMediaItem[]) => {
    if (selectedMedia.length === 0) return;

    const media = selectedMedia[0];
    if (!media.type.startsWith("image/")) {
      toast.error("Please select an image for the thumbnail.");
      return;
    }

    onThumbnailChange(media.url);
    toast.success("Thumbnail selected from media room");
    setIsMediaRoomOpen(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4" />
          YouTube Settings
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Visibility
        </label>
        <Select value={privacy} onValueChange={(v: any) => onPrivacyChange(v)}>
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Category
        </label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {YOUTUBE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Tags
        </label>
        <Input
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="technology, coding, tutorial (comma separated)"
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Custom Thumbnail
        </label>
        <div className="flex gap-4 items-start">
          <div className="relative w-24 aspect-video bg-muted border border-border rounded-md overflow-hidden shrink-0 flex items-center justify-center">
            {thumbnailUrl ? (
              <>
                <img
                  src={thumbnailUrl}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onThumbnailChange(null)}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground">Auto</span>
            )}
          </div>

          <div className="flex-1">
            <button
              type="button"
              onClick={() => setIsSourceModalOpen(true)}
              disabled={isUploadingThumb}
              className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border hover:bg-surface-hover rounded-md text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingThumb ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Upload Image
            </button>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Ideal size: 1280x720 (16:9).
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            Made for Kids
          </label>
          <p className="text-[10px] text-muted-foreground max-w-[200px] leading-tight">
            Required by COPPA. Content specifically created for children.
          </p>
        </div>
        <input
          type="checkbox"
          checked={madeForKids}
          onChange={(e) => onMadeForKidsChange(e.target.checked)}
          className="h-4 w-4 rounded border-brand-primary accent-brand-primary"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleThumbnailUpload}
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
        preSelectedIds={new Set()}
      />
    </div>
  );
}
