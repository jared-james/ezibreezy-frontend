// components/post-editor/caption/hooks/use-caption-state.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { ThreadMessage } from "@/lib/types/editorial";

export function useCaptionState(
  threadMessages: ThreadMessage[],
  onLocalCaptionsChange?: (
    mainCaption: string,
    platformCaptions: Record<string, string>
  ) => void
) {
  // -- Atomic Selectors (Prevents infinite loops) --

  // Draft Store
  const mainCaption = useEditorialDraftStore((state) => state.mainCaption);
  const platformCaptions = useEditorialDraftStore(
    (state) => state.platformCaptions
  );
  const platformTitles = useEditorialDraftStore(
    (state) => state.platformTitles
  );
  const platformThreadMessages = useEditorialDraftStore(
    (state) => state.platformThreadMessages
  );
  const firstComment = useEditorialDraftStore((state) => state.firstComment);
  const facebookFirstComment = useEditorialDraftStore(
    (state) => state.facebookFirstComment
  );
  const postType = useEditorialDraftStore((state) => state.postType);
  const facebookPostType = useEditorialDraftStore(
    (state) => state.facebookPostType
  );

  const setDraftState = useEditorialDraftStore((state) => state.setDraftState);

  // Publishing Store
  const pinterestLink = usePublishingStore((state) => state.pinterestLink);
  const pinterestBoardId = usePublishingStore(
    (state) => state.pinterestBoardId
  );

  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );

  // -- Local State --

  const [localMainCaption, setLocalMainCaption] = useState(mainCaption);
  const [localPlatformCaptions, setLocalPlatformCaptions] =
    useState(platformCaptions);
  const [localPlatformTitles, setLocalPlatformTitles] =
    useState(platformTitles);
  const [localThreadMessages, setLocalThreadMessages] =
    useState(threadMessages);
  const [localPlatformThreadMessages, setLocalPlatformThreadMessages] =
    useState(platformThreadMessages);
  const [localFirstComment, setLocalFirstComment] = useState(firstComment);
  const [localFacebookFirstComment, setLocalFacebookFirstComment] =
    useState(facebookFirstComment);
  const [localPinterestLink, setLocalPinterestLink] = useState(pinterestLink);
  const [localPinterestBoardId, setLocalPinterestBoardId] =
    useState(pinterestBoardId);

  const [showFirstComment, setShowFirstComment] = useState(
    !!firstComment && firstComment.length > 0
  );
  const [showFacebookFirstComment, setShowFacebookFirstComment] = useState(
    !!facebookFirstComment && facebookFirstComment.length > 0
  );

  // "Dirty" tracking to know if a platform caption has been manually edited
  // and should be detached from the main caption updates.
  const [dirtyPlatforms, setDirtyPlatforms] = useState<Record<string, boolean>>(
    () => {
      const dirty: Record<string, boolean> = {};
      Object.entries(platformCaptions).forEach(([key, val]) => {
        if (val && val !== mainCaption) {
          dirty[key] = true;
        }
      });
      return dirty;
    }
  );

  // -- Sync Global -> Local --

  useEffect(() => {
    setLocalMainCaption(mainCaption);
  }, [mainCaption]);

  useEffect(() => {
    setLocalPlatformCaptions(platformCaptions);

    setDirtyPlatforms((prev) => {
      const nextDirty = { ...prev };
      Object.entries(platformCaptions).forEach(([key, val]) => {
        if (val && val !== mainCaption && prev[key] === undefined) {
          nextDirty[key] = true;
        }
      });
      return nextDirty;
    });
  }, [platformCaptions, mainCaption]);

  useEffect(() => {
    setLocalPlatformTitles(platformTitles);
  }, [platformTitles]);

  useEffect(() => {
    setLocalThreadMessages(threadMessages);
  }, [threadMessages]);

  useEffect(() => {
    setLocalPlatformThreadMessages(platformThreadMessages);
  }, [platformThreadMessages]);

  useEffect(() => {
    setLocalFirstComment(firstComment);
  }, [firstComment]);

  useEffect(() => {
    setLocalFacebookFirstComment(facebookFirstComment);
  }, [facebookFirstComment]);

  useEffect(() => {
    setLocalPinterestLink(pinterestLink);
  }, [pinterestLink]);

  useEffect(() => {
    setLocalPinterestBoardId(pinterestBoardId);
  }, [pinterestBoardId]);

  // -- Sync Local -> Global (Debounced) --
  useEffect(() => {
    const handler = setTimeout(() => {
      setDraftState({
        mainCaption: localMainCaption,
        platformCaptions: localPlatformCaptions,
        platformTitles: localPlatformTitles,
        platformThreadMessages: localPlatformThreadMessages,
        firstComment: localFirstComment,
        facebookFirstComment: localFacebookFirstComment,
      });

      setPublishingState({
        pinterestLink: localPinterestLink,
        pinterestBoardId: localPinterestBoardId,
      });

      onLocalCaptionsChange?.(localMainCaption, localPlatformCaptions);
    }, 500);

    return () => clearTimeout(handler);
  }, [
    localMainCaption,
    localPlatformCaptions,
    localPlatformTitles,
    localPlatformThreadMessages,
    localFirstComment,
    localFacebookFirstComment,
    localPinterestLink,
    localPinterestBoardId,
    setDraftState,
    setPublishingState,
    onLocalCaptionsChange,
  ]);

  // -- Visibility Logic --
  useEffect(() => {
    if (postType === "story") {
      setShowFirstComment(false);
      setLocalPlatformCaptions((prev) => ({ ...prev, instagram: "" }));
    } else {
      setShowFirstComment(!!localFirstComment && localFirstComment.length > 0);
    }
  }, [postType, localFirstComment]);

  useEffect(() => {
    if (facebookPostType === "story") {
      setShowFacebookFirstComment(false);
      setLocalPlatformCaptions((prev) => ({ ...prev, facebook: "" }));
    } else {
      setShowFacebookFirstComment(
        !!localFacebookFirstComment && localFacebookFirstComment.length > 0
      );
    }
  }, [facebookPostType, localFacebookFirstComment]);

  // -- Handlers --

  const handleMainCaptionChange = useCallback(
    (newCaption: string) => {
      setLocalMainCaption(newCaption);

      setLocalPlatformCaptions((prev) => {
        const next = { ...prev };
        Object.keys(prev).forEach((platformId) => {
          if (!dirtyPlatforms[platformId]) {
            next[platformId] = newCaption;
          }
        });
        return next;
      });
    },
    [dirtyPlatforms]
  );

  const handlePlatformCaptionChange = useCallback(
    (platformId: string, newCaption: string) => {
      setLocalPlatformCaptions((prev) => ({
        ...prev,
        [platformId]: newCaption,
      }));

      setDirtyPlatforms((prev) => ({
        ...prev,
        [platformId]: true,
      }));
    },
    []
  );

  return {
    localMainCaption,
    setLocalMainCaption: handleMainCaptionChange,
    localPlatformCaptions,
    setLocalPlatformCaptions,
    handleMainCaptionChange,
    handlePlatformCaptionChange,
    localPlatformTitles,
    setLocalPlatformTitles,
    localThreadMessages,
    setLocalThreadMessages,
    localPlatformThreadMessages,
    setLocalPlatformThreadMessages,
    localFirstComment,
    setLocalFirstComment,
    localFacebookFirstComment,
    setLocalFacebookFirstComment,
    showFirstComment,
    setShowFirstComment,
    showFacebookFirstComment,
    setShowFacebookFirstComment,
    localPinterestLink,
    setLocalPinterestLink,
    localPinterestBoardId,
    setLocalPinterestBoardId,
    currentPostType: postType,
    facebookPostType: facebookPostType,
    setState: setDraftState,
  };
}
