// components/calendar/hooks/use-post-editor-workflow.ts

"use client";

import { useEffect, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import type { FullPostDetails } from "@/lib/api/publishing";
import type { ScheduledPost } from "../types";

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

  const populateStoreFromFullDetails = useCallback(
    (fullPost: FullPostDetails) => {
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
        // Hydrate other settings
        postType: fullPost.settings?.postType || "post",
        userTags: fullPost.settings?.userTags || {},
        productTags: fullPost.settings?.productTags || {},
      });

      setPublishingState({
        selectedAccounts: {
          [platform]: [fullPost.integrationId],
        },
        recycleInterval: fullPost.recycleInterval,
        // If editing a scheduled post, hydrate schedule data
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

  // Effect to populate stores when post data is loaded (Edit Mode)
  useEffect(() => {
    if (
      fullPostData &&
      !isFetchingFullPost &&
      selectedPost &&
      selectedPost.status !== "sent" && // Only populate for editable posts
      selectedPost.id === fullPostData.id
    ) {
      populateStoreFromFullDetails(fullPostData);
    }

    if (isErrorFullPost && selectedPost?.status !== "sent") {
      toast.error(`Failed to load post for editing: ${errorFullPost?.message}`);
      setSelectedPost(null);
      closeEditorialModal();
    }
  }, [
    fullPostData,
    isFetchingFullPost,
    isErrorFullPost,
    errorFullPost,
    selectedPost,
    populateStoreFromFullDetails,
    setSelectedPost,
    closeEditorialModal,
  ]);

  const handleEditPost = useCallback(
    (post: ScheduledPost) => {
      resetDraft();
      resetPublishing();
      resetUI();

      setSelectedPost(post);
      openEditorialModal();
    },
    [resetDraft, resetPublishing, resetUI, openEditorialModal, setSelectedPost]
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

    // If we have the full details loaded (e.g. background fetch completed), use them
    if (fullPostData && fullPostData.id === selectedPost.id) {
      populateStoreFromFullDetails(fullPostData);
    } else {
      // Fallback: Populate from the summary available in selectedPost
      // This loses crop data and precise settings, but works for basic reuse
      const mediaItems: MediaItem[] = selectedPost.media.map((m) => ({
        uid: crypto.randomUUID(),
        id: null, // Reset ID for new post
        file: null,
        preview: m.thumbnailUrl || m.url,
        mediaUrl: m.url,
        isUploading: false,
        type: m.type.startsWith("video") ? "video" : "image",
      }));

      setStagedMediaItems(mediaItems);

      const platform = selectedPost.platform;
      const mediaUids = mediaItems.map((m) => m.uid);

      setDraftState({
        mainCaption: selectedPost.content,
        platformMediaSelections: {
          [platform]: mediaUids,
        },
      });

      // Note: Integration ID is missing in summary, so selectedAccounts can't be set accurately
      // without fullPostData. User will need to re-select account or we rely on fullPostData fetch.
    }

    // Crucial: Clear the "selectedPost" so the Modal switches to Edit Mode (Create State)
    setSelectedPost(null);

    // Clear scheduling so it defaults to draft/now
    setPublishingState({
      isScheduling: false,
      scheduleDate: format(new Date(), "yyyy-MM-dd"),
      scheduleTime: "12:00",
    });

    toast.success("Post reused. You can now edit it as a new draft.");
  }, [
    selectedPost,
    fullPostData,
    populateStoreFromFullDetails,
    setStagedMediaItems,
    setDraftState,
    setPublishingState,
    setSelectedPost,
  ]);

  return {
    handleEditPost,
    handleNewPost,
    handleReusePost,
  };
}
