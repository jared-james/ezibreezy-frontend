// lib/store/editorial/draft-store.ts

"use client";

import { create } from "zustand";
import { PlatformPostType, ThreadMessage } from "@/lib/types/editorial";
import { UserTagDto, ProductTagDto, FullPostDetails } from "@/lib/types/publishing";
import { PlatformCrops, SocialPlatform } from "@/lib/utils/crop-utils";
import { PLATFORM_RULES } from "@/lib/utils/media-validation";

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

export interface DraftState {
  mainCaption: string;
  platformCaptions: Record<string, string>;
  platformTitles: Record<string, string>;
  stagedMediaItems: MediaItem[];
  platformMediaSelections: Record<string, string[]>;
  threadMessages: ThreadMessage[];
  platformThreadMessages: Record<string, ThreadMessage[]>;
  firstComment: string;
  facebookFirstComment: string;
  postType: PlatformPostType;
  facebookPostType: PlatformPostType;
  userTags: Record<string, UserTagDto[]>;
  productTags: Record<string, ProductTagDto[]>;
  instagramCoverUrl: string | null;
  instagramThumbOffset: number | null;
  instagramShareToFeed: boolean;
  tiktokVideoCoverTimestamp: number | null;
}

export interface DraftActions {
  setDraftState: (updates: Partial<DraftState>) => void;
  setStagedMediaItems: (items: MediaItem[]) => void;
  setThreadMessages: (messages: ThreadMessage[]) => void;
  setPlatformMediaSelection: (platformId: string, mediaUids: string[]) => void;
  togglePlatformMediaSelection: (platformId: string, mediaUid: string) => void;
  toggleThreadMediaSelection: (
    platformId: string,
    threadIndex: number,
    mediaUid: string
  ) => void;
  setCropForMedia: (
    mediaUid: string,
    platform: SocialPlatform,
    cropData: PlatformCrops[SocialPlatform],
    croppedPreviewUrl: string
  ) => void;
  initializeFromFullPost: (fullPost: FullPostDetails) => void;
  resetDraft: () => void;
}

const initialDraftState: DraftState = {
  mainCaption: "",
  platformCaptions: {},
  platformTitles: {},
  stagedMediaItems: [],
  platformMediaSelections: {},
  threadMessages: [],
  platformThreadMessages: {},
  firstComment: "",
  facebookFirstComment: "",
  postType: "post",
  facebookPostType: "post",
  userTags: {},
  productTags: {},
  instagramCoverUrl: null,
  instagramThumbOffset: null,
  instagramShareToFeed: true,
  tiktokVideoCoverTimestamp: null,
};

export const useEditorialDraftStore = create<DraftState & DraftActions>(
  (set, get) => ({
    ...initialDraftState,

    setDraftState: (updates) => {
      set((state) => ({ ...state, ...updates }));
    },

    setStagedMediaItems: (items) => {
      set({ stagedMediaItems: items });
    },

    setThreadMessages: (messages) => set({ threadMessages: messages }),

    setPlatformMediaSelection: (platformId, mediaUids) => {
      set((state) => ({
        platformMediaSelections: {
          ...state.platformMediaSelections,
          [platformId]: mediaUids,
        },
      }));
    },

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

    initializeFromFullPost: (fullPost) => {
      const newMediaItems: MediaItem[] = [];
      const mediaMap = fullPost.allMedia || {};
      const idToUidMap = new Map<string, string>();

      // Collect all unique media IDs from main post and threads
      const allMediaIds = Array.from(
        new Set([
          ...fullPost.mediaIds,
          ...fullPost.threadMessages.flatMap((m) => m.mediaIds),
        ])
      );

      // Convert server media to client MediaItems with UIDs
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
            originalUrlForCropping: mediaRecord.url,
            isUploading: false,
            type: mediaRecord.type.startsWith("video") ? "video" : "image",
          });
        }
      });

      // Map media IDs to UIDs for platform selections
      const platformMediaSelection = {
        [fullPost.integration.platform]: fullPost.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      };

      // Convert thread messages with UID mapping
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
        threadMessages,
        platformThreadMessages,
      });
    },

    resetDraft: () => {
      set(initialDraftState);
    },
  })
);
