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
  postIdToEdit: string | null;
  setPostIdToEdit: (id: string | null) => void;
  openEditorialModal: () => void;
  closeEditorialModal: () => void;
}

export function usePostEditorWorkflow({
  fullPostData,
  isFetchingFullPost,
  isErrorFullPost,
  errorFullPost,
  postIdToEdit,
  setPostIdToEdit,
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

  // Effect to populate stores when post data is loaded
  useEffect(() => {
    if (fullPostData && !isFetchingFullPost && postIdToEdit) {
      const newMediaItems: MediaItem[] = [];
      const mediaMap = fullPostData.allMedia || {};
      const idToUidMap = new Map<string, string>();

      const allMediaIds = Array.from(
        new Set([
          ...fullPostData.mediaIds,
          ...(fullPostData.threadMessages || []).flatMap((m) => m.mediaIds),
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

      const threadMessages = (fullPostData.threadMessages || []).map((msg) => ({
        content: msg.content,
        mediaIds: msg.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      }));

      const platform = fullPostData.integration.platform;

      setDraftState({
        mainCaption:
          fullPostData.settings?.canonicalContent || fullPostData.content,
        platformMediaSelections: {
          [platform]: fullPostData.mediaIds
            .map((id) => idToUidMap.get(id))
            .filter(Boolean) as string[],
        },
        platformThreadMessages: {
          [platform]: threadMessages,
        },
        threadMessages: threadMessages,
      });

      setPublishingState({
        selectedAccounts: {
          [platform]: [fullPostData.integrationId],
        },
      });

      setPostIdToEdit(null);
    }

    if (isErrorFullPost) {
      toast.error(`Failed to load post for editing: ${errorFullPost?.message}`);
      setPostIdToEdit(null);
      closeEditorialModal();
    }
  }, [
    fullPostData,
    isFetchingFullPost,
    isErrorFullPost,
    errorFullPost,
    postIdToEdit,
    setDraftState,
    setStagedMediaItems,
    setPublishingState,
    setPostIdToEdit,
    closeEditorialModal,
  ]);

  const handleEditPost = useCallback(
    (post: ScheduledPost) => {
      if (post.status === "sent") {
        toast.info("Sent posts cannot be edited. A copy will be created.");
      }
      resetDraft();
      resetPublishing();
      resetUI();

      openEditorialModal();
      setPostIdToEdit(post.id);
    },
    [resetDraft, resetPublishing, resetUI, openEditorialModal, setPostIdToEdit]
  );

  const handleNewPost = useCallback(
    (date: Date) => {
      resetDraft();
      resetPublishing();
      resetUI();
      setPublishingState({
        scheduleDate: format(date, "yyyy-MM-dd"),
        isScheduling: true,
      });
      openEditorialModal();
    },
    [resetDraft, resetPublishing, resetUI, setPublishingState, openEditorialModal]
  );

  const resetStores = useCallback(() => {
    resetDraft();
    resetPublishing();
    resetUI();
  }, [resetDraft, resetPublishing, resetUI]);

  return {
    handleEditPost,
    handleNewPost,
    resetStores,
  };
}
