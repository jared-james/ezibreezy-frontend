// components/post-editor/caption/hooks/use-thread-messages.ts

import { useCallback, useMemo } from "react";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { ThreadMessage, ThreadMessageAugmented } from "@/lib/types/editorial";

export function useThreadMessages(
  localThreadMessages: ThreadMessage[],
  localPlatformThreadMessages: Record<string, ThreadMessage[]>,
  activeCaptionFilter: string,
  setLocalThreadMessages: (messages: ThreadMessage[]) => void,
  setLocalPlatformThreadMessages: (
    messages: Record<string, ThreadMessage[]>
  ) => void,
  onThreadMessagesChange?: (messages: ThreadMessage[]) => void
) {
  // Migrated to Draft Store - Atomic Selector
  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );

  const augmentThreadMessages = useCallback(
    (messages: ThreadMessage[]): ThreadMessageAugmented[] => {
      return messages.map((msg) => {
        // Find media based on UIDs stored in the message
        const threadMedia = (msg.mediaIds || [])
          .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
          .filter(Boolean) as any[];

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

  const currentThreadMessages = useMemo(() => {
    const supportsThreading =
      activeCaptionFilter === "x" || activeCaptionFilter === "threads";
    if (
      supportsThreading &&
      localPlatformThreadMessages[activeCaptionFilter]?.length > 0
    ) {
      return augmentThreadMessages(
        localPlatformThreadMessages[activeCaptionFilter]
      );
    }
    return localThreadMessages.length > 0
      ? augmentThreadMessages(localThreadMessages)
      : [];
  }, [
    activeCaptionFilter,
    localPlatformThreadMessages,
    localThreadMessages,
    augmentThreadMessages,
  ]);

  const isEditingPlatformThread =
    activeCaptionFilter === "x" || activeCaptionFilter === "threads";

  const addThreadMessage = useCallback(
    (platformId: string) => {
      if (currentThreadMessages.length < 20) {
        const newMessages = [
          ...currentThreadMessages.map((m) => ({
            content: m.content,
            mediaIds: m.mediaIds,
          })), // Strip augmented data
          { content: "", mediaIds: [] },
        ];

        if (isEditingPlatformThread) {
          setLocalPlatformThreadMessages({
            ...localPlatformThreadMessages,
            [platformId]: newMessages,
          });
        } else {
          setLocalThreadMessages(newMessages);
          onThreadMessagesChange?.(newMessages);
        }
      }
    },
    [
      currentThreadMessages,
      isEditingPlatformThread,
      localPlatformThreadMessages,
      setLocalPlatformThreadMessages,
      setLocalThreadMessages,
      onThreadMessagesChange,
    ]
  );

  const removeThreadMessage = useCallback(
    (index: number, platformId: string) => {
      // Strip augmented data when saving back to state
      const newMessages = currentThreadMessages
        .filter((_, i) => i !== index)
        .map((m) => ({ content: m.content, mediaIds: m.mediaIds }));

      if (isEditingPlatformThread) {
        setLocalPlatformThreadMessages({
          ...localPlatformThreadMessages,
          [platformId]: newMessages,
        });
      } else {
        setLocalThreadMessages(newMessages);
        onThreadMessagesChange?.(newMessages);
      }
    },
    [
      currentThreadMessages,
      isEditingPlatformThread,
      localPlatformThreadMessages,
      setLocalPlatformThreadMessages,
      setLocalThreadMessages,
      onThreadMessagesChange,
    ]
  );

  const updateThreadMessageContent = useCallback(
    (index: number, content: string, platformId: string) => {
      const newMessages = currentThreadMessages.map((msg, i) => {
        // Strip augmented data, update content
        const baseMsg = { content: msg.content, mediaIds: msg.mediaIds };
        return i === index ? { ...baseMsg, content } : baseMsg;
      });

      if (isEditingPlatformThread) {
        setLocalPlatformThreadMessages({
          ...localPlatformThreadMessages,
          [platformId]: newMessages,
        });
      } else {
        setLocalThreadMessages(newMessages);
        onThreadMessagesChange?.(newMessages);
      }
    },
    [
      currentThreadMessages,
      isEditingPlatformThread,
      localPlatformThreadMessages,
      setLocalPlatformThreadMessages,
      setLocalThreadMessages,
      onThreadMessagesChange,
    ]
  );

  return {
    currentThreadMessages,
    isEditingPlatformThread,
    addThreadMessage,
    removeThreadMessage,
    updateThreadMessageContent,
  };
}
