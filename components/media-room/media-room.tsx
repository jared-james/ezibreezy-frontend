// components/media-room/media-room.tsx

"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import { useCreateFolder } from "@/lib/hooks/use-media";
import MediaFolderBar from "./media-folder-bar";
import MediaToolbar from "./media-toolbar";
import MediaGrid from "./media-grid";
import MediaDetailPanel from "./media-detail-panel";
import BulkActionBar from "./bulk-action-bar";
import MediaUploadZone from "./media-upload-zone";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MediaRoom() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const reset = useMediaRoomStore((s) => s.reset);
  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);

  const { data: clientData, isLoading: isLoadingClientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: 60000,
  });

  const integrationId = clientData?.connections?.[0]?.id || null;

  const createFolder = useCreateFolder(integrationId);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder.mutate(
      { name: newFolderName.trim(), parentId: currentFolderId || undefined },
      {
        onSuccess: () => {
          setNewFolderName("");
          setIsCreatingFolder(false);
        },
      }
    );
  };

  if (isLoadingClientData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!clientData?.connections?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md px-4">
          <div className="border-b-4 border-double border-foreground pb-4 mb-6">
            <p className="eyebrow mb-2">Media Room</p>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight">
              Connect an Account
            </h1>
          </div>
          <p className="font-serif text-muted-foreground">
            To use the Media Room, you need to connect at least one social media
            account. Visit Settings &rarr; Integrations to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
        <div className="border-b-4 border-double border-foreground pb-6 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-2">Assets</p>
              <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
                Media Room
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Popover
                open={isCreatingFolder}
                onOpenChange={setIsCreatingFolder}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    New Folder
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-64 p-3 bg-white border border-neutral-300"
                >
                  <div className="space-y-3">
                    <p className="font-serif text-xs tracking-widest uppercase text-neutral-500">
                      Create Folder
                    </p>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name..."
                      className="w-full px-3 py-2 text-sm font-serif border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder();
                        if (e.key === "Escape") {
                          setIsCreatingFolder(false);
                          setNewFolderName("");
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleCreateFolder}
                        disabled={
                          createFolder.isPending || !newFolderName.trim()
                        }
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
                          setIsCreatingFolder(false);
                          setNewFolderName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="primary"
                className="gap-2 shrink-0"
                onClick={() => setIsUploadOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Upload Media
              </Button>
            </div>
          </div>
        </div>

        <MediaFolderBar integrationId={integrationId} />

        <div className="py-4">
          <MediaToolbar integrationId={integrationId} />
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <MediaGrid integrationId={integrationId} />
        </div>

        <MediaDetailPanel integrationId={integrationId} />

        <BulkActionBar integrationId={integrationId} />

        <MediaUploadZone
          integrationId={integrationId}
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
    </div>
  );
}
