// components/media-room/media-detail-panel.tsx

"use client";

import { useState } from "react";
import {
  X,
  Download,
  Loader2,
  Tag,
  Folder,
  Calendar,
  FileType,
  Maximize2,
  Plus,
  ChevronDown,
  HardDrive,
  Scaling,
  Save,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useMediaItem,
  useUpdateMedia,
  useArchiveMedia,
  useTagList,
  useAttachTags,
  useDetachTags,
  useFolderList,
} from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import type { MediaItemWithUsage } from "@/lib/types/media";
import { getMediaDownloadUrlAction } from "@/app/actions/media";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
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
  DialogDescription,
} from "@/components/ui/dialog";

interface MediaDetailPanelProps {}

export default function MediaDetailPanel({}: MediaDetailPanelProps) {
  const mediaId = useMediaRoomStore((s) => s.detailPanelMediaId);
  const closeDetailPanel = useMediaRoomStore((s) => s.closeDetailPanel);

  const { data: media, isLoading } = useMediaItem(mediaId);

  return (
    <Dialog
      open={!!mediaId}
      onOpenChange={(open: boolean) => !open && closeDetailPanel()}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0 border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm bg-surface">
        <DialogHeader className="sr-only">
          <DialogTitle>Media Details</DialogTitle>
          <DialogDescription>
            View and edit media information.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : media ? (
          <MediaItemEditor
            key={media.id}
            media={media}
            onClose={closeDetailPanel}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="font-serif text-muted-foreground italic">
              Media not found
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface MediaItemEditorProps {
  media: MediaItemWithUsage;
  onClose: () => void;
}

function MediaItemEditor({
  media,
  onClose,
}: MediaItemEditorProps) {
  const [filename, setFilename] = useState(media.filename);
  const [altText, setAltText] = useState(media.altText || "");

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: tags = [] } = useTagList();
  const { data: folders = [] } = useFolderList("root");

  const updateMedia = useUpdateMedia();
  const archiveMedia = useArchiveMedia();
  const attachTags = useAttachTags();
  const detachTags = useDetachTags();

  const hasChanges =
    filename !== media.filename || altText !== (media.altText || "");

  const handleSave = () => {
    const updates: { filename?: string; altText?: string } = {};
    if (filename !== media.filename) updates.filename = filename;
    if (altText !== (media.altText || "")) updates.altText = altText;

    if (Object.keys(updates).length > 0) {
      updateMedia.mutate({ id: media.id, data: updates });
    }
  };

  const { currentWorkspace } = useWorkspaceStore();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (media.isArchived || !currentWorkspace) return;

    setIsDownloading(true);
    try {
      const result = await getMediaDownloadUrlAction(media.id, currentWorkspace.id);
      if (!result.success) throw new Error(result.error);

      const link = document.createElement("a");
      link.href = result.data!.downloadUrl;
      link.download = media.filename || "download";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error("Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleArchive = () => {
    archiveMedia.mutate(media.id, {
      onSuccess: () => {
        setShowArchiveConfirm(false);
      },
    });
  };

  const handleMoveToFolder = (folderId: string | null) => {
    updateMedia.mutate({ id: media.id, data: { folderId } });
    setShowFolderDropdown(false);
  };

  const handleToggleTag = (tagId: string) => {
    const hasTag = media.tags.some((t) => t.id === tagId);
    if (hasTag) {
      detachTags.mutate({ mediaId: media.id, tagIds: [tagId] });
    } else {
      attachTags.mutate({ mediaId: media.id, tagIds: [tagId] });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0 && media.isArchived) return "Archived";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isVideo = media.type.startsWith("video/");

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-surface">
      {/* 1. Header & Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold uppercase tracking-tight">
            Media Details
          </h2>
          {media.isArchived && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-sm border border-neutral-200">
              Archived
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || media.isArchived}
            className="btn btn-outline h-8 px-3"
            title={media.isArchived ? "Original file is archived" : "Download"}
          >
            {isDownloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Archive Button */}
          {!media.isArchived && (
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="btn btn-outline border-error/20 text-error hover:bg-error/5 h-8 px-3"
            >
              <Archive className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Archive</span>
            </button>
          )}

          <button onClick={onClose} className="btn btn-icon ml-2 h-8 w-8">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Media Preview */}
      <div className="relative w-full bg-[#f4f4f0] flex items-center justify-center shrink-0 h-[40vh] border-b border-border group overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative w-full h-full flex items-center justify-center p-8 z-10">
          {media.isArchived ? (
            <div className="relative max-w-full max-h-full">
              <img
                src={media.url}
                alt={media.altText || media.filename}
                className="max-w-full max-h-full object-contain shadow-sm rounded-sm opacity-50 grayscale"
              />
            </div>
          ) : isVideo ? (
            <video
              src={media.url}
              controls
              className="max-w-full max-h-full object-contain shadow-lg rounded-sm border-4 border-white"
            />
          ) : (
            <img
              src={media.url}
              alt={media.altText || media.filename}
              className="max-w-full max-h-full object-contain shadow-lg rounded-sm border-4 border-white"
            />
          )}
        </div>

        {!media.isArchived && (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 p-2 bg-white text-foreground border border-border rounded-sm hover:bg-surface-hover transition-all shadow-sm opacity-0 group-hover:opacity-100 duration-200"
            title="Open full size"
          >
            <Maximize2 className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* 3. Technical Specs Strip */}
      <div className="px-6 py-3 bg-white border-b border-border flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileType className="h-3.5 w-3.5" />
          <span>{media.type.split("/")[1] || "FILE"}</span>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="h-3.5 w-3.5" />
          <span>{formatFileSize(media.fileSize)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Scaling className="h-3.5 w-3.5" />
          <span>
            {media.width} × {media.height} px
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(new Date(media.createdAt), "MMM d, yyyy")}</span>
        </div>
      </div>

      {/* 4. Main Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface">
        {/* Row: Filename & Alt Text */}
        <div className="space-y-6 pb-6 border-b border-border">
          <div className="space-y-2">
            <label className="eyebrow">Filename</label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="font-serif text-sm h-10 bg-background border-border focus:border-foreground rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="eyebrow">Alt Text (Accessibility)</label>
            <Textarea
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              rows={3}
              placeholder="Describe this media..."
              className="resize-none font-serif text-sm bg-background border-border focus:border-foreground rounded-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!hasChanges || updateMedia.isPending}
              className="btn btn-primary"
            >
              {updateMedia.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateMedia.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Row: Organization (Folder & Tags) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Folder */}
          <div className="space-y-3">
            <label className="eyebrow flex items-center gap-2">
              <Folder className="h-3.5 w-3.5" />
              Location
            </label>
            <div className="relative">
              <button
                onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-border bg-background hover:border-foreground transition-colors text-left text-sm font-serif rounded-sm"
              >
                <span>{media.folder?.name || "All Media (Root)"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {showFolderDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-foreground shadow-xl z-50 max-h-60 overflow-y-auto rounded-sm animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => handleMoveToFolder(null)}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm font-serif transition-colors rounded-sm flex items-center gap-2",
                        !media.folderId
                          ? "bg-brand-primary text-brand-primary-foreground"
                          : "hover:bg-surface-hover"
                      )}
                    >
                      <Folder className="h-3.5 w-3.5 opacity-50" />
                      All Media (Root)
                    </button>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => handleMoveToFolder(folder.id)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm font-serif transition-colors rounded-sm flex items-center gap-2",
                          media.folderId === folder.id
                            ? "bg-brand-primary text-brand-primary-foreground"
                            : "hover:bg-surface-hover"
                        )}
                      >
                        <Folder className="h-3.5 w-3.5 opacity-50" />
                        {folder.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="eyebrow flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="text-[10px] font-bold uppercase tracking-wider text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Tag
                </button>
                {showTagDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-foreground shadow-xl z-50 max-h-60 overflow-y-auto rounded-sm animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1 space-y-0.5">
                      {tags.length === 0 ? (
                        <p className="p-3 text-sm text-muted-foreground font-serif italic text-center">
                          No tags created yet.
                        </p>
                      ) : (
                        tags.map((tag) => {
                          const isAttached = media.tags.some(
                            (t) => t.id === tag.id
                          );
                          return (
                            <button
                              key={tag.id}
                              onClick={() => handleToggleTag(tag.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-serif transition-colors rounded-sm",
                                isAttached
                                  ? "bg-brand-primary text-brand-primary-foreground"
                                  : "hover:bg-surface-hover"
                              )}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span className="truncate">{tag.name}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px] bg-background border border-border rounded-sm p-2">
              {media.tags.length === 0 ? (
                <span className="text-xs text-muted-foreground italic px-1 self-center font-serif">
                  No tags attached
                </span>
              ) : (
                media.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-surface border border-border shadow-sm"
                    style={{
                      color: tag.color,
                      borderColor: `${tag.color}40`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                    <button
                      onClick={() => handleToggleTag(tag.id)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Usage Info (Bottom) */}
        {media.usedInPosts && media.usedInPosts.length > 0 && (
          <div className="pt-6 border-t border-border">
            <label className="eyebrow mb-3 block">
              Usage History ({media.usedInPosts.length})
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {media.usedInPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 border border-border bg-background rounded-sm hover:border-foreground/30 transition-colors flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full shrink-0" />
                  <div className="min-w-0">
                    <p className="font-serif text-sm font-bold truncate text-foreground">
                      {post.title || "Untitled Post"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      <span className="uppercase font-bold text-[10px] tracking-wider">
                        {post.status}
                      </span>
                      {post.scheduledAt && (
                        <>
                          {" "}
                          · {format(new Date(post.scheduledAt), "MMM d, yyyy")}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Archive Confirmation Dialog */}
      <AlertDialog
        open={showArchiveConfirm}
        onOpenChange={setShowArchiveConfirm}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm bg-surface p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-bold uppercase tracking-tight">
              Archive Media?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif text-sm text-muted-foreground">
              This will delete the high-quality source file to free up storage
              space, but keep the thumbnail and database record.
              <br />
              <br />
              <strong>Note:</strong> You will not be able to use this file for
              new posts, but it will still appear in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="btn btn-outline border-border hover:bg-surface-hover">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="btn btn-primary"
            >
              {archiveMedia.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Archive"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
