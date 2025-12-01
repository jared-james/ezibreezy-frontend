// components/media-room/folder-actions.tsx

"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UseFolderActionsProps {
  organizationId: string | null;
}

export function useFolderActions({ organizationId }: UseFolderActionsProps) {
  // State for dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<MediaFolder | null>(
    null
  );
  const [folderToDelete, setFolderToDelete] = useState<MediaFolder | null>(
    null
  );

  // Form inputs
  const [folderName, setFolderName] = useState("");

  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const setCurrentFolder = useMediaRoomStore((s) => s.setCurrentFolder);

  const createMutation = useCreateFolder(organizationId);
  const renameMutation = useRenameFolder(organizationId);
  const deleteMutation = useDeleteFolder(organizationId);

  // Reset input when any dialog opens
  useEffect(() => {
    if (isCreateOpen) setFolderName("");
    if (folderToRename) setFolderName(folderToRename.name);
  }, [isCreateOpen, folderToRename]);

  // Handlers
  const handleCreate = () => {
    if (!folderName.trim()) return;
    createMutation.mutate(
      { name: folderName.trim(), parentId: currentFolderId || undefined },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setFolderName("");
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
          setFolderToRename(null);
          setFolderName("");
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
        setFolderToDelete(null);
      },
    });
  };

  const FolderActionDialogs = () => (
    <>
      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif">New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="font-serif"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !folderName.trim()}
              variant="primary"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Folder"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={!!folderToRename}
        onOpenChange={(open) => !open && setFolderToRename(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif">Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="font-serif"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleRename}
              disabled={renameMutation.isPending || !folderName.trim()}
              variant="primary"
            >
              {renameMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!folderToDelete}
        onOpenChange={(open) => !open && setFolderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Delete Folder
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              Are you sure you want to delete &ldquo;{folderToDelete?.name}
              &rdquo;? Media inside will be moved to the root folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error text-error-foreground hover:bg-error-hover"
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

  return {
    openCreateDialog: () => setIsCreateOpen(true),
    openRenameDialog: setFolderToRename,
    openDeleteDialog: setFolderToDelete,
    FolderActionDialogs,
  };
}
