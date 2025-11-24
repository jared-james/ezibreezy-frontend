// components/media-room/media-folder-bar.tsx

"use client";

import { useState } from "react";
import {
  Folder,
  FolderOpen,
  Home,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useFolderList,
  useRenameFolder,
  useDeleteFolder,
} from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import type { MediaFolder } from "@/lib/api/media";
import { useDroppable } from "@dnd-kit/core";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 as Spinner } from "lucide-react";

interface MediaFolderBarProps {
  integrationId: string | null;
}

interface DroppableFolderTabProps {
  folder: MediaFolder | null;
  isActive: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

function DroppableFolderTab({
  folder,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  children,
}: DroppableFolderTabProps) {
  const droppableId = folder ? `folder-${folder.id}` : "folder-root";

  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: {
      type: "folder",
      folderId: folder?.id || null,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2 text-sm font-serif whitespace-nowrap transition-all border rounded-t-sm mb-2",
        isActive
          ? "bg-brand-primary text-brand-primary-foreground border-brand-primary z-10"
          : "bg-white text-neutral-500 border-neutral-300 hover:text-neutral-900 hover:border-neutral-500",
        isOver &&
          !isActive &&
          "border-dashed border-brand-primary bg-brand-primary/5"
      )}
    >
      <button onClick={onSelect} className="flex items-center gap-2">
        {children}
      </button>

      {folder && (onEdit || onDelete) && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                isActive ? "hover:bg-white/20" : "hover:bg-neutral-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-32 p-1 bg-white border border-neutral-300"
          >
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-serif hover:bg-neutral-100 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Rename
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-serif text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </PopoverContent>
        </Popover>
      )}

      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-brand-primary pointer-events-none" />
      )}
    </div>
  );
}

export default function MediaFolderBar({ integrationId }: MediaFolderBarProps) {
  const { data: folders = [], isLoading } = useFolderList(
    integrationId,
    "root"
  );

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);

  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingFolder, setDeletingFolder] = useState<MediaFolder | null>(
    null
  );

  const renameFolder = useRenameFolder(integrationId);
  const deleteFolder = useDeleteFolder(integrationId);

  const handleRenameFolder = () => {
    if (!editingFolder || !editingName.trim()) return;
    renameFolder.mutate(
      { id: editingFolder.id, name: editingName.trim() },
      {
        onSuccess: () => {
          setEditingFolder(null);
          setEditingName("");
        },
      }
    );
  };

  const handleDeleteFolder = () => {
    if (!deletingFolder) return;
    deleteFolder.mutate(deletingFolder.id, {
      onSuccess: () => {
        if (currentFolderId === deletingFolder.id) {
          setCurrentFolder(null);
        }
        setDeletingFolder(null);
      },
    });
  };

  return (
    <div className="border-b border-neutral-300">
      <div
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <DroppableFolderTab
          folder={null}
          isActive={currentFolderId === null}
          onSelect={() => setCurrentFolder(null)}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>All Media</span>
        </DroppableFolderTab>

        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-2 text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          folders.map((folder) => (
            <DroppableFolderTab
              key={folder.id}
              folder={folder}
              isActive={currentFolderId === folder.id}
              onSelect={() => setCurrentFolder(folder.id)}
              onEdit={() => {
                setEditingFolder(folder);
                setEditingName(folder.name);
              }}
              onDelete={() => setDeletingFolder(folder)}
            >
              {currentFolderId === folder.id ? (
                <FolderOpen className="h-4 w-4 shrink-0" />
              ) : (
                <Folder className="h-4 w-4 shrink-0" />
              )}
              <span>{folder.name}</span>
            </DroppableFolderTab>
          ))
        )}
      </div>

      <AlertDialog
        open={!!editingFolder}
        onOpenChange={() => setEditingFolder(null)}
      >
        <AlertDialogContent className="bg-white border-2 border-neutral-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Rename Folder
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif text-neutral-600">
              Enter a new name for &ldquo;{editingFolder?.name}&rdquo;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full px-3 py-2 text-sm font-serif border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameFolder();
            }}
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-300 hover:bg-neutral-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRenameFolder}
              disabled={renameFolder.isPending || !editingName.trim()}
              className="bg-emerald-800 text-white hover:bg-emerald-700 border-emerald-900"
            >
              {renameFolder.isPending ? (
                <Spinner className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deletingFolder}
        onOpenChange={() => setDeletingFolder(null)}
      >
        <AlertDialogContent className="bg-white border-2 border-neutral-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Delete Folder
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif text-neutral-600">
              Are you sure you want to delete &ldquo;{deletingFolder?.name}
              &rdquo;? Media inside will be moved to the root folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-300 hover:bg-neutral-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteFolder.isPending ? (
                <Spinner className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
