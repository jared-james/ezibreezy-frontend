// components/post-editor/caption/hooks/use-caption-state.ts

import { useState, useEffect } from "react";
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

  // Sync global state to local state
  useEffect(() => {
    setLocalMainCaption(mainCaption);
  }, [mainCaption]);

  useEffect(() => {
    setLocalPlatformCaptions(platformCaptions);
  }, [platformCaptions]);

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

  // Clear captions for stories
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

  // Sync local state to global state
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

  return {
    localMainCaption,
    setLocalMainCaption,
    localPlatformCaptions,
    setLocalPlatformCaptions,
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
