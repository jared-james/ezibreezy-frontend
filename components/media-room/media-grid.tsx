// components/media-room/media-grid.tsx

"use client";

import { useMemo, useEffect, useRef } from "react";
import { Loader2, ImageOff } from "lucide-react";
import { useMediaList } from "@/lib/hooks/use-media";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import type { MediaFilters } from "@/lib/api/media";
import MediaCard from "./media-card";
import MediaListItem from "./media-list-item";

interface MediaGridProps {
  integrationId: string | null;
}

export default function MediaGrid({ integrationId }: MediaGridProps) {
  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const searchQuery = useMediaRoomStore((s) => s.searchQuery);
  const typeFilter = useMediaRoomStore((s) => s.typeFilter);
  const selectedTagIds = useMediaRoomStore((s) => s.selectedTagIds);
  const showUsedOnly = useMediaRoomStore((s) => s.showUsedOnly);
  const showUnusedOnly = useMediaRoomStore((s) => s.showUnusedOnly);
  const sortBy = useMediaRoomStore((s) => s.sortBy);
  const sortOrder = useMediaRoomStore((s) => s.sortOrder);
  const selectItem = useMediaRoomStore((s) => s.selectItem);
  const openDetailPanel = useMediaRoomStore((s) => s.openDetailPanel);
  const viewMode = useMediaRoomStore((s) => s.viewMode);

  // Intersection Observer Target for Infinite Scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  const filters = useMemo<MediaFilters>(() => {
    // EXPLICITLY set the limit here
    const f: MediaFilters = {
      sortBy,
      order: sortOrder,
      limit: 50, // <--- ADDED: Forces API to respect limit
    };

    if (currentFolderId) {
      f.folderId = currentFolderId;
    } else {
      f.rootOnly = true;
    }

    if (searchQuery.trim()) {
      f.search = searchQuery.trim();
    }

    if (typeFilter !== "all") {
      f.type = typeFilter;
    }

    if (selectedTagIds.length > 0) {
      f.tagIds = selectedTagIds;
    }

    if (showUsedOnly) {
      f.isUsed = true;
    }

    if (showUnusedOnly) {
      f.isUnused = true;
    }

    return f;
  }, [
    currentFolderId,
    searchQuery,
    typeFilter,
    selectedTagIds,
    showUsedOnly,
    showUnusedOnly,
    sortBy,
    sortOrder,
  ]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMediaList(integrationId, filters);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-error bg-error/5 p-6 text-center">
        <p className="font-serif text-sm text-error">
          Error loading media: {error?.message}
        </p>
      </div>
    );
  }

  // Flatten the pages from Infinite Query
  const mediaItems = data?.pages.flatMap((page) => page.data) || [];

  if (mediaItems.length === 0) {
    return (
      <div className="py-16 text-center border-2 border-dashed border-border rounded-lg">
        <ImageOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-serif text-lg text-muted-foreground italic">
          No media found
        </p>
        <p className="font-serif text-sm text-muted-foreground mt-1">
          Upload some files or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {mediaItems.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              integrationId={integrationId}
              onSelect={selectItem}
              onOpenDetail={openDetailPanel}
              // Prioritize loading the first 12 images (approx. one full screen)
              priority={index < 12}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mediaItems.map((item, index) => (
            <MediaListItem
              key={item.id}
              item={item}
              integrationId={integrationId}
              onSelect={selectItem}
              onOpenDetail={openDetailPanel}
              priority={index < 12}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div
        ref={observerTarget}
        className="h-24 flex items-center justify-center w-full mt-4"
      >
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
        {!hasNextPage && mediaItems.length > 0 && (
          <p className="text-xs text-muted-foreground font-serif italic">
            End of list
          </p>
        )}
      </div>
    </div>
  );
}
