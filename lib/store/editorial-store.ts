// lib/store/editorial-store.ts

"use client";

import { create } from "zustand";
import type { SelectedAccounts, ThreadMessage } from "@/lib/types/editorial";
import { type EditorialDraft } from "@/lib/types/editorial";
import {
  FullPostDetails,
  UserTagDto,
  ProductTagDto,
} from "@/lib/api/publishing";
import type { PlatformCrops, SocialPlatform } from "@/lib/utils/crop-utils";
import { PLATFORM_RULES } from "@/lib/utils/media-validation";
import { InstagramUserSearchResult } from "@/lib/api/integrations";

export interface MediaItem {
  uid: string;
  file: File | null;
  preview: string;
  mediaUrl?: string;
  originalUrlForCropping?: string;
  id: string | null;
  isUploading: boolean;
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
  instagramCollaborators: InstagramUserSearchResult[];
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
  userTags: Record<string, UserTagDto[]>;
  productTags: Record<string, ProductTagDto[]>;
  activeCaptionFilter: string;
  instagramCoverUrl: string | null;
  instagramThumbOffset: number | null;
  instagramShareToFeed: boolean;
  tiktokVideoCoverTimestamp: number | null;
  threadsTopicTag: string;
  threadsLinkAttachment: string;
  youtubePrivacy: "public" | "private" | "unlisted";
  youtubeCategory: string;
  youtubeTags: string;
  youtubeMadeForKids: boolean;
  youtubeThumbnailUrl: string | null;
  pinterestBoardId: string | null;
  pinterestLink: string;
  pinterestCoverUrl: string | null;
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
  toggleThreadMediaSelection: (
    platformId: string,
    threadIndex: number,
    mediaUid: string
  ) => void;
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
  instagramCollaborators: [],
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
  userTags: {},
  productTags: {},
  activeCaptionFilter: "all",
  instagramCoverUrl: null,
  instagramThumbOffset: null,
  instagramShareToFeed: true,
  tiktokVideoCoverTimestamp: null,
  threadsTopicTag: "",
  threadsLinkAttachment: "",
  youtubePrivacy: "public",
  youtubeCategory: "22",
  youtubeTags: "",
  youtubeMadeForKids: false,
  youtubeThumbnailUrl: null,
  pinterestBoardId: null,
  pinterestLink: "",
  pinterestCoverUrl: null,
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
            } else if (rules.maxVideos === 1) {
              newSelectionUids = [mediaUid];
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

    toggleThreadMediaSelection: (platformId, threadIndex, mediaUid) => {
      const state = get();
      const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];
      if (!rules) return;

      const currentMessages = state.platformThreadMessages[platformId] || [];

      if (!currentMessages[threadIndex]) return;

      const message = currentMessages[threadIndex];
      const currentMediaIds = message.mediaIds || [];
      const itemToToggle = state.stagedMediaItems.find(
        (item) => item.uid === mediaUid
      );
      if (!itemToToggle) return;

      let newMediaIds = [...currentMediaIds];
      const isCurrentlySelected = newMediaIds.includes(mediaUid);

      if (isCurrentlySelected) {
        newMediaIds = newMediaIds.filter((uid) => uid !== mediaUid);
      } else {
        const currentSelectionItems = newMediaIds
          .map((uid) => state.stagedMediaItems.find((item) => item.uid === uid))
          .filter(Boolean) as MediaItem[];

        if (rules.allowMixedMedia) {
          const totalLimit = rules.maxImages;
          if (currentSelectionItems.length < totalLimit) {
            const videoCount = currentSelectionItems.filter(
              (item) => item.type === "video"
            ).length;
            const imageCount = currentSelectionItems.filter(
              (item) => item.type === "image"
            ).length;

            if (itemToToggle.type === "video" && videoCount < rules.maxVideos) {
              newMediaIds.push(mediaUid);
            } else if (
              itemToToggle.type === "image" &&
              imageCount < rules.maxImages
            ) {
              newMediaIds.push(mediaUid);
            }
          }
        } else {
          if (itemToToggle.type === "video") {
            const hasImages = currentSelectionItems.some(
              (item) => item.type === "image"
            );
            if (hasImages) {
              newMediaIds = [mediaUid];
            } else if (currentSelectionItems.length < rules.maxVideos) {
              newMediaIds.push(mediaUid);
            } else if (rules.maxVideos === 1) {
              newMediaIds = [mediaUid];
            }
          } else if (itemToToggle.type === "image") {
            const hasVideo = currentSelectionItems.some(
              (item) => item.type === "video"
            );
            if (hasVideo) {
              newMediaIds = [mediaUid];
            } else if (currentSelectionItems.length < rules.maxImages) {
              newMediaIds.push(mediaUid);
            }
          }
        }
      }

      const newMessages = [...currentMessages];
      newMessages[threadIndex] = {
        ...message,
        mediaIds: newMediaIds,
      };

      set({
        platformThreadMessages: {
          ...state.platformThreadMessages,
          [platformId]: newMessages,
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
      const idToUidMap = new Map<string, string>();

      const allMediaIds = Array.from(
        new Set([
          ...fullPost.mediaIds,
          ...fullPost.threadMessages.flatMap((m) => m.mediaIds),
        ])
      );

      allMediaIds.forEach((mediaId) => {
        const mediaRecord = mediaMap[mediaId];
        if (mediaRecord) {
          const uid = crypto.randomUUID();
          idToUidMap.set(mediaId, uid);

          newMediaItems.push({
            uid,
            id: mediaId,
            file: null,
            preview: mediaRecord.url,
            mediaUrl: mediaRecord.url,
            isUploading: false,
            type: mediaRecord.type.startsWith("video") ? "video" : "image",
          });
        }
      });

      const selectedAccounts: SelectedAccounts = {
        [fullPost.integration.platform]: [fullPost.integrationId],
      };

      const platformMediaSelection = {
        [fullPost.integration.platform]: fullPost.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      };

      const threadMessages = fullPost.threadMessages.map((msg) => ({
        content: msg.content,
        mediaIds: msg.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      }));

      const platformThreadMessages = {
        [fullPost.integration.platform]: threadMessages,
      };

      set({
        stagedMediaItems: newMediaItems,
        platformMediaSelections: platformMediaSelection,
        mainCaption: fullPost.settings?.canonicalContent || fullPost.content,
        selectedAccounts,
        threadMessages,
        platformThreadMessages,
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
