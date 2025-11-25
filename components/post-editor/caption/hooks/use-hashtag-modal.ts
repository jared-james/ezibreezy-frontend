// components/post-editor/caption/hooks/use-hashtag-modal.ts

import { useState, useCallback } from "react";
import { ThreadMessage } from "@/lib/types/editorial";

export function useHashtagModal(
  localMainCaption: string,
  setLocalMainCaption: (caption: string) => void,
  localPlatformCaptions: Record<string, string>,
  setLocalPlatformCaptions: (
    captions: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)
  ) => void,
  currentThreadMessages: ThreadMessage[],
  isEditingPlatformThread: boolean,
  activeCaptionFilter: string,
  setLocalThreadMessages: (messages: ThreadMessage[]) => void,
  setLocalPlatformThreadMessages: (
    messages: Record<string, ThreadMessage[]> | ((prev: Record<string, ThreadMessage[]>) => Record<string, ThreadMessage[]>)
  ) => void,
  localFirstComment: string,
  setLocalFirstComment: (comment: string) => void,
  localFacebookFirstComment: string,
  setLocalFacebookFirstComment: (comment: string) => void,
  onThreadMessagesChange?: (messages: ThreadMessage[]) => void
) {
  const [isHashtagModalOpen, setIsHashtagModalOpen] = useState(false);
  const [targetPlatformId, setTargetPlatformId] = useState<string | null>(null);
  const [targetThreadIndex, setTargetThreadIndex] = useState<number | null>(
    null
  );

  const handleInsertHashtags = useCallback(
    (hashtagString: string) => {
      if (!hashtagString) return;

      const hashtagsWithPadding = `\n\n${hashtagString.trim()}`;

      if (targetThreadIndex !== null) {
        const newMessages = currentThreadMessages.map((msg, i) =>
          i === targetThreadIndex
            ? { ...msg, content: msg.content.trimEnd() + hashtagsWithPadding }
            : msg
        );

        if (isEditingPlatformThread) {
          setLocalPlatformThreadMessages((prev) => ({
            ...prev,
            [activeCaptionFilter]: newMessages,
          }));
        } else {
          setLocalThreadMessages(newMessages);
          onThreadMessagesChange?.(newMessages);
        }
        setTargetThreadIndex(null);
      } else if (targetPlatformId === "main") {
        const newCaption = localMainCaption.trimEnd() + hashtagsWithPadding;
        setLocalMainCaption(newCaption);
        setTargetPlatformId(null);
      } else if (targetPlatformId === "instagram_first_comment") {
        const newComment = localFirstComment.trimEnd() + hashtagsWithPadding;
        setLocalFirstComment(newComment);
        setTargetPlatformId(null);
      } else if (targetPlatformId === "facebook_first_comment") {
        const newComment =
          localFacebookFirstComment.trimEnd() + hashtagsWithPadding;
        setLocalFacebookFirstComment(newComment);
        setTargetPlatformId(null);
      } else if (targetPlatformId) {
        const currentCaption =
          localPlatformCaptions[targetPlatformId] || localMainCaption;
        const newCaption = currentCaption.trimEnd() + hashtagsWithPadding;
        setLocalPlatformCaptions((prev) => ({
          ...prev,
          [targetPlatformId]: newCaption,
        }));
        setTargetPlatformId(null);
      }
    },
    [
      localMainCaption,
      setLocalMainCaption,
      localPlatformCaptions,
      setLocalPlatformCaptions,
      currentThreadMessages,
      isEditingPlatformThread,
      activeCaptionFilter,
      setLocalPlatformThreadMessages,
      setLocalThreadMessages,
      onThreadMessagesChange,
      targetPlatformId,
      targetThreadIndex,
      localFirstComment,
      setLocalFirstComment,
      localFacebookFirstComment,
      setLocalFacebookFirstComment,
    ]
  );

  const openHashtagModal = useCallback((platformId: string) => {
    setTargetPlatformId(platformId);
    setTargetThreadIndex(null);
    setIsHashtagModalOpen(true);
  }, []);

  const openThreadHashtagModal = useCallback((threadIndex: number) => {
    setTargetThreadIndex(threadIndex);
    setTargetPlatformId(null);
    setIsHashtagModalOpen(true);
  }, []);

  return {
    isHashtagModalOpen,
    setIsHashtagModalOpen,
    targetPlatformId,
    targetThreadIndex,
    handleInsertHashtags,
    openHashtagModal,
    openThreadHashtagModal,
  };
}
