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
import { Button } from "@/components/ui/button";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import {
  useBulkDeleteMedia,
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

interface BulkActionBarProps {
  integrationId: string | null;
}

export default function BulkActionBar({ integrationId }: BulkActionBarProps) {
  const selectedIds = useMediaRoomStore((s) => s.selectedIds);
  const clearSelection = useMediaRoomStore((s) => s.clearSelection);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const bulkDelete = useBulkDeleteMedia(integrationId);
  const bulkMove = useBulkMoveMedia(integrationId);
  const bulkTag = useBulkTagMedia(integrationId);
  const { data: tags = [] } = useTagList(integrationId);
  const { data: folders = [] } = useFolderList(integrationId, "root");

  const selectedCount = selectedIds.size;
  const selectedArray = Array.from(selectedIds);

  if (selectedCount === 0) return null;

  const handleDelete = () => {
    bulkDelete.mutate(selectedArray, {
      onSuccess: () => {
        clearSelection();
        setShowDeleteConfirm(false);
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
    bulkDelete.isPending || bulkMove.isPending || bulkTag.isPending;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-brand-primary text-brand-primary-foreground px-6 py-4 shadow-2xl border-2 border-brand-primary rounded-sm">
          {/* Selection count */}
          <div className="flex items-center gap-3 pr-4 border-r-2 border-brand-primary-foreground/30">
            <span className="font-serif text-base font-bold uppercase tracking-wide">
              {selectedCount} selected
            </span>
            <button
              onClick={clearSelection}
              className="p-1.5 hover:bg-brand-primary-foreground/20 rounded-sm transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Move to folder */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowFolderDropdown(!showFolderDropdown);
                  setShowTagDropdown(false);
                }}
                disabled={isLoading}
                className="gap-2 text-brand-primary-foreground hover:text-brand-primary-foreground hover:bg-brand-primary-foreground/20 border border-brand-primary-foreground/30 hover:border-brand-primary-foreground/50 px-4 py-2 h-auto font-medium"
              >
                <FolderInput className="h-4 w-4" />
                Move
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              {showFolderDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-background text-foreground border border-border shadow-lg max-h-64 overflow-y-auto rounded-sm">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleMoveToFolder(null)}
                      className="w-full px-2 py-1.5 text-left text-sm font-serif hover:bg-surface-hover transition-colors rounded-sm"
                    >
                      All Media (Root folder)
                    </button>
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => handleMoveToFolder(folder.id)}
                        className="w-full px-2 py-1.5 text-left text-sm font-serif hover:bg-surface-hover transition-colors rounded-sm"
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTagDropdown(!showTagDropdown);
                  setShowFolderDropdown(false);
                }}
                disabled={isLoading}
                className="gap-2 text-brand-primary-foreground hover:text-brand-primary-foreground hover:bg-brand-primary-foreground/20 border border-brand-primary-foreground/30 hover:border-brand-primary-foreground/50 px-4 py-2 h-auto font-medium"
              >
                <Tag className="h-4 w-4" />
                Tag
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              {showTagDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-background text-foreground border border-border shadow-lg max-h-64 overflow-y-auto rounded-sm">
                  {tags.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground font-serif italic">
                      No tags available
                    </p>
                  ) : (
                    <div className="p-2 space-y-1">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleAddTag(tag.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm font-serif hover:bg-surface-hover transition-colors rounded-sm"
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
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

            {/* Delete */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="gap-2 bg-red-600 text-white hover:bg-red-700 border-0 px-4 py-2 h-auto font-medium"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>

            {isLoading && (
              <div className="pl-3 ml-3 border-l-2 border-brand-primary-foreground/30">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Delete {selectedCount} Items
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Are you sure you want to delete {selectedCount} media{" "}
              {selectedCount === 1 ? "item" : "items"}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error text-error-foreground hover:bg-error-hover"
            >
              {bulkDelete.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete All"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
