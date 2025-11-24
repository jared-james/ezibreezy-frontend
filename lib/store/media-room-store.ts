// lib/store/media-room-store.ts

"use client";

import { create } from "zustand";
import type { MediaFilters } from "@/lib/api/media";

export type MediaViewMode = "grid" | "list";
export type MediaSortBy = "createdAt" | "filename" | "fileSize";
export type MediaSortOrder = "asc" | "desc";
export type MediaTypeFilter = "all" | "image" | "video" | "gif";

export interface MediaRoomState {
  // Selection
  selectedIds: Set<string>;
  lastSelectedId: string | null;

  // Navigation
  currentFolderId: string | null;
  expandedFolderIds: Set<string>;

  // Filters
  searchQuery: string;
  typeFilter: MediaTypeFilter;
  selectedTagIds: string[];
  showUsedOnly: boolean;
  showUnusedOnly: boolean;

  // Sort
  sortBy: MediaSortBy;
  sortOrder: MediaSortOrder;

  // View
  viewMode: MediaViewMode;

  // Detail panel
  detailPanelMediaId: string | null;

  // Upload
  isUploadModalOpen: boolean;
}

export interface MediaRoomActions {
  // Selection
  selectItem: (id: string, isShiftKey?: boolean, isCtrlKey?: boolean) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;

  // Navigation
  setCurrentFolder: (folderId: string | null) => void;
  toggleFolderExpanded: (folderId: string) => void;
  expandFolder: (folderId: string) => void;

  // Filters
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: MediaTypeFilter) => void;
  toggleTagFilter: (tagId: string) => void;
  clearTagFilters: () => void;
  setShowUsedOnly: (show: boolean) => void;
  setShowUnusedOnly: (show: boolean) => void;
  clearAllFilters: () => void;

  // Sort
  setSortBy: (sortBy: MediaSortBy) => void;
  setSortOrder: (order: MediaSortOrder) => void;
  toggleSortOrder: () => void;

  // View
  setViewMode: (mode: MediaViewMode) => void;

  // Detail panel
  openDetailPanel: (mediaId: string) => void;
  closeDetailPanel: () => void;

  // Upload
  openUploadModal: () => void;
  closeUploadModal: () => void;

  // Reset
  reset: () => void;

  // Helper to build filters for API
  getApiFilters: () => MediaFilters;
}

const initialState: MediaRoomState = {
  selectedIds: new Set(),
  lastSelectedId: null,
  currentFolderId: null,
  expandedFolderIds: new Set(),
  searchQuery: "",
  typeFilter: "all",
  selectedTagIds: [],
  showUsedOnly: false,
  showUnusedOnly: false,
  sortBy: "createdAt",
  sortOrder: "desc",
  viewMode: "grid",
  detailPanelMediaId: null,
  isUploadModalOpen: false,
};

export const useMediaRoomStore = create<MediaRoomState & MediaRoomActions>(
  (set, get) => ({
    ...initialState,

    // Selection
    selectItem: (id, isShiftKey = false, isCtrlKey = false) => {
      set((state) => {
        if (isCtrlKey) {
          const newSet = new Set(state.selectedIds);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedIds: newSet, lastSelectedId: id };
        }

        if (isShiftKey && state.lastSelectedId) {
          return {
            selectedIds: new Set([...state.selectedIds, id]),
            lastSelectedId: id,
          };
        }

        return { selectedIds: new Set([id]), lastSelectedId: id };
      });
    },

    selectAll: (ids) => {
      set({ selectedIds: new Set(ids) });
    },

    clearSelection: () => {
      set({ selectedIds: new Set(), lastSelectedId: null });
    },

    toggleSelection: (id) => {
      set((state) => {
        const newSet = new Set(state.selectedIds);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return { selectedIds: newSet };
      });
    },

    // Navigation
    setCurrentFolder: (folderId) => {
      set({
        currentFolderId: folderId,
        selectedIds: new Set(),
        lastSelectedId: null,
      });
    },

    toggleFolderExpanded: (folderId) => {
      set((state) => {
        const newSet = new Set(state.expandedFolderIds);
        if (newSet.has(folderId)) {
          newSet.delete(folderId);
        } else {
          newSet.add(folderId);
        }
        return { expandedFolderIds: newSet };
      });
    },

    expandFolder: (folderId) => {
      set((state) => {
        const newSet = new Set(state.expandedFolderIds);
        newSet.add(folderId);
        return { expandedFolderIds: newSet };
      });
    },

    // Filters
    setSearchQuery: (query) => {
      set({ searchQuery: query });
    },

    setTypeFilter: (type) => {
      set({ typeFilter: type });
    },

    toggleTagFilter: (tagId) => {
      set((state) => {
        const index = state.selectedTagIds.indexOf(tagId);
        if (index >= 0) {
          return {
            selectedTagIds: state.selectedTagIds.filter((id) => id !== tagId),
          };
        }
        return { selectedTagIds: [...state.selectedTagIds, tagId] };
      });
    },

    clearTagFilters: () => {
      set({ selectedTagIds: [] });
    },

    setShowUsedOnly: (show) => {
      set({ showUsedOnly: show, showUnusedOnly: false });
    },

    setShowUnusedOnly: (show) => {
      set({ showUnusedOnly: show, showUsedOnly: false });
    },

    clearAllFilters: () => {
      set({
        searchQuery: "",
        typeFilter: "all",
        selectedTagIds: [],
        showUsedOnly: false,
        showUnusedOnly: false,
      });
    },

    // Sort
    setSortBy: (sortBy) => {
      set({ sortBy });
    },

    setSortOrder: (order) => {
      set({ sortOrder: order });
    },

    toggleSortOrder: () => {
      set((state) => ({
        sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
      }));
    },

    // View
    setViewMode: (mode) => {
      set({ viewMode: mode });
    },

    // Detail panel
    openDetailPanel: (mediaId) => {
      set({ detailPanelMediaId: mediaId });
    },

    closeDetailPanel: () => {
      set({ detailPanelMediaId: null });
    },

    // Upload
    openUploadModal: () => {
      set({ isUploadModalOpen: true });
    },

    closeUploadModal: () => {
      set({ isUploadModalOpen: false });
    },

    // Reset
    reset: () => {
      set(initialState);
    },

    // Helper to build filters for API
    getApiFilters: () => {
      const state = get();
      const filters: MediaFilters = {
        sortBy: state.sortBy,
        order: state.sortOrder,
      };

      if (state.currentFolderId) {
        filters.folderId = state.currentFolderId;
      } else {
        filters.rootOnly = true;
      }

      if (state.searchQuery.trim()) {
        filters.search = state.searchQuery.trim();
      }

      if (state.typeFilter !== "all") {
        filters.type = state.typeFilter;
      }

      if (state.selectedTagIds.length > 0) {
        filters.tagIds = state.selectedTagIds;
      }

      if (state.showUsedOnly) {
        filters.isUsed = true;
      }

      if (state.showUnusedOnly) {
        filters.isUnused = true;
      }

      return filters;
    },
  })
);
