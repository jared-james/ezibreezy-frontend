// components/media-room/media-detail-panel.tsx

"use client";

import { useState } from "react";
import {
  X,
  Heart,
  Trash2,
  Download,
  Loader2,
  Tag,
  Folder,
  Calendar,
  FileType,
  Maximize2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  useMediaItem,
  useUpdateMedia,
  useDeleteMedia,
  useTagList,
  useAttachTags,
  useDetachTags,
  useFolderList,
} from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaDetailPanelProps {
  integrationId: string | null;
}

export default function MediaDetailPanel({ integrationId }: MediaDetailPanelProps) {
  const mediaId = useMediaRoomStore((s) => s.detailPanelMediaId);
  const closeDetailPanel = useMediaRoomStore((s) => s.closeDetailPanel);

  const { data: media, isLoading } = useMediaItem(mediaId, integrationId);
  const { data: tags = [] } = useTagList(integrationId);
  const { data: folders = [] } = useFolderList(integrationId, "root");

  const updateMedia = useUpdateMedia(integrationId);
  const deleteMedia = useDeleteMedia(integrationId);
  const attachTags = useAttachTags(integrationId);
  const detachTags = useDetachTags(integrationId);

  const [editedFilename, setEditedFilename] = useState<string | null>(null);
  const [editedAltText, setEditedAltText] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  // Use edited values if user has made changes, otherwise use data from API
  const filename = editedFilename ?? media?.filename ?? "";
  const altText = editedAltText ?? media?.altText ?? "";

  if (!mediaId) return null;

  const handleSave = () => {
    if (!media) return;
    const updates: { filename?: string; altText?: string } = {};
    if (editedFilename !== null && editedFilename !== media.filename) {
      updates.filename = editedFilename;
    }
    if (editedAltText !== null && editedAltText !== (media.altText || "")) {
      updates.altText = editedAltText;
    }

    if (Object.keys(updates).length > 0) {
      updateMedia.mutate(
        { id: media.id, data: updates },
        {
          onSuccess: () => {
            setEditedFilename(null);
            setEditedAltText(null);
          },
        }
      );
    }
  };

  const handleToggleFavorite = () => {
    if (!media) return;
    updateMedia.mutate({ id: media.id, data: { isFavorite: !media.isFavorite } });
  };

  const handleDelete = () => {
    if (!media) return;
    deleteMedia.mutate(media.id, {
      onSuccess: () => {
        closeDetailPanel();
      },
    });
  };

  const handleMoveToFolder = (folderId: string | null) => {
    if (!media) return;
    updateMedia.mutate({ id: media.id, data: { folderId } });
    setShowFolderDropdown(false);
  };

  const handleToggleTag = (tagId: string) => {
    if (!media) return;
    const hasTag = media.tags.some((t) => t.id === tagId);
    if (hasTag) {
      detachTags.mutate({ mediaId: media.id, tagIds: [tagId] });
    } else {
      attachTags.mutate({ mediaId: media.id, tagIds: [tagId] });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isVideo = media?.type.startsWith("video/");

  return (
    <div className="w-96 border-l-2 border-foreground bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <p className="eyebrow">Media Details</p>
        <button
          onClick={closeDetailPanel}
          className="p-1 hover:bg-surface-hover rounded transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : media ? (
        <div className="flex-1 overflow-y-auto">
          {/* Preview */}
          <div className="relative aspect-video bg-black/5">
            {isVideo ? (
              <video
                src={media.url}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={media.url}
                alt={media.altText || media.filename}
                className="w-full h-full object-contain"
              />
            )}
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded hover:bg-black/80 transition-colors"
            >
              <Maximize2 className="h-4 w-4" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <Button
              variant={media.isFavorite ? "primary" : "outline"}
              size="sm"
              onClick={handleToggleFavorite}
              disabled={updateMedia.isPending}
              className="gap-1.5"
            >
              <Heart className={cn("h-3.5 w-3.5", media.isFavorite && "fill-current")} />
              {media.isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <a
              href={media.url}
              download={media.filename}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm text-xs font-serif uppercase tracking-wide border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-1.5 ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>

          {/* Editable fields */}
          <div className="p-4 space-y-4 border-b border-border">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Filename
              </label>
              <Input
                value={filename}
                onChange={(e) => setEditedFilename(e.target.value)}
                onBlur={handleSave}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Alt Text
              </label>
              <Textarea
                value={altText}
                onChange={(e) => setEditedAltText(e.target.value)}
                onBlur={handleSave}
                rows={3}
                placeholder="Describe this media for accessibility..."
                className="resize-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {showTagDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border shadow-lg z-50 max-h-48 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {tags.map((tag) => {
                        const isAttached = media.tags.some((t) => t.id === tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => handleToggleTag(tag.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                              isAttached
                                ? "bg-foreground text-background"
                                : "hover:bg-surface-hover"
                            )}
                          >
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="truncate">{tag.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {media.tags.length === 0 ? (
                <p className="text-sm text-muted-foreground font-serif italic">No tags</p>
              ) : (
                media.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded"
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                      border: `1px solid ${tag.color}40`,
                    }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleToggleTag(tag.id)}
                      className="hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Folder */}
          <div className="p-4 border-b border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Folder className="h-3.5 w-3.5" />
              Folder
            </label>
            <div className="relative">
              <button
                onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-border bg-surface hover:bg-surface-hover transition-colors text-left text-sm font-serif"
              >
                <span>{media.folder?.name || "Root"}</span>
              </button>
              {showFolderDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-lg z-50 max-h-48 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleMoveToFolder(null)}
                      className={cn(
                        "w-full px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                        !media.folderId
                          ? "bg-foreground text-background"
                          : "hover:bg-surface-hover"
                      )}
                    >
                      Root
                    </button>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => handleMoveToFolder(folder.id)}
                        className={cn(
                          "w-full px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                          media.folderId === folder.id
                            ? "bg-foreground text-background"
                            : "hover:bg-surface-hover"
                        )}
                      >
                        {folder.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <FileType className="h-4 w-4 text-muted-foreground" />
              <span className="font-serif text-muted-foreground">
                {media.type} &middot; {formatFileSize(media.fileSize)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-serif text-muted-foreground">
                {media.width} × {media.height} px
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-serif text-muted-foreground">
                Uploaded {format(new Date(media.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>

          {/* Usage */}
          {media.usedInPosts && media.usedInPosts.length > 0 && (
            <div className="p-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                Used in {media.usedInPosts.length} {media.usedInPosts.length === 1 ? "post" : "posts"}
              </label>
              <div className="space-y-2">
                {media.usedInPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border border-border bg-surface rounded-sm"
                  >
                    <p className="font-serif text-sm font-bold truncate">
                      {post.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="uppercase tracking-wider">{post.status}</span>
                      {post.scheduledAt && (
                        <> &middot; {format(new Date(post.scheduledAt), "MMM d, yyyy")}</>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="font-serif text-muted-foreground italic">Media not found</p>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete Media</AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Are you sure you want to delete this media? This action cannot be undone.
              {media?.usageCount ? (
                <span className="block mt-2 text-error">
                  Warning: This media is used in {media.usageCount} post(s).
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error text-error-foreground hover:bg-error-hover"
            >
              {deleteMedia.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
