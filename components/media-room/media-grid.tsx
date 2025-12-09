// components/media-room/media-grid.tsx

"use client";

import { useEffect, useRef, useMemo } from "react";
import { Loader2, ImageOff } from "lucide-react";
import { useMediaRoomStore } from "@/lib/store/media-room-store";
import { useMediaList } from "@/lib/hooks/use-media";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import type { MediaFilters } from "@/lib/types/media";
import MediaCard from "./media-card";
import MediaListItem from "./media-list-item";

interface MediaGridProps {}

export default function MediaGrid({}: MediaGridProps) {
  const { currentWorkspace } = useWorkspaceStore();
  const selectItem = useMediaRoomStore((s) => s.selectItem);
  const openDetailPanel = useMediaRoomStore((s) => s.openDetailPanel);
  const viewMode = useMediaRoomStore((s) => s.viewMode);

  // Extract individual filter values from store
  const sortBy = useMediaRoomStore((s) => s.sortBy);
  const sortOrder = useMediaRoomStore((s) => s.sortOrder);
  const currentFolderId = useMediaRoomStore((s) => s.currentFolderId);
  const searchQuery = useMediaRoomStore((s) => s.searchQuery);
  const typeFilter = useMediaRoomStore((s) => s.typeFilter);
  const selectedTagIds = useMediaRoomStore((s) => s.selectedTagIds);
  const showUsedOnly = useMediaRoomStore((s) => s.showUsedOnly);
  const showUnusedOnly = useMediaRoomStore((s) => s.showUnusedOnly);

  // Memoize filter object to prevent unnecessary re-renders and React Query refetches
  const filters = useMemo(() => {
    const f: MediaFilters = {
      sortBy,
      order: sortOrder,
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
  }, [sortBy, sortOrder, currentFolderId, searchQuery, typeFilter, selectedTagIds, showUsedOnly, showUnusedOnly]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useMediaList(filters);

  const observerTarget = useRef<HTMLDivElement>(null);

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

  if (error) {
    return (
      <div className="border border-error bg-error/5 p-6 text-center rounded-sm">
        <p className="font-serif text-sm text-error">
          Error loading media: {error.message}
        </p>
      </div>
    );
  }

  const allMediaItems = data?.pages.flatMap((page: any) => page.data) || [];
  const filteredMediaItems = allMediaItems.filter((item) => !item.isArchived);

  if (filteredMediaItems.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-border rounded-sm bg-surface/50">
        <ImageOff className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
        <p className="font-serif text-lg text-foreground font-medium">
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
          {filteredMediaItems.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              onSelect={selectItem}
              onOpenDetail={openDetailPanel}
              priority={index < 18}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredMediaItems.map((item, index) => (
            <MediaListItem
              key={item.id}
              item={item}
              onSelect={selectItem}
              onOpenDetail={openDetailPanel}
              priority={index < 18}
            />
          ))}
        </div>
      )}

      <div
        ref={observerTarget}
        className="h-24 flex items-center justify-center w-full mt-8"
      >
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
        {!hasNextPage && filteredMediaItems.length > 0 && (
          <p className="text-xs text-muted-foreground font-serif italic">
            End of list
          </p>
        )}
      </div>
    </div>
  );
}
