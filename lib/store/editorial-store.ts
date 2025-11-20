// lib/store/editorial-store.ts

"use client";

import { create } from "zustand";
import type { SelectedAccounts, ThreadMessage } from "@/lib/types/editorial";
import { type EditorialDraft } from "@/lib/types/editorial";
import { FullPostDetails } from "@/lib/api/publishing";
import { format } from "date-fns";

export interface MediaItem {
  file: File | null;
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
  recycleInterval: number | null;
  aiGenerated: boolean;
  sourceDraftId: string | null; // NEW FIELD
}

export interface EditorialActions {
  setState: (updates: Partial<EditorialState>) => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  initializeFromDraft: (draft: EditorialDraft) => void;
  initializeFromFullPost: (fullPost: FullPostDetails) => void;
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
  recycleInterval: null,
  aiGenerated: false,
  sourceDraftId: null, // INITIAL VALUE
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
          recycleInterval: draft.recycleInterval || null,
          aiGenerated: draft.aiGenerated || false,
          sourceDraftId: draft.sourceDraftId || null, // Capture sourceDraftId
        };
        set(updates);
      }
    },

    initializeFromFullPost: (fullPost) => {
      // 1. Rebuild MediaItems from the allMedia map
      const newMediaItems: MediaItem[] = [];

      const mediaMap = fullPost.allMedia || {};

      // Main Post Media
      fullPost.mediaIds.forEach((mediaId) => {
        const mediaRecord = mediaMap[mediaId];
        if (mediaRecord) {
          newMediaItems.push({
            id: mediaId,
            file: null,
            preview: mediaRecord.url,
            isUploading: false,
            threadIndex: null,
          });
        }
      });

      // Thread Messages and their Media
      const threadMessages: ThreadMessage[] = fullPost.threadMessages.map(
        (msg, index) => {
          // Add thread media to the list
          msg.mediaIds.forEach((mediaId) => {
            const mediaRecord = mediaMap[mediaId];
            if (mediaRecord) {
              newMediaItems.push({
                id: mediaId,
                file: null,
                preview: mediaRecord.url,
                isUploading: false,
                threadIndex: index,
              });
            }
          });
          return {
            content: msg.content,
            mediaIds: msg.mediaIds,
          };
        }
      );

      // 2. Rebuild selectedAccounts (single integration on the post)
      const selectedAccounts: SelectedAccounts = {
        [fullPost.integration.platform]: [fullPost.integrationId],
      };

      // 3. Rebuild settings (labels, collaborators, location, etc.)
      const settings = fullPost.settings || {};

      // 4. Update the state
      const updates: Partial<EditorialState> = {
        mainCaption: fullPost.content,
        platformCaptions:
          fullPost.integration.platform === "x"
            ? {}
            : { [fullPost.integration.platform]: fullPost.content },

        selectedAccounts,
        mediaItems: newMediaItems,
        threadMessages,

        // Settings/Distribution
        labels: settings.labels || "",
        collaborators: settings.collaborators || "",
        location: settings.location || "",
        recycleInterval: fullPost.recycleInterval || null,
        aiGenerated: settings.aiGenerated || false,

        // Schedule
        isScheduling: fullPost.status === "scheduled",
        scheduleDate: fullPost.scheduledAt
          ? format(new Date(fullPost.scheduledAt), "yyyy-MM-dd")
          : getTodayString(),
        scheduleTime: fullPost.scheduledAt
          ? format(new Date(fullPost.scheduledAt), "HH:mm")
          : "12:00",

        isInitialized: true,
        sourceDraftId: fullPost.status === "draft" ? fullPost.id : null, // CAPTURE ID IF IT'S A DRAFT
      };

      set(updates);
    },

    reset: () => set({ ...initialState, draft: null, isInitialized: false }),

    setDraft: (draft: EditorialDraft) => {
      set({ draft });
    },
  })
);
