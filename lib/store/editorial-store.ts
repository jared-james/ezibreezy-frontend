// lib\store\editorial-store.ts

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
  sourceDraftId: string | null;
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
  sourceDraftId: null,
};

export const useEditorialStore = create<EditorialState & EditorialActions>(
  (set, get) => ({
    ...initialState,

    setState: (updates) => {
      console.log('[PERF] Store setState called with:', Object.keys(updates));
      console.time('[PERF] Store setState duration');
      set((state) => {
        const newState = { ...state, ...updates };
        console.timeEnd('[PERF] Store setState duration');
        return newState;
      });
    },

    setThreadMessages: (messages) => set({ threadMessages: messages }),

    initializeFromDraft: (draft) => {
      console.log('[PERF] initializeFromDraft called');
      console.time('[PERF] initializeFromDraft duration');
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
          sourceDraftId: draft.sourceDraftId || null,
        };
        set(updates);
        console.timeEnd('[PERF] initializeFromDraft duration');
      } else {
        console.log('[PERF] initializeFromDraft skipped - already initialized');
      }
    },

    initializeFromFullPost: (fullPost) => {
      console.log('[PERF] initializeFromFullPost called');
      console.time('[PERF] initializeFromFullPost duration');
      // Logic to determine if this post can be edited/rescheduled
      const isEditable =
        fullPost.status === "draft" || fullPost.status === "scheduled";

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

      // FIX 1: Get the canonical content from settings, falling back to fullPost.content
      const canonicalContent = settings.canonicalContent || fullPost.content;

      // FIX 2: Check if a platform-specific caption was saved
      const postHasPlatformOverride = fullPost.content !== canonicalContent;

      // 4. Update the state
      const updates: Partial<EditorialState> = {
        // FIX 3: Use canonicalContent for the main caption
        mainCaption: canonicalContent,

        // FIX 4: Only set platformCaption if an override was actually saved to the DB
        platformCaptions: postHasPlatformOverride
          ? { [fullPost.integration.platform]: fullPost.content }
          : {},

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
        sourceDraftId: isEditable ? fullPost.id : null,
      };

      set(updates);
      console.timeEnd('[PERF] initializeFromFullPost duration');
    },

    reset: () => {
      console.log('[PERF] Store reset called');
      set({ ...initialState, draft: null, isInitialized: false });
    },

    setDraft: (draft: EditorialDraft) => {
      set({ draft });
    },
  })
);
