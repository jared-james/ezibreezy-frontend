// components/post-editor/media-library-selector.tsx

"use client";

import { useState, useMemo } from "react";
import { Loader2, ImageOff, Check, Video } from "lucide-react";
import { useMediaList } from "@/lib/hooks/use-media";
import type { MediaFilters, MediaItem } from "@/lib/api/media";
import { cn } from "@/lib/utils";

interface MediaLibrarySelectorProps {
  integrationId: string | null;
  selectedMediaIds: Set<string>;
  onToggleMedia: (mediaItem: MediaItem) => void;
}

export default function MediaLibrarySelector({
  integrationId,
  selectedMediaIds,
  onToggleMedia,
}: MediaLibrarySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filters = useMemo<MediaFilters>(
    () => ({
      sortBy: "createdAt",
      order: "desc",
      limit: 50,
      rootOnly: true,
      ...(searchQuery.trim() && { search: searchQuery.trim() }),
    }),
    [searchQuery]
  );

  const { data, isLoading, isError, error } = useMediaList(filters);

  const mediaItems = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-error bg-error/5 p-4 text-center rounded-md">
        <p className="text-xs text-error">
          Error loading media: {error?.message}
        </p>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-border rounded-md">
        <ImageOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No media in library</p>
        <p className="text-xs text-muted-foreground mt-1">
          Upload files to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search media..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />

      <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto">
        {mediaItems.map((item) => {
          const isSelected = selectedMediaIds.has(item.id);
          const isVideo = item.type.startsWith("video/");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleMedia(item)}
              className={cn(
                "relative group aspect-square rounded-md overflow-hidden border-2 transition-all duration-200",
                isSelected
                  ? "border-brand-primary ring-2 ring-brand-primary ring-offset-2 ring-offset-surface"
                  : "border-border hover:border-brand-primary/50"
              )}
            >
              {isVideo ? (
                <>
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.altText || item.filename}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover pointer-events-none"
                      preload="metadata"
                    />
                  )}
                  <div className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-md pointer-events-none">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.altText || item.filename}
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}

              {isSelected && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
