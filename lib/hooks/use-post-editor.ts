// lib/hooks/use-post-editor.ts

import { useState, useMemo, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/api/media";
import { getConnections, type Connection } from "@/lib/api/integrations";
import type {
  ThreadMessage,
  SelectedAccounts,
  Platform,
  ThreadMessageAugmented,
} from "@/lib/types/editorial";
import { Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { createPost, type CreatePostPayload } from "@/lib/api/publishing";

interface MediaItem {
  file: File;
  preview: string;
  id: string | null;
  isUploading: boolean;
  threadIndex: number | null;
}

export interface EditorState {
  isScheduling: boolean;
  scheduleDate: string;
  scheduleTime: string;
  selectedAccounts: SelectedAccounts;
  mainCaption: string;
  platformCaptions: Record<string, string>;
  mediaItems: MediaItem[];
  labels: string;
  hashtags: string;
  threadMessages: ThreadMessage[];
  collaborators: string;
  location: string;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

const initialState: EditorState = {
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {},
  mainCaption: "",
  platformCaptions: {},
  mediaItems: [],
  labels: "",
  hashtags: "",
  threadMessages: [],
  collaborators: "",
  location: "",
};

const filterMediaItems = (mediaItems: MediaItem[], fileToRemove: File) =>
  mediaItems.filter((item) => item.file !== fileToRemove);

const platformDefinitions = {
  x: { name: "Twitter/X", icon: Twitter },
  linkedin: { name: "LinkedIn", icon: Linkedin },
  youtube: { name: "YouTube", icon: Youtube },
  instagram: { name: "Instagram", icon: Instagram },
};

export function usePostEditor(initialDraft?: Partial<EditorState>) {
  const [state, setState] = useState<EditorState>({
    ...initialState,
    ...initialDraft,
  });

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const postMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onError: () => {},
  });

  const uploadMediaMutation = useMutation({
    mutationFn: (variables: {
      file: File;
      integrationId: string;
      threadIndex: number | null;
    }) => uploadMedia(variables.file, variables.integrationId),
    onSuccess: (data, variables) => {
      setState((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.map((item) =>
          item.file === variables.file
            ? { ...item, id: data.mediaId, isUploading: false }
            : item
        ),
        threadMessages:
          variables.threadIndex !== null
            ? prev.threadMessages.map((msg, i) =>
                i === variables.threadIndex
                  ? {
                      ...msg,
                      mediaIds: [...(msg.mediaIds || []), data.mediaId],
                    }
                  : msg
              )
            : prev.threadMessages,
      }));
    },
    onError: (error: any, variables) => {
      toast.error(
        `Upload failed for ${variables.file.name}: ${
          error?.message || "Unknown error"
        }`
      );
      setState((prev) => ({
        ...prev,
        mediaItems: filterMediaItems(prev.mediaItems, variables.file),
      }));
    },
  });

  const updateState = useCallback((updates: Partial<EditorState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  }, []);

  const { mediaItems } = state;

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
    if (mainPostMedia.some((m) => m.file.type.startsWith("video/")))
      return "video";
    return "image";
  }, [mainPostMedia]);

  const availablePlatforms = useMemo((): Platform[] => {
    if (!connections) return [];
    const connectionsByPlatform = connections.reduce((acc, conn) => {
      acc[conn.platform] = acc[conn.platform] || [];
      acc[conn.platform].push(conn);
      return acc;
    }, {} as Record<string, Connection[]>);

    return Object.keys(platformDefinitions).map((platformId) => {
      const def =
        platformDefinitions[platformId as keyof typeof platformDefinitions];
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
    () => new Set(Object.keys(state.selectedAccounts)),
    [state.selectedAccounts]
  );

  const mainPostMediaPreviews = useMemo(
    () => mainPostMedia.map((m) => m.preview),
    [mainPostMedia]
  );

  const threadMessagesWithPreviews: ThreadMessageAugmented[] = useMemo(() => {
    return state.threadMessages.map((msg, index) => {
      const threadMedia = mediaItems.filter((m) => m.threadIndex === index);
      return {
        ...msg,
        mediaPreviews: threadMedia
          .map((m) => m.preview)
          .filter(Boolean) as string[],
        mediaFiles: threadMedia.map((m) => m.file), // Pass real files back to UI
        isUploading: threadMedia.some((m) => m.isUploading),
      };
    });
  }, [state.threadMessages, mediaItems]);

  const handleMediaChange = useCallback(
    (files: File[], previews: string[], threadIndex: number | null = null) => {
      const allSelectedIds = Object.values(state.selectedAccounts).flat();
      const uploadIntegrationId = allSelectedIds[0];

      if (files.length > 0 && !uploadIntegrationId) {
        toast.error("Please select at least one account before uploading.");
        return;
      }

      const existingMedia = mediaItems.filter(
        (m) => m.threadIndex === threadIndex
      );
      const otherMedia = mediaItems.filter(
        (m) => m.threadIndex !== threadIndex
      );

      const newMediaItems: MediaItem[] = [];
      const newFilesForUpload: MediaItem[] = [];

      files.forEach((file, index) => {
        const existing = existingMedia.find((m) => m.file === file);

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

      setState((prev) => ({
        ...prev,
        mediaItems: [...otherMedia, ...newMediaItems],
      }));

      newFilesForUpload.forEach((item) => {
        if (!item.id && item.isUploading && uploadIntegrationId) {
          uploadMediaMutation.mutate({
            file: item.file,
            integrationId: uploadIntegrationId,
            threadIndex: item.threadIndex,
          });
        }
      });
    },
    [state.selectedAccounts, mediaItems, uploadMediaMutation]
  );

  const handleRemoveMedia = useCallback(
    (fileToRemove: File, threadIndex: number | null = null) => {
      const mediaItem = mediaItems.find(
        (m) => m.file === fileToRemove && m.threadIndex === threadIndex
      );
      if (!mediaItem) return;

      setState((prev) => {
        const newMediaItems = filterMediaItems(prev.mediaItems, fileToRemove);

        let newThreadMessages = prev.threadMessages;
        if (threadIndex !== null) {
          newThreadMessages = prev.threadMessages.map((msg, i) => {
            if (i === threadIndex) {
              return {
                ...msg,
                mediaIds:
                  msg.mediaIds?.filter((id) => id !== mediaItem.id) ||
                  undefined,
              };
            }
            return msg;
          });
        }

        return {
          ...prev,
          mediaItems: newMediaItems,
          threadMessages: newThreadMessages,
        };
      });
    },
    [mediaItems]
  );

  const setThreadMessages = useCallback(
    (newMessages: ThreadMessageAugmented[]) => {
      updateState({
        threadMessages: newMessages.map((m) => ({
          content: m.content,
          mediaIds: m.mediaIds,
        })),
      });
    },
    [updateState]
  );

  return {
    state,
    mainPostMediaFiles: mainPostMedia.map((m) => m.file),
    mainPostMediaPreviews,
    postType,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    threadMessages: threadMessagesWithPreviews,
    updateState,
    handleMediaChange,
    handleRemoveMedia,
    setThreadMessages,
    postMutation,
    connections,
  };
}
