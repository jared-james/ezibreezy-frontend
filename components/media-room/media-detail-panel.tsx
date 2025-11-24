// components/media-room/media-detail-panel.tsx

"use client";

import { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Download,
  Loader2,
  Tag,
  Folder,
  Calendar,
  FileType,
  Maximize2,
  Plus,
  ChevronDown,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaDetailPanelProps {
  integrationId: string | null;
}

export default function MediaDetailPanel({
  integrationId,
}: MediaDetailPanelProps) {
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

  useEffect(() => {
    setEditedFilename(null);
    setEditedAltText(null);
  }, [mediaId]);

  const filename = editedFilename ?? media?.filename ?? "";
  const altText = editedAltText ?? media?.altText ?? "";

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
    <>
      <Dialog
        open={!!mediaId}
        onOpenChange={(open: boolean) => !open && closeDetailPanel()}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : media ? (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              <div className="flex-1 bg-neutral-100 flex items-center justify-center min-h-[300px] md:min-h-[500px] relative">
                {isVideo ? (
                  <video
                    src={media.url}
                    controls
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.altText || media.filename}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded hover:bg-black/80 transition-colors"
                  title="Open full size"
                >
                  <Maximize2 className="h-4 w-4" />
                </a>
              </div>

              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border flex flex-col overflow-y-auto bg-surface">
                <DialogHeader className="p-4 border-b border-border">
                  <DialogTitle className="font-serif text-lg">
                    Media Details
                  </DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 p-4 border-b border-border">
                  <a
                    href={media.url}
                    download={media.filename}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm text-xs font-serif uppercase tracking-wide border border-border bg-white hover:bg-surface-hover transition-colors w-full justify-center"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </div>

                <div className="p-4 space-y-4 border-b border-border">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Filename
                    </label>
                    <Input
                      value={filename}
                      onChange={(e) => setEditedFilename(e.target.value)}
                      onBlur={handleSave}
                      className="h-8 text-sm"
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
                      rows={2}
                      placeholder="Describe this media for accessibility..."
                      className="resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 border-b border-border">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Folder className="h-3.5 w-3.5" />
                    Folder
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-border bg-white hover:bg-surface-hover transition-colors text-left text-sm font-serif rounded-sm"
                    >
                      <span>{media.folder?.name || "Root"}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {showFolderDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border shadow-lg z-50 max-h-48 overflow-y-auto rounded-sm">
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => handleMoveToFolder(null)}
                            className={cn(
                              "w-full px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                              !media.folderId
                                ? "bg-brand-primary text-brand-primary-foreground"
                                : "hover:bg-neutral-100"
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
                                  ? "bg-brand-primary text-brand-primary-foreground"
                                  : "hover:bg-neutral-100"
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

                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Tags
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                        className="p-1 hover:bg-surface-hover rounded transition-colors text-muted-foreground hover:text-brand-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {showTagDropdown && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-border shadow-lg z-50 max-h-48 overflow-y-auto rounded-sm">
                          <div className="p-2 space-y-1">
                            {tags.map((tag) => {
                              const isAttached = media.tags.some(
                                (t) => t.id === tag.id
                              );
                              return (
                                <button
                                  key={tag.id}
                                  onClick={() => handleToggleTag(tag.id)}
                                  className={cn(
                                    "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                                    isAttached
                                      ? "bg-brand-primary text-brand-primary-foreground"
                                      : "hover:bg-neutral-100"
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
                            {tags.length === 0 && (
                              <p className="text-sm text-muted-foreground px-2 py-1">
                                No tags yet
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {media.tags.length === 0 ? (
                      <p className="text-sm text-muted-foreground font-serif italic">
                        No tags
                      </p>
                    ) : (
                      media.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm"
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

                <div className="p-4 border-b border-border space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FileType className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-serif text-muted-foreground">
                      {media.type} · {formatFileSize(media.fileSize)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-serif text-muted-foreground">
                      {media.width} × {media.height} px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-serif text-muted-foreground">
                      {format(new Date(media.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {media.usedInPosts && media.usedInPosts.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                      Used in {media.usedInPosts.length}{" "}
                      {media.usedInPosts.length === 1 ? "post" : "posts"}
                    </label>
                    <div className="space-y-2">
                      {media.usedInPosts.map((post) => (
                        <div
                          key={post.id}
                          className="p-2 border border-border bg-white rounded-sm"
                        >
                          <p className="font-serif text-sm font-bold truncate">
                            {post.title || "Untitled"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="uppercase tracking-wider">
                              {post.status}
                            </span>
                            {post.scheduledAt && (
                              <>
                                {" "}
                                ·{" "}
                                {format(
                                  new Date(post.scheduledAt),
                                  "MMM d, yyyy"
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 mt-auto">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Media
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="font-serif text-muted-foreground italic">
                Media not found
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Delete Media
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Are you sure you want to delete this media? This action cannot be
              undone.
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
              {deleteMedia.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
