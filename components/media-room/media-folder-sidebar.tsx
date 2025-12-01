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
import { useFolderList, useCreateFolder } from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import type { MediaFolder } from "@/lib/api/media";
import { useFolderActions } from "./folder-actions";

interface MediaFolderSidebarProps {
  organizationId: string | null;
}

export default function MediaFolderSidebar({
  organizationId,
}: MediaFolderSidebarProps) {
  const { data: folders = [], isLoading } = useFolderList(
    organizationId,
    "root"
  );

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);
  const expandedFolderIds = useMediaRoomStore((s) => s.expandedFolderIds);
  const toggleFolderExpanded = useMediaRoomStore((s) => s.toggleFolderExpanded);

  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const createFolder = useCreateFolder(organizationId);

  // Use shared actions for Rename and Delete
  const { openRenameDialog, openDeleteDialog, FolderActionDialogs } =
    useFolderActions({ organizationId });

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
    <div className="w-64 border-r border-border bg-surface flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">Folders</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn btn-outline w-full justify-start gap-2 h-9"
        >
          <Plus className="h-3.5 w-3.5" />
          New Folder
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* Root/All Media */}
        <button
          onClick={() => setCurrentFolder(null)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-serif transition-colors rounded-sm",
            currentFolderId === null
              ? "bg-brand-primary text-brand-primary-foreground font-medium"
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
          <div className="space-y-0.5">
            {folders.map((folder) => (
              <FolderTreeItem
                key={folder.id}
                folder={folder}
                organizationId={organizationId}
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
          <div className="mt-2 p-3 border border-border rounded-sm bg-background shadow-sm">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full px-2 py-1.5 text-sm font-serif border border-border rounded-sm bg-surface focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewFolderName("");
                }
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreateFolder}
                disabled={createFolder.isPending || !newFolderName.trim()}
                className="btn btn-primary h-7 text-xs flex-1"
              >
                {createFolder.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewFolderName("");
                }}
                className="btn btn-outline h-7 text-xs"
              >
                Cancel
              </button>
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
  organizationId: string | null;
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
  organizationId,
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
    isExpanded ? organizationId : null,
    folder.id
  );

  const hasChildren = children.length > 0;

  // Unified click handler: Select AND Expand if needed
  const handleMainClick = () => {
    onSelect(folder.id);
    if (!isExpanded) {
      onToggleExpand(folder.id);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 pr-1 cursor-pointer transition-colors rounded-sm select-none",
          isSelected
            ? "bg-brand-primary text-brand-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={handleMainClick} // Applied to the whole row container for bigger target
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(folder.id);
          }}
          className={cn(
            "p-0.5 rounded transition-transform hover:bg-white/10",
            isExpanded && "rotate-90",
            !hasChildren && !isSelected && "invisible" // Only hide if not selected to keep alignment, but show if selected/hovered potentially? Kept invisible for cleaner tree look.
          )}
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        <div className="flex-1 flex items-center gap-2 text-left min-w-0 py-1">
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" />
          )}
          <span className="text-sm font-serif truncate">{folder.name}</span>
        </div>

        {showActions && (
          <div className="flex items-center gap-0.5 mr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRename(folder);
              }}
              className={cn(
                "p-1 rounded opacity-70 hover:opacity-100 transition-opacity",
                isSelected ? "hover:bg-white/20" : "hover:bg-black/5"
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
                "p-1 rounded opacity-70 hover:opacity-100 transition-opacity",
                isSelected
                  ? "text-white hover:bg-white/20"
                  : "text-error hover:bg-error/10"
              )}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              organizationId={organizationId}
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
