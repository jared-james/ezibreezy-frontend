// components/media-room/media-folder-bar.tsx

"use client";

import { useState, useRef } from "react";
import {
  Folder,
  FolderOpen,
  Home,
  Plus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useFolderList,
  useCreateFolder,
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
        "group relative flex items-center gap-2 px-3 py-2 text-sm font-serif whitespace-nowrap transition-all rounded-sm border",
        isActive
          ? "bg-foreground text-background border-foreground"
          : "bg-surface text-muted-foreground border-border hover:text-foreground hover:border-foreground/50",
        isOver && !isActive && "border-brand-primary border-dashed bg-brand-primary/5"
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
                isActive ? "hover:bg-white/20" : "hover:bg-black/10"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 p-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-serif rounded-sm hover:bg-surface-hover transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Rename
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-serif text-error rounded-sm hover:bg-error/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </PopoverContent>
        </Popover>
      )}

      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-brand-primary rounded-sm pointer-events-none" />
      )}
    </div>
  );
}

export default function MediaFolderBar({ integrationId }: MediaFolderBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: folders = [], isLoading } = useFolderList(integrationId, "root");

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);

  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingFolder, setDeletingFolder] = useState<MediaFolder | null>(null);

  const createFolder = useCreateFolder(integrationId);
  const renameFolder = useRenameFolder(integrationId);
  const deleteFolder = useDeleteFolder(integrationId);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder.mutate(
      { name: newFolderName.trim(), parentId: currentFolderId || undefined },
      {
        onSuccess: () => {
          setNewFolderName("");
          setIsCreating(false);
        },
      }
    );
  };

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

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2 py-3 border-b border-border">
      {/* Scroll left button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={scrollLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable folder tabs */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* All Media (root) */}
        <DroppableFolderTab
          folder={null}
          isActive={currentFolderId === null}
          onSelect={() => setCurrentFolder(null)}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>All Media</span>
        </DroppableFolderTab>

        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
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

      {/* Scroll right button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={scrollRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* New folder button with popover */}
      <Popover open={isCreating} onOpenChange={setIsCreating}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 p-3">
          <div className="space-y-3">
            <p className="eyebrow">Create Folder</p>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full px-3 py-2 text-sm font-serif border border-border rounded-sm bg-surface focus:outline-none focus:ring-2 focus:ring-ring/40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewFolderName("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleCreateFolder}
                disabled={createFolder.isPending || !newFolderName.trim()}
                className="flex-1"
              >
                {createFolder.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewFolderName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Rename dialog */}
      <AlertDialog open={!!editingFolder} onOpenChange={() => setEditingFolder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Rename Folder</AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Enter a new name for &ldquo;{editingFolder?.name}&rdquo;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full px-3 py-2 text-sm font-serif border border-border rounded-sm bg-surface focus:outline-none focus:ring-2 focus:ring-ring/40"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameFolder();
            }}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRenameFolder}
              disabled={renameFolder.isPending || !editingName.trim()}
              className="bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover"
            >
              {renameFolder.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deletingFolder} onOpenChange={() => setDeletingFolder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete Folder</AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Are you sure you want to delete &ldquo;{deletingFolder?.name}&rdquo;? Media inside will be moved
              to the root folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-error text-error-foreground hover:bg-error/90"
            >
              {deleteFolder.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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
