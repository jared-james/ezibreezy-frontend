// components/calendar/hooks/use-post-editor-workflow.ts

"use client";

import { useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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

  // Track if we have already populated from summary to prevent aggressive overwrites
  const hasInitializedFromSummary = useRef<string | null>(null);

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

  // 1. FAST PATH: Populate store immediately from Calendar Card data
  const populateStoreFromSummary = useCallback(
    (summary: ScheduledPost) => {
      const start = performance.now();
      console.log(
        `[Perf Audit] ⚡ STORE ACTION: Populating from Summary for ${summary.id}`
      );

      hasInitializedFromSummary.current = summary.id;

      // === PRE-SEED CONNECTION CACHE (Kill the 3s delay) ===
      // We explicitly construct the connection object the PreviewPanel expects.
      queryClient.setQueryData<any[]>(["connections", workspaceId], (old) => {
        const existing = old || [];
        const exists = existing.find((c) => c.id === summary.integrationId);

        // If we already have it, don't touch cache to preserve referential identity
        if (exists) return existing;

        console.log(
          `[Perf Audit] 💉 CACHE INJECTION: Seeding connection for ${summary.platformUsername}`
        );

        // Create a temporary connection object based on summary data
        const tempConnection = {
          id: summary.integrationId,
          platform: summary.platform,
          platformUsername: summary.platformUsername,
          name: summary.platformUsername, // Fallback if name is missing
          avatarUrl: summary.avatarUrl,
          connected: true, // Assume connected since we are editing a post
          workspaceId: workspaceId,
        };

        return [...existing, tempConnection];
      });

      // Map Media
      const mediaItems: MediaItem[] = (summary.media || []).map((m) => ({
        uid: crypto.randomUUID(),
        id: m.id,
        file: null,
        preview: m.thumbnailUrl || m.url,
        mediaUrl: m.url,
        isUploading: false,
        type: m.type.startsWith("video") ? "video" : "image",
        // Crops are available in summary, apply them early if present
        crops: summary.mediaCrops?.[m.id] || undefined,
      }));

      setStagedMediaItems(mediaItems);

      const platform = summary.platform;
      const mediaUids = mediaItems.map((m) => m.uid);

      // Set Content
      setDraftState({
        mainCaption: summary.content,
        platformMediaSelections: {
          [platform]: mediaUids,
        },
        postType: (summary.postType as any) || "post",
        // If we have thread size but no details yet, we can at least prep the UI
        // (Detailed thread content will come in the full fetch)
      });

      // Set Scheduling/Publishing Settings
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

      const duration = performance.now() - start;
      console.log(
        `[Perf Audit] ✅ STORE COMPLETE: Summary Applied in ${duration.toFixed(
          2
        )}ms`
      );
    },
    [
      setStagedMediaItems,
      setDraftState,
      setPublishingState,
      queryClient,
      workspaceId,
    ]
  );

  // 2. SLOW PATH: Enrich with full details (Silent Sync)
  const populateStoreFromFullDetails = useCallback(
    (fullPost: FullPostDetails) => {
      const start = performance.now();
      const isEnrichment = hasInitializedFromSummary.current === fullPost.id;

      console.log(
        `[Perf Audit] 📦 STORE ACTION: Merging Full Details for ${fullPost.id} (Enrichment Mode: ${isEnrichment})`
      );

      // If this is an enrichment (we already showed summary data),
      // we strictly avoid overwriting things the user might have already touched (like caption).
      // We only fill in "Missing" deep data (settings, tags, specific crops).

      // Map Media IDs to the UIDs we generated in summary step
      // If we are initializing from scratch (deep link), we generate new UIDs.
      const currentDraftState = useEditorialDraftStore.getState();
      const currentStagedItems = currentDraftState.stagedMediaItems;

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
        // Try to find existing UID from summary initialization
        const existingItem = currentStagedItems.find(
          (item) => item.id === mediaId
        );

        if (existingItem) {
          idToUidMap.set(mediaId, existingItem.uid);
          // Update existing item with high-res url or metadata if needed
          newMediaItems.push(existingItem);
        } else {
          // New item (maybe from a hidden thread message not in summary)
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
        }
      });

      // Only update media items if we found new ones or are initializing
      if (!isEnrichment || newMediaItems.length > currentStagedItems.length) {
        setStagedMediaItems(newMediaItems);
      }

      const threadMessages = (fullPost.threadMessages || []).map((msg) => ({
        content: msg.content,
        mediaIds: msg.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      }));

      const platform = fullPost.integration.platform;

      // Prepare Draft Updates
      const draftUpdates: any = {
        platformThreadMessages: {
          [platform]: threadMessages,
        },
        threadMessages: threadMessages,
        // Always sync deep settings that aren't in summary
        userTags: fullPost.settings?.userTags || {},
        productTags: fullPost.settings?.productTags || {},
      };

      // Only overwrite main attributes if we are NOT enriching (i.e. deep link load)
      if (!isEnrichment) {
        draftUpdates.mainCaption =
          fullPost.settings?.canonicalContent || fullPost.content;
        draftUpdates.platformMediaSelections = {
          [platform]: fullPost.mediaIds
            .map((id) => idToUidMap.get(id))
            .filter(Boolean) as string[],
        };
        draftUpdates.postType = fullPost.settings?.postType || "post";
      }

      setDraftState(draftUpdates);

      // Publishing State Updates
      const publishingUpdates: any = {
        recycleInterval: fullPost.recycleInterval,
      };

      if (!isEnrichment) {
        publishingUpdates.selectedAccounts = {
          [platform]: [fullPost.integrationId],
        };

        if (fullPost.status === "scheduled" && fullPost.scheduledAt) {
          publishingUpdates.isScheduling = true;
          publishingUpdates.scheduleDate = format(
            new Date(fullPost.scheduledAt),
            "yyyy-MM-dd"
          );
          publishingUpdates.scheduleTime = format(
            new Date(fullPost.scheduledAt),
            "HH:mm"
          );
        }
      }

      setPublishingState(publishingUpdates);

      const duration = performance.now() - start;
      console.log(
        `[Perf Audit] ✅ STORE COMPLETE: Full Details Applied in ${duration.toFixed(
          2
        )}ms`
      );
    },
    [setStagedMediaItems, setDraftState, setPublishingState]
  );

  useEffect(() => {
    // If full data arrives and matches the selected post
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
      console.log(
        `[Perf Audit] 🖱️ UI INTERACTION: User clicked edit post ${post.id}`
      );

      // Clear previous tracking
      hasInitializedFromSummary.current = null;

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
      hasInitializedFromSummary.current = null;
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

    // When reusing, we treat it as a new init, so reset the tracker
    hasInitializedFromSummary.current = null;

    if (fullPostData && fullPostData.id === selectedPost.id) {
      // If we have full data, reuse that (it's richer)
      // Force "INIT" mode by clearing the ref before calling
      populateStoreFromFullDetails(fullPostData);
    } else {
      // Fallback to summary reuse
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
