// components/media-room/media-toolbar.tsx

"use client";

import { useState } from "react";
import {
  Search,
  SortAsc,
  SortDesc,
  Heart,
  Grid,
  List,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMediaRoomStore, type MediaTypeFilter, type MediaSortBy } from "@/lib/store/media-room-store";
import { useTagList } from "@/lib/hooks/use-media";

interface MediaToolbarProps {
  integrationId: string | null;
  onUploadClick?: () => void;
}

const typeFilters: { label: string; value: MediaTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "GIFs", value: "gif" },
];

const sortOptions: { label: string; value: MediaSortBy }[] = [
  { label: "Date", value: "createdAt" },
  { label: "Name", value: "filename" },
  { label: "Size", value: "fileSize" },
];

export default function MediaToolbar({ integrationId }: MediaToolbarProps) {
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const searchQuery = useMediaRoomStore((s) => s.searchQuery);
  const setSearchQuery = useMediaRoomStore((s) => s.setSearchQuery);
  const typeFilter = useMediaRoomStore((s) => s.typeFilter);
  const setTypeFilter = useMediaRoomStore((s) => s.setTypeFilter);
  const showFavoritesOnly = useMediaRoomStore((s) => s.showFavoritesOnly);
  const setShowFavoritesOnly = useMediaRoomStore((s) => s.setShowFavoritesOnly);
  const sortBy = useMediaRoomStore((s) => s.sortBy);
  const setSortBy = useMediaRoomStore((s) => s.setSortBy);
  const sortOrder = useMediaRoomStore((s) => s.sortOrder);
  const toggleSortOrder = useMediaRoomStore((s) => s.toggleSortOrder);
  const viewMode = useMediaRoomStore((s) => s.viewMode);
  const setViewMode = useMediaRoomStore((s) => s.setViewMode);
  const selectedTagIds = useMediaRoomStore((s) => s.selectedTagIds);
  const toggleTagFilter = useMediaRoomStore((s) => s.toggleTagFilter);
  const clearAllFilters = useMediaRoomStore((s) => s.clearAllFilters);

  const { data: tags = [] } = useTagList(integrationId);

  const hasActiveFilters =
    searchQuery ||
    typeFilter !== "all" ||
    showFavoritesOnly ||
    selectedTagIds.length > 0;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-hover rounded"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Second row: Filters */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          {/* Type filter */}
          <div className="flex items-center gap-1 border border-border bg-surface p-1">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                  typeFilter === filter.value
                    ? "bg-foreground text-background"
                    : "text-muted hover:bg-surface-hover"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold uppercase tracking-wider transition-colors",
              showFavoritesOnly
                ? "bg-foreground text-background border-foreground"
                : "bg-surface text-muted border-border hover:border-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn("h-3 w-3", showFavoritesOnly && "fill-current")} />
            Favorites
          </button>

          {/* Tags dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold uppercase tracking-wider transition-colors",
                selectedTagIds.length > 0
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface text-muted border-border hover:border-foreground hover:text-foreground"
              )}
            >
              Tags
              {selectedTagIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-background text-foreground rounded text-[10px]">
                  {selectedTagIds.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showTagDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border shadow-lg z-50 max-h-64 overflow-y-auto">
                {tags.length === 0 ? (
                  <p className="p-3 text-xs text-muted-foreground font-serif italic">
                    No tags yet
                  </p>
                ) : (
                  <div className="p-2 space-y-1">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTagFilter(tag.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                          selectedTagIds.includes(tag.id)
                            ? "bg-foreground text-background"
                            : "hover:bg-surface-hover"
                        )}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="truncate">{tag.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* Right side: Sort + View */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-1 border border-border bg-surface">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MediaSortBy)}
              className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider bg-transparent border-0 focus:outline-none cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-1.5 hover:bg-surface-hover border-l border-border"
            >
              {sortOrder === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* View mode */}
          <div className="flex items-center border border-border bg-surface">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 transition-colors",
                viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-surface-hover"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 border-l border-border transition-colors",
                viewMode === "list" ? "bg-foreground text-background" : "hover:bg-surface-hover"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
