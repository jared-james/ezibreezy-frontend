// components/media-room/media-folder-bar.tsx

"use client";

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
import { useFolderList } from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import type { MediaFolder } from "@/lib/api/media";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface MediaFolderBarProps {
  onRenameFolder: (folder: MediaFolder) => void;
  onDeleteFolder: (folder: MediaFolder) => void;
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
  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-4 py-2 text-sm font-serif whitespace-nowrap transition-all border rounded-sm mb-2 select-none",
        isActive
          ? "bg-brand-primary text-brand-primary-foreground border-brand-primary shadow-sm z-10"
          : "bg-surface text-muted-foreground border-border hover:text-foreground hover:border-foreground/30 hover:bg-surface-hover"
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
                "ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100",
                isActive
                  ? "hover:bg-brand-primary-hover text-brand-primary-foreground"
                  : "hover:bg-neutral-200 text-foreground"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-32 p-1 bg-surface border border-foreground rounded-sm shadow-xl"
          >
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-serif hover:bg-surface-hover transition-colors rounded-sm"
              >
                <Pencil className="h-3 w-3" />
                Rename
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-serif text-error hover:bg-error/10 transition-colors rounded-sm"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default function MediaFolderBar({
  onRenameFolder,
  onDeleteFolder,
}: MediaFolderBarProps) {
  const { data: folders = [], isLoading } = useFolderList("root");

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);

  return (
    <div className="border-b border-border">
      <div
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1 pt-1"
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
          <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          folders.map((folder) => (
            <DroppableFolderTab
              key={folder.id}
              folder={folder}
              isActive={currentFolderId === folder.id}
              onSelect={() => setCurrentFolder(folder.id)}
              onEdit={() => onRenameFolder(folder)}
              onDelete={() => onDeleteFolder(folder)}
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
    </div>
  );
}
