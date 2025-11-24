// components/media-room/bulk-action-bar.tsx

"use client";

import { useState } from "react";
import { X, Trash2, FolderInput, Tag, Loader2, ChevronDown } from "lucide-react";
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

  const isLoading = bulkDelete.isPending || bulkMove.isPending || bulkTag.isPending;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 bg-foreground text-background px-4 py-3 shadow-xl border border-foreground/20">
          {/* Selection count */}
          <div className="flex items-center gap-2 pr-3 border-r border-background/20">
            <span className="font-serif text-sm font-bold">
              {selectedCount} selected
            </span>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-background/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

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
              className="gap-1.5 text-background hover:text-background hover:bg-background/20"
            >
              <FolderInput className="h-4 w-4" />
              Move
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showFolderDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-background text-foreground border border-border shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleMoveToFolder(null)}
                    className="w-full px-2 py-1.5 text-left text-sm font-serif hover:bg-surface-hover transition-colors rounded-sm"
                  >
                    Root (No folder)
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
              className="gap-1.5 text-background hover:text-background hover:bg-background/20"
            >
              <Tag className="h-4 w-4" />
              Tag
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showTagDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-background text-foreground border border-border shadow-lg max-h-64 overflow-y-auto">
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
            className="gap-1.5 text-red-300 hover:text-red-200 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>

          {isLoading && (
            <div className="pl-2 border-l border-background/20">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete {selectedCount} Items</AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Are you sure you want to delete {selectedCount} media{" "}
              {selectedCount === 1 ? "item" : "items"}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error text-error-foreground hover:bg-error-hover"
            >
              {bulkDelete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
