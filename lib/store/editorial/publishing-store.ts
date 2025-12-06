// lib/store/editorial/publishing-store.ts

"use client";

import { create } from "zustand";
import { SelectedAccounts } from "@/lib/types/editorial";
import { InstagramUserSearchResult } from "@/lib/types/integrations";
import { FullPostDetails } from "@/lib/types/publishing";

export interface LocationState {
  id: string | null;
  name: string;
}

export interface PublishingState {
  selectedAccounts: SelectedAccounts;
  isScheduling: boolean;
  scheduleDate: string;
  scheduleTime: string;
  location: LocationState;
  labels: string;
  collaborators: string;
  instagramCollaborators: InstagramUserSearchResult[];

  // YouTube Metadata
  youtubePrivacy: "public" | "private" | "unlisted";
  youtubeCategory: string;
  youtubeTags: string;
  youtubeMadeForKids: boolean;
  youtubeThumbnailUrl: string | null;

  // Pinterest Metadata
  pinterestBoardId: string | null;
  pinterestLink: string;
  pinterestCoverUrl: string | null;

  // Threads Metadata
  threadsTopicTag: string;
  threadsLinkAttachment: string;

  // Meta / System
  recycleInterval: number | null;
  aiGenerated: boolean;
  sourceDraftId: string | null;
}

export interface PublishingActions {
  setPublishingState: (updates: Partial<PublishingState>) => void;
  initializeFromFullPost: (fullPost: FullPostDetails) => void;
  resetPublishing: () => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

const initialPublishingState: PublishingState = {
  selectedAccounts: {},
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  location: { id: null, name: "" },
  labels: "",
  collaborators: "",
  instagramCollaborators: [],

  youtubePrivacy: "public",
  youtubeCategory: "22", // People & Blogs
  youtubeTags: "",
  youtubeMadeForKids: false,
  youtubeThumbnailUrl: null,

  pinterestBoardId: null,
  pinterestLink: "",
  pinterestCoverUrl: null,

  threadsTopicTag: "",
  threadsLinkAttachment: "",

  recycleInterval: null,
  aiGenerated: false,
  sourceDraftId: null,
};

export const usePublishingStore = create<PublishingState & PublishingActions>(
  (set) => ({
    ...initialPublishingState,

    setPublishingState: (updates) => {
      set((state) => ({ ...state, ...updates }));
    },

    initializeFromFullPost: (fullPost) => {
      const selectedAccounts: SelectedAccounts = {
        [fullPost.integration.platform]: [fullPost.integrationId],
      };

      // Check if post is scheduled
      const isScheduled = !!fullPost.scheduledAt;
      let scheduleDate = getTodayString();
      let scheduleTime = "12:00";

      if (isScheduled && fullPost.scheduledAt) {
        const scheduledDate = new Date(fullPost.scheduledAt);
        scheduleDate = scheduledDate.toISOString().split("T")[0];
        scheduleTime = scheduledDate.toTimeString().slice(0, 5);
      }

      set({
        selectedAccounts,
        isScheduling: isScheduled,
        scheduleDate,
        scheduleTime,
        recycleInterval: fullPost.recycleInterval,
      });
    },

    resetPublishing: () => {
      set(initialPublishingState);
    },
  })
);
