// lib/store/editorial-store.ts

"use client";

import { create } from "zustand";
import type { SelectedAccounts, ThreadMessage } from "@/lib/types/editorial";
import { type EditorialDraft } from "@/lib/types/editorial";
import { FullPostDetails, UserTagDto } from "@/lib/api/publishing";
import { format } from "date-fns";
import type { PlatformCrops, SocialPlatform } from "@/lib/utils/crop-utils";

export interface MediaItem {
  file: File | null;
  preview: string;
  id: string | null;
  isUploading: boolean;
  threadIndex: number | null;
  crops?: PlatformCrops;
  croppedPreviews?: Partial<Record<SocialPlatform, string>>;
}

export interface LocationState {
  id: string | null;
  name: string;
}

export type PlatformPostType = "post" | "reel" | "story";

export interface EditorialState {
  isScheduling: boolean;
  scheduleDate: string;
  scheduleTime: string;
  selectedAccounts: SelectedAccounts;
  mainCaption: string;
  platformCaptions: Record<string, string>;
  platformTitles: Record<string, string>;
  mediaItems: MediaItem[];
  labels: string;
  threadMessages: ThreadMessage[];
  collaborators: string;
  location: LocationState;
  firstComment: string;
  facebookFirstComment: string;
  isInitialized: boolean;
  draft: EditorialDraft | null;
  recycleInterval: number | null;
  aiGenerated: boolean;
  sourceDraftId: string | null;
  postType: PlatformPostType;
  facebookPostType: PlatformPostType;
  userTags: UserTagDto[];
  activeCaptionFilter: string;
}

export interface EditorialActions {
  setState: (updates: Partial<EditorialState>) => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  initializeFromDraft: (draft: EditorialDraft) => void;
  initializeFromFullPost: (fullPost: FullPostDetails) => void;
  reset: () => void;
  setDraft: (draft: EditorialDraft) => void;
  setCropForMedia: (
    mediaIndex: number,
    platform: SocialPlatform,
    cropData: PlatformCrops[SocialPlatform],
    croppedPreviewUrl: string
  ) => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export const initialState: EditorialState = {
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {},
  mainCaption: "",
  platformCaptions: {},
  platformTitles: {},
  mediaItems: [],
  labels: "",
  threadMessages: [],
  collaborators: "",
  location: { id: null, name: "" },
  firstComment: "",
  facebookFirstComment: "",
  isInitialized: false,
  draft: null,
  recycleInterval: null,
  aiGenerated: false,
  sourceDraftId: null,
  postType: "post",
  facebookPostType: "post",
  userTags: [],
  activeCaptionFilter: "all",
};

export const useEditorialStore = create<EditorialState & EditorialActions>(
  (set, get) => ({
    ...initialState,

    setState: (updates) => {
      set((state) => {
        const newState = { ...state, ...updates };
        return newState;
      });
    },

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
          location:
            typeof draft.distribution?.location === "string"
              ? { id: null, name: draft.distribution.location }
              : { id: null, name: "" },
          firstComment: draft.distribution?.firstComment || "",
          isScheduling: draft.schedule?.isScheduled || false,
          scheduleDate: draft.schedule?.date,
          scheduleTime: draft.schedule?.time,
          isInitialized: true,
          recycleInterval: draft.recycleInterval || null,
          aiGenerated: draft.aiGenerated || false,
          sourceDraftId: draft.sourceDraftId || null,
          postType: draft.postType === "video" ? "reel" : "post",
          userTags: draft.distribution?.userTags || [],
        };
        set(updates);
      }
    },

    initializeFromFullPost: (fullPost) => {
      const isEditable =
        fullPost.status === "draft" || fullPost.status === "scheduled";

      const newMediaItems: MediaItem[] = [];
      const mediaMap = fullPost.allMedia || {};

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

      const threadMessages: ThreadMessage[] = fullPost.threadMessages.map(
        (msg, index) => {
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

      const selectedAccounts: SelectedAccounts = {
        [fullPost.integration.platform]: [fullPost.integrationId],
      };

      const settings = fullPost.settings || {};
      const canonicalContent = settings.canonicalContent || fullPost.content;
      const postHasPlatformOverride = fullPost.content !== canonicalContent;

      const updates: Partial<EditorialState> = {
        mainCaption: canonicalContent,
        platformCaptions: postHasPlatformOverride
          ? { [fullPost.integration.platform]: fullPost.content }
          : {},
        platformTitles: fullPost.title
          ? { [fullPost.integration.platform]: fullPost.title }
          : {},
        selectedAccounts,
        mediaItems: newMediaItems,
        threadMessages,
        labels: settings.labels || "",
        collaborators: settings.collaborators || "",
        location: {
          id: settings.locationId || null,
          name: settings.location || "",
        },
        firstComment: settings.firstComment || "",
        recycleInterval: fullPost.recycleInterval || null,
        aiGenerated: settings.aiGenerated || false,
        isScheduling: fullPost.status === "scheduled",
        scheduleDate: fullPost.scheduledAt
          ? format(new Date(fullPost.scheduledAt), "yyyy-MM-dd")
          : getTodayString(),
        scheduleTime: fullPost.scheduledAt
          ? format(new Date(fullPost.scheduledAt), "HH:mm")
          : "12:00",
        isInitialized: true,
        sourceDraftId: isEditable ? fullPost.id : null,
        postType: settings.postType || "post",
        userTags: settings.userTags || [],
      };

      set(updates);
    },

    reset: () => {
      set({ ...initialState, draft: null, isInitialized: false });
    },

    setDraft: (draft: EditorialDraft) => {
      set({ draft });
    },

    setCropForMedia: (mediaIndex, platform, cropData, croppedPreviewUrl) => {
      const currentMediaItems = get().mediaItems;
      const updatedMediaItems = currentMediaItems.map((item, index) => {
        if (index === mediaIndex) {
          return {
            ...item,
            crops: {
              ...item.crops,
              [platform]: cropData,
            },
            croppedPreviews: {
              ...item.croppedPreviews,
              [platform]: croppedPreviewUrl,
            },
          };
        }
        return item;
      });
      set({ mediaItems: updatedMediaItems });
    },
  })
);
