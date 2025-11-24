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
import { useFolderActions } from "./folder-actions";

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
  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2 text-sm font-serif whitespace-nowrap transition-all border rounded-t-sm mb-2",
        isActive
          ? "bg-brand-primary text-brand-primary-foreground border-brand-primary z-10"
          : "bg-white text-neutral-500 border-neutral-300 hover:text-neutral-900 hover:border-neutral-500"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-serif hover:bg-neutral-100 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Rename
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-serif text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </PopoverContent>
        </Popover>
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

  const { openRenameDialog, openDeleteDialog, FolderActionDialogs } =
    useFolderActions({ integrationId });

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
              onEdit={() => openRenameDialog(folder)}
              onDelete={() => openDeleteDialog(folder)}
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

      <FolderActionDialogs />
    </div>
  );
}
