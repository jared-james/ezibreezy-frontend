// components/post-editor/caption/hooks/use-thread-messages.ts

import { useCallback, useMemo } from "react";
import { useEditorialStore } from "@/lib/store/editorial-store";
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
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);

  const augmentThreadMessages = useCallback(
    (messages: ThreadMessage[]): ThreadMessageAugmented[] => {
      return messages.map((msg, index) => {
        const threadMedia = stagedMediaItems.filter(
          (m) => m.threadIndex === index
        );
        return {
          ...msg,
          mediaPreviews: threadMedia
            .map((m) => m.preview)
            .filter(Boolean) as string[],
          mediaFiles: threadMedia.map((m) => m.file!).filter(Boolean) as File[],
          isUploading: threadMedia.some((m) => m.isUploading),
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
          ...currentThreadMessages,
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
      const newMessages = currentThreadMessages.filter((_, i) => i !== index);

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
      const newMessages = currentThreadMessages.map((msg, i) =>
        i === index ? { ...msg, content } : msg
      );

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
