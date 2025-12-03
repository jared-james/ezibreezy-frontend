// components/media-room/folder-actions.tsx

"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import {
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FolderActionDialogsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  folderToRename: MediaFolder | null;
  onCloseRename: () => void;
  folderToDelete: MediaFolder | null;
  onCloseDelete: () => void;
}

export function useFolderActions() {
  console.log("🔄 useFolderActions hook called");

  const FolderActionDialogs = ({
    isCreateOpen,
    onCloseCreate,
    folderToRename,
    onCloseRename,
    folderToDelete,
    onCloseDelete,
  }: FolderActionDialogsProps) => {
    console.log("🎨 FolderActionDialogs rendering");

    const [folderName, setFolderName] = useState("");

    const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
    const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);

    const createMutation = useCreateFolder();
    const renameMutation = useRenameFolder();
    const deleteMutation = useDeleteFolder();

    const handleCreate = () => {
      if (!folderName.trim()) return;
      createMutation.mutate(
        { name: folderName.trim(), parentId: currentFolderId || undefined },
        {
          onSuccess: () => {
            setFolderName("");
            onCloseCreate();
          },
        }
      );
    };

    const handleRename = () => {
      if (!folderToRename || !folderName.trim()) return;
      renameMutation.mutate(
        { id: folderToRename.id, name: folderName.trim() },
        {
          onSuccess: () => {
            setFolderName("");
            onCloseRename();
          },
        }
      );
    };

    const handleDelete = () => {
      if (!folderToDelete) return;
      deleteMutation.mutate(folderToDelete.id, {
        onSuccess: () => {
          if (currentFolderId === folderToDelete.id) {
            setCurrentFolder(null);
          }
          onCloseDelete();
        },
      });
    };

    return (
      <>
        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          if (!open) {
            setFolderName("");
            onCloseCreate();
          }
        }}>
          <DialogContent className="sm:max-w-[425px] border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm bg-surface p-6">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold uppercase tracking-tight">
                New Folder
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={folderName}
                onChange={(e) => {
                  console.log("⌨️ Input changed:", e.target.value);
                  setFolderName(e.target.value);
                }}
                placeholder="Folder name"
                className="font-serif text-base h-11 bg-background border-border focus:border-foreground rounded-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate(folderName);
                }}
              />
            </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="btn btn-outline border-border hover:bg-surface-hover">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => handleCreate(folderName)}
              disabled={createMutation.isPending || !folderName.trim()}
              className="btn btn-primary"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Folder"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={!!folderToRename}
        onOpenChange={(open) => {
          if (!open) {
            setFolderName("");
            onCloseRename();
          } else if (folderToRename) {
            setFolderName(folderToRename.name);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm bg-surface p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold uppercase tracking-tight">
              Rename Folder
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="font-serif text-base h-11 bg-background border-border focus:border-foreground rounded-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && folderToRename) handleRename(folderToRename.id, folderName);
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="btn btn-outline border-border hover:bg-surface-hover">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => folderToRename && handleRename(folderToRename.id, folderName)}
              disabled={renameMutation.isPending || !folderName.trim()}
              className="btn btn-primary"
            >
              {renameMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!folderToDelete}
        onOpenChange={(open) => !open && onCloseDelete()}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-sm bg-surface p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-bold uppercase tracking-tight">
              Delete Folder
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif text-sm text-muted-foreground">
              Are you sure you want to delete &ldquo;{folderToDelete?.name}
              &rdquo;? Media inside will be moved to the root folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="btn btn-outline border-border hover:bg-surface-hover">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => folderToDelete && handleDelete(folderToDelete.id)}
              className="btn btn-primary bg-error text-white hover:bg-error-hover border-error-hover"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
  };

  return {
    FolderActionDialogs,
  };
}
