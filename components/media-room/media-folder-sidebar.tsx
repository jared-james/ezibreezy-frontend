// components/media-room/media-folder-sidebar.tsx

"use client";

import { useState } from "react";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Home,
  Loader2,
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

interface MediaFolderSidebarProps {
  integrationId: string | null;
}

export default function MediaFolderSidebar({ integrationId }: MediaFolderSidebarProps) {
  const { data: folders = [], isLoading } = useFolderList(integrationId, "root");

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);
  const expandedFolderIds = useMediaRoomStore((s) => s.expandedFolderIds);
  const toggleFolderExpanded = useMediaRoomStore((s) => s.toggleFolderExpanded);

  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
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

  const handleRenameFolder = (folderId: string) => {
    if (!editingName.trim()) return;
    renameFolder.mutate(
      { id: folderId, name: editingName.trim() },
      {
        onSuccess: () => {
          setEditingFolderId(null);
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
    <div className="w-56 border-r-2 border-foreground bg-background flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <p className="eyebrow mb-2">Folders</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-3 w-3" />
          New Folder
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* Root/All Media */}
        <button
          onClick={() => setCurrentFolder(null)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
            currentFolderId === null
              ? "bg-foreground text-background font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="truncate">All Media</span>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="mt-2 space-y-0.5">
            {folders.map((folder) => (
              <FolderTreeItem
                key={folder.id}
                folder={folder}
                integrationId={integrationId}
                depth={0}
                currentFolderId={currentFolderId}
                expandedFolderIds={expandedFolderIds}
                onSelect={setCurrentFolder}
                onToggleExpand={toggleFolderExpanded}
                onEdit={(f) => {
                  setEditingFolderId(f.id);
                  setEditingName(f.name);
                }}
                onDelete={setDeletingFolder}
                editingFolderId={editingFolderId}
                editingName={editingName}
                onEditingNameChange={setEditingName}
                onSaveEdit={handleRenameFolder}
                onCancelEdit={() => {
                  setEditingFolderId(null);
                  setEditingName("");
                }}
              />
            ))}
          </div>
        )}

        {/* Create folder inline form */}
        {isCreating && (
          <div className="mt-2 p-2 border border-border rounded-sm bg-surface">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full px-2 py-1 text-sm font-serif border border-border rounded-sm bg-background focus:outline-none focus:border-foreground"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewFolderName("");
                }
              }}
            />
            <div className="flex gap-1 mt-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleCreateFolder}
                disabled={createFolder.isPending || !newFolderName.trim()}
                className="flex-1"
              >
                {createFolder.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create"}
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
        )}
      </div>

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
              className="bg-error text-error-foreground hover:bg-error-hover"
            >
              {deleteFolder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface FolderTreeItemProps {
  folder: MediaFolder;
  integrationId: string | null;
  depth: number;
  currentFolderId: string | null;
  expandedFolderIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onEdit: (folder: MediaFolder) => void;
  onDelete: (folder: MediaFolder) => void;
  editingFolderId: string | null;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
}

function FolderTreeItem({
  folder,
  integrationId,
  depth,
  currentFolderId,
  expandedFolderIds,
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  editingFolderId,
  editingName,
  onEditingNameChange,
  onSaveEdit,
  onCancelEdit,
}: FolderTreeItemProps) {
  const isExpanded = expandedFolderIds.has(folder.id);
  const isSelected = currentFolderId === folder.id;
  const isEditing = editingFolderId === folder.id;
  const [showActions, setShowActions] = useState(false);

  const { data: children = [] } = useFolderList(
    isExpanded ? integrationId : null,
    folder.id
  );

  const hasChildren = children.length > 0;

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 py-1" style={{ paddingLeft: `${depth * 12 + 8}px` }}>
        <input
          type="text"
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm font-serif border border-border rounded-sm bg-background focus:outline-none focus:border-foreground"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveEdit(folder.id);
            if (e.key === "Escape") onCancelEdit();
          }}
        />
        <Button size="sm" variant="ghost" onClick={() => onSaveEdit(folder.id)} className="h-7 px-2">
          Save
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 pr-1 cursor-pointer transition-colors rounded-sm",
          isSelected
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(folder.id);
          }}
          className={cn(
            "p-0.5 hover:bg-black/10 rounded transition-transform",
            isExpanded && "rotate-90"
          )}
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        <button
          onClick={() => onSelect(folder.id)}
          className="flex-1 flex items-center gap-2 text-left min-w-0"
        >
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" />
          )}
          <span className="text-sm font-serif truncate">{folder.name}</span>
        </button>

        {showActions && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(folder);
              }}
              className={cn(
                "p-1 rounded hover:bg-black/10",
                isSelected && "hover:bg-white/20"
              )}
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder);
              }}
              className={cn(
                "p-1 rounded hover:bg-black/10",
                isSelected && "hover:bg-white/20"
              )}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              integrationId={integrationId}
              depth={depth + 1}
              currentFolderId={currentFolderId}
              expandedFolderIds={expandedFolderIds}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              editingFolderId={editingFolderId}
              editingName={editingName}
              onEditingNameChange={onEditingNameChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
