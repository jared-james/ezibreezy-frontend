// lib/hooks/use-post-editor.ts

import { useMemo, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useEditorialStore,
  initialState as editorInitialState,
  MediaItem,
} from "@/lib/store/editorial-store";
import { uploadMedia } from "@/lib/api/media";
import { getConnections, type Connection } from "@/lib/api/integrations";
import type {
  Platform,
  ThreadMessage,
  ThreadMessageAugmented,
  EditorialDraft,
} from "@/lib/types/editorial";
import { Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { createPost, type CreatePostPayload } from "@/lib/api/publishing";

const platformDefinitions = {
  x: { name: "Twitter/X", icon: Twitter },
  linkedin: { name: "LinkedIn", icon: "LinkedIn" },
  youtube: { name: "YouTube", icon: "YouTube" },
  instagram: { name: "Instagram", icon: "Instagram" },
};

// MODIFIED: The filter no longer uses the helper, but instead uses the correct logic inline
// The helper causes problems because `fileToRemove` has the problematic type
/*
const filterMediaItems = (mediaItems: MediaItem[], fileToRemove: File) =>
  mediaItems.filter((item) => item.file !== fileToRemove);
*/

export function usePostEditor() {
  const setState = useEditorialStore((state) => state.setState);
  const setThreadMessages = useEditorialStore(
    (state) => state.setThreadMessages
  );
  const mediaItems = useEditorialStore((state) => state.mediaItems);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const threadMessages = useEditorialStore((state) => state.threadMessages);

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
    mutationFn: (variables: {
      file: File;
      integrationId: string;
      threadIndex: number | null;
    }) => uploadMedia(variables.file, variables.integrationId),
    onSuccess: (data, variables) => {
      const currentStoreState = useEditorialStore.getState();
      setState({
        mediaItems: currentStoreState.mediaItems.map((item) =>
          item.file === variables.file
            ? { ...item, id: data.mediaId, isUploading: false }
            : item
        ),
        threadMessages:
          variables.threadIndex !== null
            ? currentStoreState.threadMessages.map((msg, i) =>
                i === variables.threadIndex
                  ? {
                      ...msg,
                      mediaIds: [...(msg.mediaIds || []), data.mediaId],
                    }
                  : msg
              )
            : currentStoreState.threadMessages,
      });
    },
    onError: (error: any, variables) => {
      toast.error(
        `Upload failed for ${variables.file.name}: ${
          error?.message || "Unknown error"
        }`
      );
      // MODIFIED: Inlining the filter logic and ensuring correct type comparison (it should compare to the File object, not the type)
      // Since `variables.file` is guaranteed to be a valid `File` by the mutation call, the old filter was likely fine,
      // but let's be explicit and remove the helper function reliance.
      setState({
        mediaItems: useEditorialStore
          .getState()
          .mediaItems.filter((item) => item.file !== variables.file),
      });
    },
  });

  const mainPostMedia = useMemo(
    () => mediaItems.filter((m) => m.threadIndex === null),
    [mediaItems]
  );

  const isGlobalUploading = useMemo(
    () => mediaItems.some((m) => m.isUploading),
    [mediaItems]
  );

  const postType: "text" | "image" | "video" = useMemo(() => {
    if (mainPostMedia.length === 0) return "text";

    if (
      mainPostMedia.some(
        (m) =>
          (m.file && (m.file as globalThis.File).type.startsWith("video/")) || // NEW: Explicitly assert type to globalThis.File
          (m.file === null &&
            (m.preview.toLowerCase().endsWith(".mp4") ||
              m.preview.toLowerCase().endsWith(".mov")))
      )
    ) {
      return "video";
    }
    return "image";
  }, [mainPostMedia]);

  const availablePlatforms = useMemo((): Platform[] => {
    // ... (rest of availablePlatforms logic remains the same)
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
      };

    return Object.keys(fullPlatformDefinitions).map((platformId) => {
      const def = fullPlatformDefinitions[platformId];
      const accounts =
        connectionsByPlatform[platformId]?.map((conn) => ({
          id: conn.id,
          name: `@${conn.platformUsername}`,
          img: conn.avatarUrl || "/placeholder-pfp.png",
        })) || [];
      return { ...def, id: platformId, accounts };
    });
  }, [connections]);

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );

  const mainPostMediaPreviews = useMemo(
    () => mainPostMedia.map((m) => m.preview),
    [mainPostMedia]
  );

  const threadMessagesWithPreviews: ThreadMessageAugmented[] = useMemo(() => {
    return threadMessages.map((msg, index) => {
      const threadMedia = mediaItems.filter((m) => m.threadIndex === index);
      return {
        ...msg,
        mediaPreviews: threadMedia
          .map((m) => m.preview)
          .filter(Boolean) as string[],
        // FIX: Added non-null assertion to map
        mediaFiles: threadMedia.map((m) => m.file!).filter(Boolean) as File[],
        isUploading: threadMedia.some((m) => m.isUploading),
      };
    });
  }, [threadMessages, mediaItems]);

  const handleMediaChange = useCallback(
    (files: File[], previews: string[], threadIndex: number | null = null) => {
      // ... (rest of handleMediaChange logic remains the same)
      const currentSelectedAccounts =
        useEditorialStore.getState().selectedAccounts;

      let uploadIntegrationId = currentSelectedAccounts["x"]?.[0];

      if (!uploadIntegrationId) {
        const allIds = Object.values(currentSelectedAccounts).flat();
        uploadIntegrationId = allIds[0];
      }

      if (files.length > 0 && !uploadIntegrationId) {
        toast.error("Please select at least one account before uploading.");
        return;
      }

      const currentMediaItems = useEditorialStore.getState().mediaItems;
      const existingMedia = currentMediaItems.filter(
        (m) => m.threadIndex === threadIndex
      );
      const otherMedia = currentMediaItems.filter(
        (m) => m.threadIndex !== threadIndex
      );

      const newMediaItems: MediaItem[] = [];
      const newFilesForUpload: MediaItem[] = [];

      files.forEach((file, index) => {
        // FIX: The File argument from the component is the correct type,
        // but TypeScript errors on comparing it to the store's File|null.
        // We use a type cast to ensure comparison works.
        const existing = existingMedia.find(
          (m) => m.file === (file as File | null)
        );
        if (existing) {
          newMediaItems.push(existing);
        } else {
          const newItem: MediaItem = {
            file,
            preview: previews[index],
            id: null,
            isUploading: true,
            threadIndex,
          };
          newMediaItems.push(newItem);
          newFilesForUpload.push(newItem);
        }
      });

      setState({
        mediaItems: [...otherMedia, ...newMediaItems],
      });

      newFilesForUpload.forEach((item) => {
        if (!item.id && item.isUploading && uploadIntegrationId) {
          uploadMediaMutation.mutate({
            file: item.file!,
            integrationId: uploadIntegrationId,
            threadIndex: item.threadIndex,
          });
        }
      });
    },
    [setState, uploadMediaMutation]
  );

  const handleRemoveMedia = useCallback(
    (fileToRemove: File, threadIndex: number | null = null) => {
      const { mediaItems, threadMessages } = useEditorialStore.getState();

      // FIX: Filter based on reference, ensuring `item.file` is not null for comparison
      const newMediaItems = mediaItems.filter(
        (item) => item.threadIndex !== threadIndex || item.file !== fileToRemove
      );

      // Find the ID of the file being removed if it was a file that completed upload
      const mediaItem = mediaItems.find(
        (m) => m.file === fileToRemove && m.threadIndex === threadIndex
      );

      // Update thread messages to remove the media ID
      let newThreadMessages = threadMessages;
      if (threadIndex !== null && mediaItem) {
        newThreadMessages = threadMessages.map((msg, i) => {
          if (i === threadIndex) {
            return {
              ...msg,
              mediaIds:
                msg.mediaIds?.filter((id) => id !== mediaItem.id) || undefined,
            };
          }
          return msg;
        });
      }

      setState({
        mediaItems: newMediaItems,
        threadMessages: newThreadMessages,
      });
    },
    [setState]
  );

  return {
    // FIX: Using non-null assertion on map and then filter to correctly assert type
    mainPostMediaFiles: mainPostMedia
      .map((m) => m.file!)
      .filter(Boolean) as File[],
    mainPostMediaPreviews,
    postType,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    threadMessages: threadMessagesWithPreviews,
    updateState: setState,
    handleMediaChange,
    handleRemoveMedia,
    setThreadMessages,
    postMutation,
    connections,
  };
}
