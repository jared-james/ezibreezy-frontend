// lib/store/editorial-store.ts

"use client";

import { create } from "zustand";
import type { SelectedAccounts, ThreadMessage } from "@/lib/types/editorial";
import { type EditorialDraft } from "@/lib/types/editorial";

export interface MediaItem {
  file: File;
  preview: string;
  id: string | null;
  isUploading: boolean;
  threadIndex: number | null;
}

export interface EditorialState {
  isScheduling: boolean;
  scheduleDate: string;
  scheduleTime: string;
  selectedAccounts: SelectedAccounts;
  mainCaption: string;
  platformCaptions: Record<string, string>;
  mediaItems: MediaItem[];
  labels: string;
  threadMessages: ThreadMessage[];
  collaborators: string;
  location: string;
  isInitialized: boolean;
  draft: EditorialDraft | null;
}

export interface EditorialActions {
  setState: (updates: Partial<EditorialState>) => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  initializeFromDraft: (draft: EditorialDraft) => void;
  reset: () => void;
  setDraft: (draft: EditorialDraft) => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export const initialState: EditorialState = {
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {},
  mainCaption: "",
  platformCaptions: {},
  mediaItems: [],
  labels: "",
  threadMessages: [],
  collaborators: "",
  location: "",
  isInitialized: false,
  draft: null,
};

export const useEditorialStore = create<EditorialState & EditorialActions>(
  (set, get) => ({
    ...initialState,

    setState: (updates) => set((state) => ({ ...state, ...updates })),

    setThreadMessages: (messages) => set({ threadMessages: messages }),

    initializeFromDraft: (draft) => {
      if (!get().isInitialized) {
        const updates: Partial<EditorialState> = {
          mainCaption: draft.mainCaption,
          platformCaptions: draft.platformCaptions,
          selectedAccounts: draft.selectedAccounts,
          labels: draft.distribution?.labels || "",
          threadMessages: draft.distribution?.threadMessages || [],
          collaborators: draft.distribution?.collaborators || "",
          location: draft.distribution?.location || "",
          isScheduling: draft.schedule?.isScheduled || false,
          scheduleDate: draft.schedule?.date,
          scheduleTime: draft.schedule?.time,
          isInitialized: true,
        };
        set(updates);
      }
    },

    reset: () => set({ ...initialState, draft: null, isInitialized: false }),

    setDraft: (draft: EditorialDraft) => {
      set({ draft });
    },
  })
);
