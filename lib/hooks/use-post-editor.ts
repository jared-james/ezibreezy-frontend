// lib/hooks/use-post-editor.ts

import { useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { uploadMedia } from "@/lib/api/media";
import { getConnections, type Connection } from "@/lib/api/integrations";
import type { Platform, ThreadMessageAugmented } from "@/lib/types/editorial";
import {
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  AtSign,
  Music2,
  Pin,
} from "lucide-react";
import { createPost, type CreatePostPayload } from "@/lib/api/publishing";
import { generateVideoThumbnail } from "@/lib/utils/video-thumbnail";
import { getAutoSelectionForPlatform } from "@/lib/utils/media-validation";
import { getClientDataForEditor } from "@/app/actions/data";

interface UsePostEditorOptions {
  mode?: "editorial" | "clipping";
}

export function usePostEditor(options: UsePostEditorOptions = {}) {
  const { mode = "editorial" } = options;
  const queryClient = useQueryClient();

  // Draft Store (Content)
  const setDraftState = useEditorialDraftStore((state) => state.setDraftState);
  const setThreadMessages = useEditorialDraftStore(
    (state) => state.setThreadMessages
  );
  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const setStagedMediaItems = useEditorialDraftStore(
    (state) => state.setStagedMediaItems
  );
  const threadMessages = useEditorialDraftStore(
    (state) => state.threadMessages
  );
  const platformThreadMessages = useEditorialDraftStore(
    (state) => state.platformThreadMessages
  );
  const toggleThreadMediaSelection = useEditorialDraftStore(
    (state) => state.toggleThreadMediaSelection
  );
  const platformMediaSelections = useEditorialDraftStore(
    (state) => state.platformMediaSelections
  );

  // Publishing Store (Logistics)
  const selectedAccounts = usePublishingStore(
    (state) => state.selectedAccounts
  );

  const { data: clientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: Infinity,
  });

  const organizationId = clientData?.organizationId;

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const postMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onError: (error: any) => {
      console.error("Failed to create post:", error);
      toast.error(
        `Failed to publish post: ${
          error?.response?.data?.message || "An unknown error occurred."
        }`
      );
    },
  });

  const uploadMediaMutation = useMutation({
    mutationFn: async (variables: {
      file: File;
      organizationId: string;
      uid: string;
    }) => {
      let thumbnail: File | undefined;

      if (variables.file.type.startsWith("video/")) {
        try {
          thumbnail = await generateVideoThumbnail(variables.file);
        } catch (e) {
          console.warn("Failed to generate client-side thumbnail", e);
        }
      }

      return uploadMedia(variables.file, variables.organizationId, thumbnail);
    },
    onSuccess: (data, variables) => {
      const currentItems = useEditorialDraftStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === variables.uid
          ? {
              ...item,
              id: data.mediaId,
              isUploading: false,
              mediaUrl: data.url,
              preview: data.thumbnailUrl || data.url,
            }
          : item
      );
      setStagedMediaItems(updatedItems);

      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: any, variables) => {
      toast.error(
        `Upload failed for ${variables.file.name}: ${
          error?.message || "Unknown error"
        }`
      );
      const currentItems = useEditorialDraftStore.getState().stagedMediaItems;
      setStagedMediaItems(
        currentItems.filter((item) => item.uid !== variables.uid)
      );
    },
  });

  const isGlobalUploading = useMemo(
    () => stagedMediaItems.some((m) => m.isUploading),
    [stagedMediaItems]
  );

  const postType: "text" | "image" | "video" = useMemo(() => {
    if (stagedMediaItems.length === 0) return "text";
    if (stagedMediaItems.some((m) => m.type === "video")) {
      return "video";
    }
    return "image";
  }, [stagedMediaItems]);

  const availablePlatforms = useMemo((): Platform[] => {
    if (!connections) return [];
    const connectionsByPlatform = connections.reduce((acc, conn) => {
      acc[conn.platform] = acc[conn.platform] || [];
      acc[conn.platform].push(conn);
      return acc;
    }, {} as Record<string, Connection[]>);

    const fullPlatformDefinitions: Record<string, { name: string; icon: any }> =
      {
        x: { name: "Twitter/X", icon: Twitter },
        linkedin: { name: "LinkedIn", icon: Linkedin },
        youtube: { name: "YouTube", icon: Youtube },
        instagram: { name: "Instagram", icon: Instagram },
        facebook: { name: "Facebook", icon: Facebook },
        threads: { name: "Threads", icon: AtSign },
        tiktok: { name: "TikTok", icon: Music2 },
        pinterest: { name: "Pinterest", icon: Pin },
      };

    return Object.keys(fullPlatformDefinitions).map((platformId) => {
      const def = fullPlatformDefinitions[platformId];
      const accounts =
        connectionsByPlatform[platformId]?.map((conn) => ({
          id: conn.id,
          name: conn.name || `@${conn.platformUsername}`,
          img: conn.avatarUrl || "/placeholder-pfp.png",
        })) || [];
      return { ...def, id: platformId, accounts };
    });
  }, [connections]);

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );

  const stagedMediaPreviews = useMemo(
    () => stagedMediaItems.map((m) => m.preview),
    [stagedMediaItems]
  );

  const augmentThreadMessages = useCallback(
    (messages: typeof threadMessages): ThreadMessageAugmented[] => {
      return messages.map((msg) => {
        const threadMedia = (msg.mediaIds || [])
          .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
          .filter(Boolean) as MediaItem[];

        const hasVideo = threadMedia.some((m) => m.type === "video");
        return {
          ...msg,
          mediaPreviews: threadMedia
            .map((m) => m.preview)
            .filter(Boolean) as string[],
          mediaFiles: threadMedia.map((m) => m.file!).filter(Boolean) as File[],
          isUploading: threadMedia.some((m) => m.isUploading),
          mediaType:
            threadMedia.length > 0 ? (hasVideo ? "video" : "image") : "text",
        };
      });
    },
    [stagedMediaItems]
  );

  const threadMessagesWithPreviews: ThreadMessageAugmented[] = useMemo(() => {
    return augmentThreadMessages(threadMessages);
  }, [threadMessages, augmentThreadMessages]);

  const getThreadMessagesForPlatform = useCallback(
    (platformId: string): ThreadMessageAugmented[] => {
      const platformSpecific = platformThreadMessages[platformId];
      if (platformSpecific && platformSpecific.length > 0) {
        return augmentThreadMessages(platformSpecific);
      }
      return augmentThreadMessages(threadMessages);
    },
    [platformThreadMessages, threadMessages, augmentThreadMessages]
  );

  const handleMediaChange = useCallback(
    (files: File[], previews: string[]) => {
      if (files.length > 0 && !organizationId) {
        toast.error("Organization context missing. Please refresh.");
        return;
      }

      const newMediaItems: MediaItem[] = files.map((file, index) => ({
        uid: crypto.randomUUID(),
        file,
        preview: previews[index],
        mediaUrl: previews[index],
        id: null,
        isUploading: true,
        type: file.type.startsWith("video/") ? "video" : "image",
      }));

      // Read directly from stores to ensure freshness
      const currentItems = useEditorialDraftStore.getState().stagedMediaItems;
      const currentSelectedAccounts =
        usePublishingStore.getState().selectedAccounts;
      const currentMediaSelections =
        useEditorialDraftStore.getState().platformMediaSelections;

      const updatedItems = [...currentItems, ...newMediaItems];
      const activePlatformIds = Object.keys(currentSelectedAccounts);
      const newMediaSelections = { ...currentMediaSelections };

      activePlatformIds.forEach((platformId) => {
        const currentSelectionUids = newMediaSelections[platformId] || [];
        const currentSelectionItems = currentSelectionUids
          .map((uid) => currentItems.find((i) => i.uid === uid))
          .filter(Boolean) as MediaItem[];

        const uidsToAdd = getAutoSelectionForPlatform(
          platformId,
          currentSelectionItems,
          newMediaItems
        );

        if (uidsToAdd.length > 0) {
          newMediaSelections[platformId] = [
            ...currentSelectionUids,
            ...uidsToAdd,
          ];
        }
      });

      setDraftState({
        stagedMediaItems: updatedItems,
        platformMediaSelections: newMediaSelections,
      });

      if (mode === "editorial") {
        newMediaItems.forEach((item) => {
          uploadMediaMutation.mutate({
            file: item.file!,
            organizationId: organizationId!,
            uid: item.uid,
          });
        });
      } else {
        const nonUploadingItems = updatedItems.map((item) => ({
          ...item,
          isUploading: false,
        }));
        setStagedMediaItems(nonUploadingItems);
      }
    },
    [
      setDraftState,
      setStagedMediaItems,
      uploadMediaMutation,
      mode,
      organizationId,
    ]
  );

  const handleRemoveMedia = useCallback(
    (fileToRemove: File | null, indexToRemove?: number) => {
      const currentItems = useEditorialDraftStore.getState().stagedMediaItems;
      let itemToRemove: MediaItem | undefined;

      if (typeof indexToRemove === "number") {
        itemToRemove = currentItems[indexToRemove];
      } else if (fileToRemove) {
        itemToRemove = currentItems.find((item) => item.file === fileToRemove);
      }

      if (itemToRemove) {
        const newMediaItems = currentItems.filter(
          (item) => item.uid !== itemToRemove!.uid
        );

        // Read current state
        const state = useEditorialDraftStore.getState();

        const newSelections = { ...state.platformMediaSelections };
        Object.keys(newSelections).forEach((platformId) => {
          newSelections[platformId] = newSelections[platformId].filter(
            (uid) => uid !== itemToRemove!.uid
          );
        });

        const cleanThreadMessages = (messages: typeof threadMessages) =>
          messages.map((msg) => ({
            ...msg,
            mediaIds: (msg.mediaIds || []).filter(
              (uid) => uid !== itemToRemove!.uid
            ),
          }));

        const newThreadMessages = cleanThreadMessages(state.threadMessages);

        const newPlatformThreadMessages = { ...state.platformThreadMessages };
        Object.keys(newPlatformThreadMessages).forEach((pid) => {
          newPlatformThreadMessages[pid] = cleanThreadMessages(
            newPlatformThreadMessages[pid]
          );
        });

        setDraftState({
          stagedMediaItems: newMediaItems,
          platformMediaSelections: newSelections,
          threadMessages: newThreadMessages,
          platformThreadMessages: newPlatformThreadMessages,
        });
      }
    },
    [setDraftState, threadMessages]
  );

  const handleLibraryMediaSelect = useCallback(
    (libraryMedia: any) => {
      const currentItems = useEditorialDraftStore.getState().stagedMediaItems;
      const currentSelectedAccounts =
        usePublishingStore.getState().selectedAccounts;

      const existingItem = currentItems.find(
        (item) => item.id === libraryMedia.id
      );

      if (existingItem) {
        // Toggle off / Remove
        const newMediaItems = currentItems.filter(
          (item) => item.id !== libraryMedia.id
        );

        const state = useEditorialDraftStore.getState();
        const newSelections = { ...state.platformMediaSelections };
        Object.keys(newSelections).forEach((platformId) => {
          newSelections[platformId] = newSelections[platformId].filter(
            (uid) => uid !== existingItem.uid
          );
        });

        const cleanThreadMessages = (messages: typeof threadMessages) =>
          messages.map((msg) => ({
            ...msg,
            mediaIds: (msg.mediaIds || []).filter(
              (uid) => uid !== existingItem.uid
            ),
          }));

        const newThreadMessages = cleanThreadMessages(state.threadMessages);
        const newPlatformThreadMessages = { ...state.platformThreadMessages };
        Object.keys(newPlatformThreadMessages).forEach((pid) => {
          newPlatformThreadMessages[pid] = cleanThreadMessages(
            newPlatformThreadMessages[pid]
          );
        });

        setDraftState({
          stagedMediaItems: newMediaItems,
          platformMediaSelections: newSelections,
          threadMessages: newThreadMessages,
          platformThreadMessages: newPlatformThreadMessages,
        });
      } else {
        // Add
        const newMediaItem: MediaItem = {
          uid: crypto.randomUUID(),
          file: null,
          preview: libraryMedia.thumbnailUrl || libraryMedia.url,
          mediaUrl: libraryMedia.url,
          id: libraryMedia.id,
          isUploading: false,
          type: libraryMedia.type.startsWith("video/") ? "video" : "image",
          altText: libraryMedia.altText || null,
        };

        const updatedItems = [...currentItems, newMediaItem];
        const state = useEditorialDraftStore.getState();

        const activePlatformIds = Object.keys(currentSelectedAccounts);
        const newMediaSelections = { ...state.platformMediaSelections };

        activePlatformIds.forEach((platformId) => {
          const currentSelectionUids = newMediaSelections[platformId] || [];
          const currentSelectionItems = currentSelectionUids
            .map((uid) => updatedItems.find((i) => i.uid === uid))
            .filter(Boolean) as MediaItem[];

          const uidsToAdd = getAutoSelectionForPlatform(
            platformId,
            currentSelectionItems,
            [newMediaItem]
          );

          if (uidsToAdd.length > 0) {
            newMediaSelections[platformId] = [
              ...currentSelectionUids,
              ...uidsToAdd,
            ];
          }
        });

        setDraftState({
          stagedMediaItems: updatedItems,
          platformMediaSelections: newMediaSelections,
        });
      }
    },
    [setDraftState, threadMessages]
  );

  const selectedLibraryMediaIds = useMemo(() => {
    return new Set(
      stagedMediaItems
        .filter((item) => item.file === null && item.id !== null)
        .map((item) => item.id!)
    );
  }, [stagedMediaItems]);

  return {
    stagedMediaFiles: stagedMediaItems
      .map((m) => m.file!)
      .filter(Boolean) as File[],
    stagedMediaItems,
    stagedMediaPreviews,
    postType,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    threadMessages: threadMessagesWithPreviews,
    getThreadMessagesForPlatform,
    updateState: setDraftState,
    handleMediaChange,
    handleRemoveMedia,
    handleLibraryMediaSelect,
    selectedLibraryMediaIds,
    setThreadMessages,
    postMutation,
    connections,
    toggleThreadMediaSelection,
  };
}
