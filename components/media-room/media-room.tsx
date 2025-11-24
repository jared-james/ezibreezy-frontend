// components/media-room/media-room.tsx

"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import { useBulkMoveMedia } from "@/lib/hooks/use-media";
import MediaFolderBar from "./media-folder-bar";
import MediaToolbar from "./media-toolbar";
import MediaGrid from "./media-grid";
import MediaDetailPanel from "./media-detail-panel";
import BulkActionBar from "./bulk-action-bar";
import MediaUploadZone from "./media-upload-zone";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import type { MediaItem } from "@/lib/api/media";

// Overlay component shown during drag
function MediaCardOverlay({ item }: { item: MediaItem }) {
  const isVideo = item.type.startsWith("video/");

  return (
    <div className="w-24 h-24 bg-surface border-2 border-brand-primary rounded-sm shadow-xl overflow-hidden">
      {item.thumbnailUrl || item.url ? (
        <img
          src={item.thumbnailUrl || item.url}
          alt={item.filename}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      {isVideo && (
        <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/70 text-white text-[8px] font-bold uppercase rounded">
          Video
        </div>
      )}
    </div>
  );
}

export default function MediaRoom() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState<MediaItem | null>(null);

  const detailPanelMediaId = useMediaRoomStore((s) => s.detailPanelMediaId);
  const reset = useMediaRoomStore((s) => s.reset);

  // Get client data including connections
  const { data: clientData, isLoading: isLoadingClientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: 60000,
  });

  // Use first connection's ID as integrationId
  const integrationId = clientData?.connections?.[0]?.id || null;

  // Bulk move mutation for drag-and-drop
  const bulkMove = useBulkMoveMedia(integrationId);

  // Configure drag sensors with distance threshold to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Reset store on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "media") {
      setActiveDragItem(active.data.current.item as MediaItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    // Check if dropped on a folder
    if (
      active.data.current?.type === "media" &&
      over.data.current?.type === "folder"
    ) {
      const mediaId = active.data.current.mediaId as string;
      const targetFolderId = over.data.current.folderId as string | null;

      // Move the media to the folder
      bulkMove.mutate({
        mediaIds: [mediaId],
        folderId: targetFolderId,
      });
    }
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        {/* Header - matching Calendar/Editorial style */}
        <div className="border-b-4 border-double border-foreground pb-6 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-2">Assets</p>
              <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
                Media Room
              </h1>
            </div>
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

        {/* Folder bar - horizontal tabs with drop zones */}
        <MediaFolderBar integrationId={integrationId} />

        {/* Toolbar */}
        <div className="py-4">
          <MediaToolbar integrationId={integrationId} />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pb-6">
          <MediaGrid integrationId={integrationId} />
        </div>

        {/* Detail panel */}
        {detailPanelMediaId && <MediaDetailPanel integrationId={integrationId} />}

        {/* Bulk action bar */}
        <BulkActionBar integrationId={integrationId} />

        {/* Upload modal */}
        <MediaUploadZone
          integrationId={integrationId}
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDragItem ? <MediaCardOverlay item={activeDragItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
