// components/post-editor/modals/media-room-modal.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import { useMediaList } from "@/lib/hooks/use-media";
import MediaFolderBar from "@/components/media-room/media-folder-bar";
import MediaToolbar from "@/components/media-room/media-toolbar";
import MediaGrid from "@/components/media-room/media-grid";
import { useFolderActions } from "@/components/media-room/folder-actions";
import type { MediaItem, MediaFilters, MediaFolder } from "@/lib/types/media";

interface MediaRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSelection: (selectedMedia: MediaItem[]) => void;
  preSelectedIds?: Set<string>;
}

export default function MediaRoomModal({
  isOpen,
  onClose,
  onConfirmSelection,
  preSelectedIds = new Set(),
}: MediaRoomModalProps) {
  const selectedIds = useMediaRoomStore((s) => s.selectedIds);
  const clearSelection = useMediaRoomStore((s) => s.clearSelection);
  const selectItem = useMediaRoomStore((s) => s.selectItem);
  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const searchQuery = useMediaRoomStore((s) => s.searchQuery);
  const typeFilter = useMediaRoomStore((s) => s.typeFilter);
  const selectedTagIds = useMediaRoomStore((s) => s.selectedTagIds);
  const showUsedOnly = useMediaRoomStore((s) => s.showUsedOnly);
  const showUnusedOnly = useMediaRoomStore((s) => s.showUnusedOnly);
  const sortBy = useMediaRoomStore((s) => s.sortBy);
  const sortOrder = useMediaRoomStore((s) => s.sortOrder);

  const [folderToRename, setFolderToRename] = useState<MediaFolder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<MediaFolder | null>(null);

  const { FolderActionDialogs } = useFolderActions();

  const filters = useMemo<MediaFilters>(() => {
    const f: MediaFilters = {
      sortBy,
      order: sortOrder,
      limit: 1000,
    };

    if (currentFolderId) {
      f.folderId = currentFolderId;
    } else {
      f.rootOnly = true;
    }

    if (searchQuery.trim()) {
      f.search = searchQuery.trim();
    }

    if (typeFilter !== "all") {
      f.type = typeFilter;
    }

    if (selectedTagIds.length > 0) {
      f.tagIds = selectedTagIds;
    }

    if (showUsedOnly) {
      f.isUsed = true;
    }

    if (showUnusedOnly) {
      f.isUnused = true;
    }

    return f;
  }, [
    currentFolderId,
    searchQuery,
    typeFilter,
    selectedTagIds,
    showUsedOnly,
    showUnusedOnly,
    sortBy,
    sortOrder,
  ]);

  const { data } = useMediaList(filters);
  const allMediaItems = useMemo(
    () => data?.pages.flatMap((page: any) => page.data) || [],
    [data]
  );

  useEffect(() => {
    if (isOpen && preSelectedIds.size > 0) {
      preSelectedIds.forEach((id) => {
        selectItem(id, false, true);
      });
    }
  }, [isOpen, preSelectedIds, selectItem]);

  useEffect(() => {
    if (!isOpen) {
      clearSelection();
    }
  }, [isOpen, clearSelection]);

  const handleConfirm = () => {
    const selectedMedia = Array.from(selectedIds)
      .map((id) => allMediaItems.find((item) => item.id === id))
      .filter((item): item is MediaItem => !!item);

    onConfirmSelection(selectedMedia);
    onClose();
  };

  const handleCancel = () => {
    clearSelection();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] sm:max-w-[95vw] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-serif font-bold">
              Select Media from Library
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selected
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          <MediaFolderBar
            onRenameFolder={setFolderToRename}
            onDeleteFolder={setFolderToDelete}
          />

          <div className="py-4">
            <MediaToolbar />
          </div>

          <div className="flex-1 overflow-y-auto">
            <MediaGrid />
          </div>
        </div>

        <FolderActionDialogs
          isCreateOpen={false}
          onCloseCreate={() => {}}
          folderToRename={folderToRename}
          onCloseRename={() => setFolderToRename(null)}
          folderToDelete={folderToDelete}
          onCloseDelete={() => setFolderToDelete(null)}
        />

        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Add {selectedIds.size} {selectedIds.size === 1 ? "Item" : "Items"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
