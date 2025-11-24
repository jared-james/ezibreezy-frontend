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
import { useFolderList, useCreateFolder } from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import type { MediaFolder } from "@/lib/api/media";
import { useFolderActions } from "./folder-actions";

interface MediaFolderSidebarProps {
  integrationId: string | null;
}

export default function MediaFolderSidebar({
  integrationId,
}: MediaFolderSidebarProps) {
  const { data: folders = [], isLoading } = useFolderList(
    integrationId,
    "root"
  );

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);
  const expandedFolderIds = useMediaRoomStore((s) => s.expandedFolderIds);
  const toggleFolderExpanded = useMediaRoomStore((s) => s.toggleFolderExpanded);

  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const createFolder = useCreateFolder(integrationId);

  // Use shared actions for Rename and Delete
  const { openRenameDialog, openDeleteDialog, FolderActionDialogs } =
    useFolderActions({ integrationId });

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
                onRename={openRenameDialog}
                onDelete={openDeleteDialog}
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
                {createFolder.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
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
        )}
      </div>

      <FolderActionDialogs />
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
  onRename: (folder: MediaFolder) => void;
  onDelete: (folder: MediaFolder) => void;
}

function FolderTreeItem({
  folder,
  integrationId,
  depth,
  currentFolderId,
  expandedFolderIds,
  onSelect,
  onToggleExpand,
  onRename,
  onDelete,
}: FolderTreeItemProps) {
  const isExpanded = expandedFolderIds.has(folder.id);
  const isSelected = currentFolderId === folder.id;
  const [showActions, setShowActions] = useState(false);

  const { data: children = [] } = useFolderList(
    isExpanded ? integrationId : null,
    folder.id
  );

  const hasChildren = children.length > 0;

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
                onRename(folder);
              }}
              className={cn(
                "p-1 rounded hover:bg-black/10",
                isSelected && "hover:bg-white/20"
              )}
              title="Rename"
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
              title="Delete"
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
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
