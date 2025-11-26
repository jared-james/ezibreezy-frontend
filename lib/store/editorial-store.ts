// lib/store/editorial-store.ts

"use client";

import { create } from "zustand";
import type { SelectedAccounts, ThreadMessage } from "@/lib/types/editorial";
import { type EditorialDraft } from "@/lib/types/editorial";
import { FullPostDetails, UserTagDto, ProductTagDto } from "@/lib/api/publishing";
import { format } from "date-fns";
import type { PlatformCrops, SocialPlatform } from "@/lib/utils/crop-utils";
import { PLATFORM_RULES } from "@/lib/utils/media-validation";

export interface MediaItem {
  uid: string;
  file: File | null;
  preview: string;
  originalUrlForCropping?: string;
  id: string | null;
  isUploading: boolean;
  threadIndex: number | null;
  type: "image" | "video";
  crops?: PlatformCrops;
  croppedPreviews?: Partial<Record<SocialPlatform, string>>;
  altText?: string | null;
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
  stagedMediaItems: MediaItem[];
  platformMediaSelections: Record<string, string[]>;
  labels: string;
  threadMessages: ThreadMessage[];
  platformThreadMessages: Record<string, ThreadMessage[]>;
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
  userTags: Record<string, UserTagDto[]>; // Changed: now keyed by mediaId
  productTags: Record<string, ProductTagDto[]>; // Keyed by mediaId
  activeCaptionFilter: string;
  instagramCoverUrl: string | null;
  instagramThumbOffset: number | null;
  instagramShareToFeed: boolean;
}

export interface EditorialActions {
  setState: (updates: Partial<EditorialState>) => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  initializeFromDraft: (draft: EditorialDraft) => void;
  initializeFromFullPost: (fullPost: FullPostDetails) => void;
  reset: () => void;
  setDraft: (draft: EditorialDraft) => void;
  setCropForMedia: (
    mediaUid: string,
    platform: SocialPlatform,
    cropData: PlatformCrops[SocialPlatform],
    croppedPreviewUrl: string
  ) => void;
  setPlatformMediaSelection: (platformId: string, mediaUids: string[]) => void;
  togglePlatformMediaSelection: (platformId: string, mediaUid: string) => void;
  setStagedMediaItems: (items: MediaItem[]) => void;
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
  stagedMediaItems: [],
  platformMediaSelections: {},
  labels: "",
  threadMessages: [],
  platformThreadMessages: {},
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
  userTags: {}, // Changed: now an empty object
  productTags: {}, // Empty object keyed by mediaId
  activeCaptionFilter: "all",
  instagramCoverUrl: null,
  instagramThumbOffset: null,
  instagramShareToFeed: true,
};

