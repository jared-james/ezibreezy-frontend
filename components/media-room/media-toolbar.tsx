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
import {
  useMediaRoomStore,
  type MediaTypeFilter,
  type MediaSortBy,
} from "@/lib/store/media-room-store";
import { useTagList, useCreateTag } from "@/lib/hooks/use-media";

interface MediaToolbarProps {
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

const getRandomColor = () => {
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#d946ef",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function MediaToolbar({}: MediaToolbarProps) {
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

  const { data: tags = [] } = useTagList();
  const createTagMutation = useCreateTag();

  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        {/* Left Side: Filters */}
        <div className="flex items-center gap-3">
          {/* Type Filters Group */}
          <div className="flex items-center p-1 gap-1">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  "btn h-8 text-xs",
                  typeFilter === filter.value
                    ? "btn-primary"
                    : "btn-outline border-transparent hover:border-border"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Tags Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className={cn(
                "btn h-8 text-xs",
                selectedTagIds.length > 0 ? "btn-primary" : "btn-outline"
              )}
            >
              Tags
              {selectedTagIds.length > 0 && (
                <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-brand-primary px-1">
                  {selectedTagIds.length}
                </span>
              )}
              <ChevronDown className="ml-1.5 h-3 w-3" />
            </button>

            {showTagDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-foreground shadow-xl z-50 rounded-sm flex flex-col animate-in fade-in zoom-in-95 duration-100">
                <form
                  onSubmit={handleCreateTag}
                  className="p-2 border-b border-border bg-surface-hover"
                >
                  <div className="flex gap-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="New tag name..."
                      className="h-8 text-xs font-serif bg-surface border-border focus:border-foreground"
                    />
                    <button
                      type="submit"
                      disabled={
                        !newTagName.trim() || createTagMutation.isPending
                      }
                      className="btn btn-primary h-8 w-8 p-0 shrink-0"
                    >
                      {createTagMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </form>

                <div className="max-h-64 overflow-y-auto p-1">
                  {tags.length === 0 ? (
                    <p className="p-4 text-xs text-muted-foreground font-serif italic text-center">
                      No tags created yet
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTagFilter(tag.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-serif transition-colors rounded-sm",
                            selectedTagIds.includes(tag.id)
                              ? "bg-brand-primary text-brand-primary-foreground"
                              : "hover:bg-surface-hover text-foreground"
                          )}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0 border border-white/20"
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif text-muted-foreground hover:text-error transition-colors"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        {/* Right Side: Search & View Options */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assets..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9 pr-8 h-9 text-sm font-serif border-border bg-surface focus:border-foreground rounded-sm"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-foreground text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Sort Controls */}
          <div className="flex items-center gap-px border border-border rounded-sm bg-surface overflow-hidden">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MediaSortBy)}
              className="h-9 px-3 text-xs font-bold uppercase tracking-wider bg-transparent border-0 focus:ring-0 cursor-pointer hover:bg-surface-hover text-foreground"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={toggleSortOrder}
              className="h-9 px-2 hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-px border border-border rounded-sm bg-surface overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-9 w-9 flex items-center justify-center transition-colors",
                viewMode === "grid"
                  ? "bg-brand-primary text-brand-primary-foreground"
                  : "hover:bg-surface-hover text-muted-foreground"
              )}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "h-9 w-9 flex items-center justify-center transition-colors",
                viewMode === "list"
                  ? "bg-brand-primary text-brand-primary-foreground"
                  : "hover:bg-surface-hover text-muted-foreground"
              )}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
