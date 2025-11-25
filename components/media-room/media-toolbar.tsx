// components/media-room/media-toolbar.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  X,
  ChevronDown,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useMediaRoomStore,
  type MediaTypeFilter,
  type MediaSortBy,
} from "@/lib/store/media-room-store";
import { useTagList, useCreateTag } from "@/lib/hooks/use-media";

interface MediaToolbarProps {
  integrationId: string | null;
  onUploadClick?: () => void;
}

const typeFilters: { label: string; value: MediaTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
];

const sortOptions: { label: string; value: MediaSortBy }[] = [
  { label: "Date", value: "createdAt" },
  { label: "Name", value: "filename" },
  { label: "Size", value: "fileSize" },
];

// Helper to generate nice pastel colors
const getRandomColor = () => {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function MediaToolbar({ integrationId }: MediaToolbarProps) {
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const searchQuery = useMediaRoomStore((s) => s.searchQuery);
  const setSearchQuery = useMediaRoomStore((s) => s.setSearchQuery);
  const typeFilter = useMediaRoomStore((s) => s.typeFilter);
  const setTypeFilter = useMediaRoomStore((s) => s.setTypeFilter);
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
  const createTagMutation = useCreateTag(integrationId);

  // Local state for the input field to prevent API calls on every keystroke
  const [inputValue, setInputValue] = useState(searchQuery);

  // Sync local input when global state changes (e.g. "Clear filters" clicked)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery, searchQuery]);

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    createTagMutation.mutate(
      { name: newTagName.trim(), color: getRandomColor() },
      {
        onSuccess: () => {
          setNewTagName("");
        },
      }
    );
  };

  const hasActiveFilters =
    searchQuery || typeFilter !== "all" || selectedTagIds.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-neutral-300 bg-white p-1 rounded-sm">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm",
                  typeFilter === filter.value
                    ? "bg-brand-primary text-brand-primary-foreground"
                    : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold uppercase tracking-wider transition-colors rounded-sm",
                selectedTagIds.length > 0
                  ? "bg-brand-primary text-brand-primary-foreground border-brand-primary"
                  : "bg-white text-neutral-500 border-neutral-300 hover:border-brand-primary hover:text-brand-primary"
              )}
            >
              Tags
              {selectedTagIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-brand-primary rounded text-[10px]">
                  {selectedTagIds.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showTagDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-300 shadow-lg z-50 rounded-sm flex flex-col">
                {/* Create Tag Input */}
                <form
                  onSubmit={handleCreateTag}
                  className="p-2 border-b border-neutral-200 bg-neutral-50"
                >
                  <div className="flex gap-1">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="New tag name..."
                      className="h-8 text-xs bg-white"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        !newTagName.trim() || createTagMutation.isPending
                      }
                      className="h-8 w-8 p-0 shrink-0 bg-brand-primary hover:bg-brand-primary/90 text-white"
                    >
                      {createTagMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>

                {/* Tag List */}
                <div className="max-h-64 overflow-y-auto p-1">
                  {tags.length === 0 ? (
                    <p className="p-3 text-xs text-neutral-500 font-serif italic text-center">
                      No tags created yet
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTagFilter(tag.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm font-serif transition-colors rounded-sm",
                            selectedTagIds.includes(tag.id)
                              ? "bg-brand-primary text-brand-primary-foreground"
                              : "hover:bg-neutral-100"
                          )}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="truncate">{tag.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-neutral-500 hover:text-brand-primary transition-colors"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search media..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-8 pr-8 h-8 text-xs font-serif border-neutral-300 focus:border-brand-primary"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-neutral-100 rounded"
              >
                <X className="h-3 w-3 text-neutral-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 border border-neutral-300 bg-white rounded-sm">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MediaSortBy)}
              className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider bg-transparent border-0 focus:outline-none cursor-pointer hover:text-brand-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-1.5 hover:bg-neutral-100 border-l border-neutral-300 text-neutral-500 hover:text-brand-primary"
            >
              {sortOrder === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center border border-neutral-300 bg-white rounded-sm overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-brand-primary text-brand-primary-foreground"
                  : "hover:bg-neutral-100 text-neutral-500"
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 border-l border-neutral-300 transition-colors",
                viewMode === "list"
                  ? "bg-brand-primary text-brand-primary-foreground"
                  : "hover:bg-neutral-100 text-neutral-500"
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