export const useEditorialStore = create<EditorialState & EditorialActions>(
  (set, get) => ({
    ...initialState,

    setState: (updates) => {
      set((state) => ({ ...state, ...updates }));
    },

    setStagedMediaItems: (items) => {
      set({ stagedMediaItems: items });
    },

    setThreadMessages: (messages) => set({ threadMessages: messages }),

    togglePlatformMediaSelection: (platformId, mediaUid) => {
      const state = get();
      const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];
      if (!rules) return;

      const currentSelectionUids =
        state.platformMediaSelections[platformId] || [];
      const itemToToggle = state.stagedMediaItems.find(
        (item) => item.uid === mediaUid
      );
      if (!itemToToggle) return;

      const isCurrentlySelected = currentSelectionUids.includes(mediaUid);
      let newSelectionUids = [...currentSelectionUids];

      if (isCurrentlySelected) {
        newSelectionUids = newSelectionUids.filter((uid) => uid !== mediaUid);
      } else {
        const currentSelectionItems = newSelectionUids
          .map((uid) => state.stagedMediaItems.find((item) => item.uid === uid))
          .filter(Boolean) as MediaItem[];

        if (rules.allowMixedMedia) {
          const totalLimit = rules.maxImages;
          if (currentSelectionItems.length >= totalLimit) return;

          const videoCount = currentSelectionItems.filter(
            (item) => item.type === "video"
          ).length;
          const imageCount = currentSelectionItems.filter(
            (item) => item.type === "image"
          ).length;

          if (itemToToggle.type === "video" && videoCount < rules.maxVideos) {
            newSelectionUids.push(mediaUid);
          } else if (
            itemToToggle.type === "image" &&
            imageCount < rules.maxImages
          ) {
            newSelectionUids.push(mediaUid);
          }
        } else {
          if (itemToToggle.type === "video") {
            const hasImages = currentSelectionItems.some(
              (item) => item.type === "image"
            );
            if (hasImages) {
              newSelectionUids = [mediaUid];
            } else if (currentSelectionItems.length < rules.maxVideos) {
              newSelectionUids.push(mediaUid);
            }
          } else if (itemToToggle.type === "image") {
            if (rules.maxImages === 0) return;
            const hasVideo = currentSelectionItems.some(
              (item) => item.type === "video"
            );
            if (hasVideo) {
              newSelectionUids = [mediaUid];
            } else if (currentSelectionItems.length < rules.maxImages) {
              newSelectionUids.push(mediaUid);
            }
          }
        }
      }

      set({
        platformMediaSelections: {
          ...state.platformMediaSelections,
          [platformId]: newSelectionUids,
        },
      });
    },

    setPlatformMediaSelection: (platformId, mediaUids) => {
      set((state) => ({
        platformMediaSelections: {
          ...state.platformMediaSelections,
          [platformId]: mediaUids,
        },
      }));
    },

    initializeFromDraft: (draft) => {
      if (get().isInitialized) return;
      set({
        mainCaption: draft.mainCaption,
        platformCaptions: draft.platformCaptions,
        selectedAccounts: draft.selectedAccounts,
        isInitialized: true,
      });
    },

    initializeFromFullPost: (fullPost) => {
      const newMediaItems: MediaItem[] = [];
      const mediaMap = fullPost.allMedia || {};
      const allMediaIds = [
        ...fullPost.mediaIds,
        ...fullPost.threadMessages.flatMap((m) => m.mediaIds),
      ];

      allMediaIds.forEach((mediaId) => {
        const mediaRecord = mediaMap[mediaId];
        if (mediaRecord) {
          const uid = crypto.randomUUID();
          newMediaItems.push({
            uid,
            id: mediaId,
            file: null,
            preview: mediaRecord.url,
            isUploading: false,
            threadIndex: fullPost.mediaIds.includes(mediaId) ? null : 0,
            type: mediaRecord.type.startsWith("video") ? "video" : "image",
          });
        }
      });

      const selectedAccounts: SelectedAccounts = {
        [fullPost.integration.platform]: [fullPost.integrationId],
      };

      const platformMediaSelection = {
        [fullPost.integration.platform]: newMediaItems
          .filter((m) => m.threadIndex === null)
          .map((m) => m.uid),
      };

      set({
        stagedMediaItems: newMediaItems,
        platformMediaSelections: platformMediaSelection,
        mainCaption: fullPost.settings?.canonicalContent || fullPost.content,
        selectedAccounts,
        isInitialized: true,
      });
    },

    reset: () => {
      set({ ...initialState, draft: null, isInitialized: false });
    },

    setDraft: (draft: EditorialDraft) => {
      set({ draft });
    },

    setCropForMedia: (mediaUid, platform, cropData, croppedPreviewUrl) => {
      set((state) => ({
        stagedMediaItems: state.stagedMediaItems.map((item) => {
          if (item.uid === mediaUid) {
            return {
              ...item,
              crops: { ...item.crops, [platform]: cropData },
              croppedPreviews: {
                ...item.croppedPreviews,
                [platform]: croppedPreviewUrl,
              },
            };
          }
          return item;
        }),
      }));
    },
  })
);
