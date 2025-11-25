// components/media-room/media-room.tsx

"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { useMediaRoomStore } from "@/lib/store/media-room-store";

import MediaFolderBar from "./media-folder-bar";
import MediaToolbar from "./media-toolbar";
import MediaGrid from "./media-grid";
import MediaDetailPanel from "./media-detail-panel";
import BulkActionBar from "./bulk-action-bar";
import MediaUploadZone from "./media-upload-zone";
import { useFolderActions } from "./folder-actions";
import { Button } from "@/components/ui/button";

interface MediaRoomProps {
  preloadedIntegrationId?: string | null;
}

export default function MediaRoom({ preloadedIntegrationId }: MediaRoomProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const reset = useMediaRoomStore((s) => s.reset);

  const { data: clientData, isLoading: isLoadingClientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: 60000,
    // If we have a preloaded ID, we don't strictly need this to be blocking,
    // but we fetch it to ensure we have the full connection list/details if needed later.
  });

  // Prefer preloaded ID (instant), fallback to client fetched data
  const integrationId =
    preloadedIntegrationId || clientData?.connections?.[0]?.id || null;

  // Hook up shared actions
  const { openCreateDialog, FolderActionDialogs } = useFolderActions({
    integrationId,
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Only block with a loader if we have NO ID and are still waiting for client data
  if (isLoadingClientData && !integrationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If we loaded and still have no connections/ID
  if (!isLoadingClientData && !integrationId) {
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
            <Button
              variant="outline"
              className="gap-2 shrink-0"
              onClick={openCreateDialog}
            >
              <Plus className="h-4 w-4" />
              New Folder
            </Button>

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

      {/* Global Modals & Panels */}
      <MediaDetailPanel integrationId={integrationId} />
      <BulkActionBar integrationId={integrationId} />
      <MediaUploadZone
        integrationId={integrationId}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
      <FolderActionDialogs />
    </div>
  );
}
