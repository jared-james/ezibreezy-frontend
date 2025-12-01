// components/post-editor/caption/hooks/use-caption-state.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import { ThreadMessage } from "@/lib/types/editorial";

export function useCaptionState(
  threadMessages: ThreadMessage[],
  onLocalCaptionsChange?: (
    mainCaption: string,
    platformCaptions: Record<string, string>
  ) => void
) {
  const mainCaption = useEditorialStore((state) => state.mainCaption);
  const platformCaptions = useEditorialStore((state) => state.platformCaptions);
  const platformTitles = useEditorialStore((state) => state.platformTitles);
  const platformThreadMessages = useEditorialStore(
    (state) => state.platformThreadMessages
  );
  const firstComment = useEditorialStore((state) => state.firstComment);
  const facebookFirstComment = useEditorialStore(
    (state) => state.facebookFirstComment
  );
  const currentPostType = useEditorialStore((state) => state.postType);
  const facebookPostType = useEditorialStore((state) => state.facebookPostType);
  const pinterestLink = useEditorialStore((state) => state.pinterestLink);
  const pinterestBoardId = useEditorialStore((state) => state.pinterestBoardId);
  const setState = useEditorialStore((state) => state.setState);

  const [localMainCaption, setLocalMainCaption] = useState(mainCaption);
  const [localPlatformCaptions, setLocalPlatformCaptions] =
    useState(platformCaptions);

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

  const [localPlatformTitles, setLocalPlatformTitles] =
    useState(platformTitles);
  const [localThreadMessages, setLocalThreadMessages] =
    useState(threadMessages);
  const [localPlatformThreadMessages, setLocalPlatformThreadMessages] =
    useState<Record<string, ThreadMessage[]>>(platformThreadMessages);
  const [localFirstComment, setLocalFirstComment] = useState(firstComment);
  const [localFacebookFirstComment, setLocalFacebookFirstComment] =
    useState(facebookFirstComment);
  const [showFirstComment, setShowFirstComment] = useState(
    !!firstComment && firstComment.length > 0
  );
  const [showFacebookFirstComment, setShowFacebookFirstComment] = useState(
    !!facebookFirstComment && facebookFirstComment.length > 0
  );
  const [localPinterestLink, setLocalPinterestLink] = useState(pinterestLink);
  const [localPinterestBoardId, setLocalPinterestBoardId] =
    useState(pinterestBoardId);

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
    if (currentPostType === "story") {
      setShowFirstComment(false);
    } else {
      setShowFirstComment(!!firstComment && firstComment.length > 0);
    }
  }, [firstComment, currentPostType]);

  useEffect(() => {
    setLocalFacebookFirstComment(facebookFirstComment);
    if (facebookPostType === "story") {
      setShowFacebookFirstComment(false);
    } else {
      setShowFacebookFirstComment(
        !!facebookFirstComment && facebookFirstComment.length > 0
      );
    }
  }, [facebookFirstComment, facebookPostType]);

  useEffect(() => {
    setLocalPinterestLink(pinterestLink);
  }, [pinterestLink]);

  useEffect(() => {
    setLocalPinterestBoardId(pinterestBoardId);
  }, [pinterestBoardId]);

  useEffect(() => {
    if (currentPostType === "story") {
      setLocalPlatformCaptions((prev) => ({ ...prev, instagram: "" }));
    }
  }, [currentPostType]);

  useEffect(() => {
    if (facebookPostType === "story") {
      setLocalPlatformCaptions((prev) => ({ ...prev, facebook: "" }));
    }
  }, [facebookPostType]);

  useEffect(() => {
    onLocalCaptionsChange?.(localMainCaption, localPlatformCaptions);
  }, [localMainCaption, localPlatformCaptions, onLocalCaptionsChange]);

  useEffect(() => {
    setState({ firstComment: localFirstComment });
  }, [localFirstComment, setState]);

  useEffect(() => {
    setState({ facebookFirstComment: localFacebookFirstComment });
  }, [localFacebookFirstComment, setState]);

  useEffect(() => {
    setState({ platformTitles: localPlatformTitles });
  }, [localPlatformTitles, setState]);

  useEffect(() => {
    setState({ platformThreadMessages: localPlatformThreadMessages });
  }, [localPlatformThreadMessages, setState]);

  useEffect(() => {
    setState({ pinterestLink: localPinterestLink });
  }, [localPinterestLink, setState]);

  useEffect(() => {
    setState({ pinterestBoardId: localPinterestBoardId });
  }, [localPinterestBoardId, setState]);

  const handleMainCaptionChange = useCallback(
    (newCaption: string) => {
      setLocalMainCaption(newCaption);

      setLocalPlatformCaptions((prev) => {
        const next = { ...prev };
        const currentPlatforms = Object.keys(
          useEditorialStore.getState().selectedAccounts
        );

        currentPlatforms.forEach((platformId) => {
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
    setLocalMainCaption,
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
    currentPostType,
    facebookPostType,
    setState,
  };
}
