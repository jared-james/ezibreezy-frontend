"use client";

import { useEffect, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query"; // Import QueryClient
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import type { FullPostDetails } from "@/lib/types/publishing";
import type { ScheduledPost } from "../types";
import { useParams } from "next/navigation";

interface UsePostEditorWorkflowProps {
  fullPostData: FullPostDetails | undefined;
  isFetchingFullPost: boolean;
  isErrorFullPost: boolean;
  errorFullPost: Error | null;
  selectedPost: ScheduledPost | null;
  setSelectedPost: (post: ScheduledPost | null) => void;
  openEditorialModal: () => void;
  closeEditorialModal: () => void;
}

export function usePostEditorWorkflow({
  fullPostData,
  isFetchingFullPost,
  isErrorFullPost,
  errorFullPost,
  selectedPost,
  setSelectedPost,
  openEditorialModal,
  closeEditorialModal,
}: UsePostEditorWorkflowProps) {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const queryClient = useQueryClient();

  const setDraftState = useEditorialDraftStore((state) => state.setDraftState);
  const setStagedMediaItems = useEditorialDraftStore(
    (state) => state.setStagedMediaItems
  );
  const resetDraft = useEditorialDraftStore((state) => state.resetDraft);

  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );
  const resetPublishing = usePublishingStore((state) => state.resetPublishing);

  const resetUI = useEditorialUIStore((state) => state.resetUI);

  const populateStoreFromSummary = useCallback(
    (summary: ScheduledPost) => {
      console.log(
        `[Calendar Debug] ⚡ Applying SUMMARY data to store for post: ${summary.id}`
      );

      // === PRE-SEED CONNECTION CACHE ===
      // This ensures PreviewPanel renders immediately without waiting for /integrations/connections
      queryClient.setQueryData<any[]>(["connections", workspaceId], (old) => {
        const existing = old || [];
        const exists = existing.find((c) => c.id === summary.integrationId);
        if (exists) return existing;

        // Create a temporary connection object based on summary data
        const tempConnection = {
          id: summary.integrationId,
          platform: summary.platform,
          platformUsername: summary.platformUsername,
          name: summary.platformUsername, // Fallback since we don't have Display Name in summary
          avatarUrl: null, // We don't have avatar in summary yet, but that's okay
          // If you add avatarUrl to mapPostToResponse, you can add it here too
        };

        return [...existing, tempConnection];
      });

      const mediaItems: MediaItem[] = (summary.media || []).map((m) => ({
        uid: crypto.randomUUID(),
        id: m.id,
        file: null,
        preview: m.thumbnailUrl || m.url,
        mediaUrl: m.url,
        isUploading: false,
        type: m.type.startsWith("video") ? "video" : "image",
      }));

      setStagedMediaItems(mediaItems);

      const platform = summary.platform;
      const mediaUids = mediaItems.map((m) => m.uid);

      setDraftState({
        mainCaption: summary.content,
        platformMediaSelections: {
          [platform]: mediaUids,
        },
        postType: (summary.postType as any) || "post",
      });

      setPublishingState({
        selectedAccounts: {
          [platform]: [summary.integrationId],
        },
        ...(summary.status === "scheduled" && summary.scheduledAt
          ? {
              isScheduling: true,
              scheduleDate: format(new Date(summary.scheduledAt), "yyyy-MM-dd"),
              scheduleTime: format(new Date(summary.scheduledAt), "HH:mm"),
            }
          : {}),
      });
    },
    [
      setStagedMediaItems,
      setDraftState,
      setPublishingState,
      queryClient,
      workspaceId,
    ]
  );

  const populateStoreFromFullDetails = useCallback(
    (fullPost: FullPostDetails) => {
      console.log(
        `[Calendar Debug] 📦 Applying FULL DETAILS to store for post: ${fullPost.id}`
      );

      const newMediaItems: MediaItem[] = [];
      const mediaMap = fullPost.allMedia || {};
      const idToUidMap = new Map<string, string>();

      const allMediaIds = Array.from(
        new Set([
          ...fullPost.mediaIds,
          ...(fullPost.threadMessages || []).flatMap((m) => m.mediaIds),
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

      setStagedMediaItems(newMediaItems);

      const threadMessages = (fullPost.threadMessages || []).map((msg) => ({
        content: msg.content,
        mediaIds: msg.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      }));

      const platform = fullPost.integration.platform;

      setDraftState({
        mainCaption: fullPost.settings?.canonicalContent || fullPost.content,
        platformMediaSelections: {
          [platform]: fullPost.mediaIds
            .map((id) => idToUidMap.get(id))
            .filter(Boolean) as string[],
        },
        platformThreadMessages: {
          [platform]: threadMessages,
        },
        threadMessages: threadMessages,
        postType: fullPost.settings?.postType || "post",
        userTags: fullPost.settings?.userTags || {},
        productTags: fullPost.settings?.productTags || {},
      });

      setPublishingState({
        selectedAccounts: {
          [platform]: [fullPost.integrationId],
        },
        recycleInterval: fullPost.recycleInterval,
        ...(fullPost.status === "scheduled" && fullPost.scheduledAt
          ? {
              isScheduling: true,
              scheduleDate: format(
                new Date(fullPost.scheduledAt),
                "yyyy-MM-dd"
              ),
              scheduleTime: format(new Date(fullPost.scheduledAt), "HH:mm"),
            }
          : {}),
      });
    },
    [setStagedMediaItems, setDraftState, setPublishingState]
  );

  useEffect(() => {
    if (
      fullPostData &&
      !isFetchingFullPost &&
      selectedPost &&
      selectedPost.status !== "sent" &&
      selectedPost.id === fullPostData.id
    ) {
      populateStoreFromFullDetails(fullPostData);
    }

    if (isErrorFullPost && selectedPost?.status !== "sent") {
      toast.error(`Failed to load post details: ${errorFullPost?.message}`);
    }
  }, [
    fullPostData,
    isFetchingFullPost,
    isErrorFullPost,
    errorFullPost,
    selectedPost,
    populateStoreFromFullDetails,
  ]);

  const handleEditPost = useCallback(
    (post: ScheduledPost) => {
      console.log(`[Calendar Debug] 🖱️ User clicked edit post: ${post.id}`);

      resetDraft();
      resetPublishing();
      resetUI();

      populateStoreFromSummary(post);

      setSelectedPost(post);
      openEditorialModal();
    },
    [
      resetDraft,
      resetPublishing,
      resetUI,
      populateStoreFromSummary,
      setSelectedPost,
      openEditorialModal,
    ]
  );

  const handleNewPost = useCallback(
    (date: Date) => {
      resetDraft();
      resetPublishing();
      resetUI();
      setSelectedPost(null);
      setPublishingState({
        scheduleDate: format(date, "yyyy-MM-dd"),
        isScheduling: true,
      });
      openEditorialModal();
    },
    [
      resetDraft,
      resetPublishing,
      resetUI,
      setPublishingState,
      openEditorialModal,
      setSelectedPost,
    ]
  );

  const handleReusePost = useCallback(() => {
    if (!selectedPost) return;

    if (fullPostData && fullPostData.id === selectedPost.id) {
      populateStoreFromFullDetails(fullPostData);
    } else {
      populateStoreFromSummary(selectedPost);
    }

    setSelectedPost(null);

    setPublishingState({
      isScheduling: false,
      scheduleDate: format(new Date(), "yyyy-MM-dd"),
      scheduleTime: "12:00",
    });

    toast.success("Post reused as new draft.");
  }, [
    selectedPost,
    fullPostData,
    populateStoreFromFullDetails,
    populateStoreFromSummary,
    setPublishingState,
    setSelectedPost,
  ]);

  return {
    handleEditPost,
    handleNewPost,
    handleReusePost,
  };
}
