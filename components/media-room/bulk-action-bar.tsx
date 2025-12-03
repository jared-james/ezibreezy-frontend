// components/media-room/bulk-action-bar.tsx

"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  FolderInput,
  Tag,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import {
  useBulkArchiveMedia,
  useBulkMoveMedia,
  useBulkTagMedia,
  useTagList,
  useFolderList,
} from "@/lib/hooks/use-media";
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
import { cn } from "@/lib/utils";

interface BulkActionBarProps {}

export default function BulkActionBar({}: BulkActionBarProps) {
  const selectedIds = useMediaRoomStore((s) => s.selectedIds);
  const clearSelection = useMediaRoomStore((s) => s.clearSelection);

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const bulkArchive = useBulkArchiveMedia();
  const bulkMove = useBulkMoveMedia();
  const bulkTag = useBulkTagMedia();
  const { data: tags = [] } = useTagList();
  const { data: folders = [] } = useFolderList("root");

  const selectedCount = selectedIds.size;
  const selectedArray = Array.from(selectedIds);

  if (selectedCount === 0) return null;

  const handleArchive = () => {
    bulkArchive.mutate(selectedArray, {
      onSuccess: () => {
        clearSelection();
        setShowArchiveConfirm(false);
      },
    });
  };

  const handleMoveToFolder = (folderId: string | null) => {
    bulkMove.mutate(
      { mediaIds: selectedArray, folderId },
      {
        onSuccess: () => {
          clearSelection();
          setShowFolderDropdown(false);
        },
      }
    );
  };

  const handleAddTag = (tagId: string) => {
    bulkTag.mutate(
      { mediaIds: selectedArray, tagIds: [tagId] },
      {
        onSuccess: () => {
          setShowTagDropdown(false);
        },
      }
    );
  };

  const isLoading =
    bulkArchive.isPending || bulkMove.isPending || bulkTag.isPending;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4 bg-brand-primary text-brand-primary-foreground px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-brand-primary-hover rounded-sm">
          {/* Selection count */}
          <div className="flex items-center gap-3 pr-4 border-r border-white/20">
            <span className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              {selectedCount} selected
            </span>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-white/10 rounded-sm transition-colors text-white/80 hover:text-white"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Move to folder */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFolderDropdown(!showFolderDropdown);
                  setShowTagDropdown(false);
                }}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/30 rounded-sm hover:bg-white/10 transition-colors text-white disabled:opacity-50"
              >
                <FolderInput className="h-3.5 w-3.5" />
                Move
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </button>
              {showFolderDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-surface text-foreground border border-foreground shadow-xl max-h-64 overflow-y-auto rounded-sm p-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => handleMoveToFolder(null)}
                      className="w-full px-3 py-2 text-left text-xs font-serif font-medium hover:bg-surface-hover transition-colors rounded-sm"
                    >
                      All Media (Root folder)
                    </button>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => handleMoveToFolder(folder.id)}
                        className="w-full px-3 py-2 text-left text-xs font-serif font-medium hover:bg-surface-hover transition-colors rounded-sm"
                      >
                        {folder.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add tag */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTagDropdown(!showTagDropdown);
                  setShowFolderDropdown(false);
                }}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/30 rounded-sm hover:bg-white/10 transition-colors text-white disabled:opacity-50"
              >
                <Tag className="h-3.5 w-3.5" />
                Tag
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </button>
              {showTagDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-surface text-foreground border border-foreground shadow-xl max-h-64 overflow-y-auto rounded-sm p-1 animate-in fade-in zoom-in-95 duration-100">
                  {tags.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground font-serif italic text-center">
                      No tags available
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleAddTag(tag.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-serif font-medium hover:bg-surface-hover transition-colors rounded-sm"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="truncate">{tag.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Archive */}
            <button
              onClick={() => setShowArchiveConfirm(true)}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white border border-red-800 rounded-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Archive
            </button>

            {isLoading && (
              <div className="pl-2 ml-2 border-l border-white/20">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Archive confirmation */}
      <AlertDialog
        open={showArchiveConfirm}
        onOpenChange={setShowArchiveConfirm}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm bg-surface p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-bold uppercase tracking-tight">
              Archive {selectedCount} Items?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif text-sm text-muted-foreground">
              This will delete the high-quality source files to free up storage
              space, but keep thumbnails and database records for{" "}
              {selectedCount} {selectedCount === 1 ? "item" : "items"}.
              <br />
              <br />
              <strong>Note:</strong> You will not be able to use these files for
              new posts, but they will still appear in your history.
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
              {bulkArchive.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Archive All"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
