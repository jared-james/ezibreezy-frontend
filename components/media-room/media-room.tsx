// components/media-room/media-room.tsx

"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, Plus } from "lucide-react";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

import MediaFolderBar from "./media-folder-bar";
import MediaToolbar from "./media-toolbar";
import MediaGrid from "./media-grid";
import MediaDetailPanel from "./media-detail-panel";
import BulkActionBar from "./bulk-action-bar";
import MediaUploadZone from "./media-upload-zone";
import { useFolderActions } from "./folder-actions";

interface MediaRoomProps {}

export default function MediaRoom({}: MediaRoomProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<any>(null);
  const [folderToDelete, setFolderToDelete] = useState<any>(null);

  const reset = useMediaRoomStore((s) => s.reset);
  const { currentWorkspace } = useWorkspaceStore();

  const { FolderActionDialogs } = useFolderActions();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-editorial min-h-screen">
      <div className="sticky top-0 z-30 bg-background-editorial/95 backdrop-blur-sm px-6 pt-6 pb-4 border-b-4 border-double border-foreground">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-1">Assets</p>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Media Room
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="btn btn-outline"
            >
              <Plus className="h-4 w-4" />
              New Folder
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn btn-primary"
            >
              <Upload className="h-4 w-4" />
              Upload Media
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pt-2">
        <MediaFolderBar
          onRenameFolder={setFolderToRename}
          onDeleteFolder={setFolderToDelete}
        />
      </div>

      <div className="px-6 py-4">
        <MediaToolbar />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <MediaGrid />
      </div>

      <MediaDetailPanel />
      <BulkActionBar />

      <MediaUploadZone
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <FolderActionDialogs
        isCreateOpen={isCreateDialogOpen}
        onCloseCreate={() => setIsCreateDialogOpen(false)}
        folderToRename={folderToRename}
        onCloseRename={() => setFolderToRename(null)}
        folderToDelete={folderToDelete}
        onCloseDelete={() => setFolderToDelete(null)}
      />
    </div>
  );
}
