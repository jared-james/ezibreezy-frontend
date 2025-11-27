// lib/hooks/use-post-editor.ts

import { useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
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
} from "lucide-react";
import { createPost, type CreatePostPayload } from "@/lib/api/publishing";
import { generateVideoThumbnail } from "@/lib/utils/video-thumbnail";

interface UsePostEditorOptions {
  mode?: "editorial" | "clipping";
}

export function usePostEditor(options: UsePostEditorOptions = {}) {
  const { mode = "editorial" } = options;
  const queryClient = useQueryClient();

  const setState = useEditorialStore((state) => state.setState);
  const setThreadMessages = useEditorialStore(
    (state) => state.setThreadMessages
  );
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);
  const setStagedMediaItems = useEditorialStore(
    (state) => state.setStagedMediaItems
  );
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const threadMessages = useEditorialStore((state) => state.threadMessages);
  const platformThreadMessages = useEditorialStore(
    (state) => state.platformThreadMessages
  );
  const toggleThreadMediaSelection = useEditorialStore(
    (state) => state.toggleThreadMediaSelection
  );

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
      integrationId: string;
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

      return uploadMedia(variables.file, variables.integrationId, thumbnail);
    },
    onSuccess: (data, variables) => {
      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === variables.uid
          ? { ...item, id: data.mediaId, isUploading: false }
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
      const currentItems = useEditorialStore.getState().stagedMediaItems;
      setStagedMediaItems(
        currentItems.filter((item) => item.uid !== variables.uid)
      );
    },
  });

  // All media is now "main post" media in terms of the global list.
  // Thread specific selection is handled by reference via UIDs.
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
        // Find media items based on the UIDs stored in msg.mediaIds
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
      const currentSelectedAccounts =
        useEditorialStore.getState().selectedAccounts;
      const allIds = Object.values(currentSelectedAccounts).flat();
      const uploadIntegrationId = allIds[0];

      if (files.length > 0 && !uploadIntegrationId) {
        toast.error("Please select at least one account before uploading.");
        return;
      }

      const newMediaItems: MediaItem[] = files.map((file, index) => ({
        uid: crypto.randomUUID(),
        file,
        preview: previews[index],
        id: null,
        isUploading: true,
        type: file.type.startsWith("video/") ? "video" : "image",
      }));

      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = [...currentItems, ...newMediaItems];
      setStagedMediaItems(updatedItems);

      if (mode === "editorial") {
        newMediaItems.forEach((item) => {
          uploadMediaMutation.mutate({
            file: item.file!,
            integrationId: uploadIntegrationId,
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
    [setStagedMediaItems, uploadMediaMutation, mode]
  );

  const handleRemoveMedia = useCallback(
    (fileToRemove: File | null, indexToRemove?: number) => {
      const currentItems = useEditorialStore.getState().stagedMediaItems;
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
        setStagedMediaItems(newMediaItems);

        // Cleanup: Remove this UID from all platform selections AND thread messages
        const state = useEditorialStore.getState();

        // 1. Clean Platform Selections
        const newSelections = { ...state.platformMediaSelections };
        Object.keys(newSelections).forEach((platformId) => {
          newSelections[platformId] = newSelections[platformId].filter(
            (uid) => uid !== itemToRemove!.uid
          );
        });

        // 2. Clean Thread Messages
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

        setState({
          platformMediaSelections: newSelections,
          threadMessages: newThreadMessages,
          platformThreadMessages: newPlatformThreadMessages,
        });
      }
    },
    [setStagedMediaItems, setState]
  );

  const handleLibraryMediaSelect = useCallback(
    (libraryMedia: any) => {
      const currentItems = useEditorialStore.getState().stagedMediaItems;

      const existingItem = currentItems.find(
        (item) => item.id === libraryMedia.id
      );

      if (existingItem) {
        const newMediaItems = currentItems.filter(
          (item) => item.id !== libraryMedia.id
        );
        setStagedMediaItems(newMediaItems);
        // Cleanup logic handled by handleRemoveMedia in effect, but simplified here for toggle behavior
        // If we untoggle from library, we essentially remove it globally.

        // Same cleanup logic as handleRemoveMedia
        const state = useEditorialStore.getState();
        const newSelections = { ...state.platformMediaSelections };
        Object.keys(newSelections).forEach((platformId) => {
          newSelections[platformId] = newSelections[platformId].filter(
            (uid) => uid !== existingItem.uid
          );
        });

        // Clean Thread Messages
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

        setState({
          platformMediaSelections: newSelections,
          threadMessages: newThreadMessages,
          platformThreadMessages: newPlatformThreadMessages,
        });
      } else {
        const newMediaItem: MediaItem = {
          uid: crypto.randomUUID(),
          file: null,
          preview: libraryMedia.thumbnailUrl || libraryMedia.url,
          id: libraryMedia.id,
          isUploading: false,
          type: libraryMedia.type.startsWith("video/") ? "video" : "image",
          altText: libraryMedia.altText || null,
        };

        const updatedItems = [...currentItems, newMediaItem];
        setStagedMediaItems(updatedItems);
      }
    },
    [setStagedMediaItems, setState]
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
    updateState: setState,
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
