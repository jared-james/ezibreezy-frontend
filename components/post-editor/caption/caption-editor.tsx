// components/post-editor/caption/caption-editor.tsx

"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Smile } from "lucide-react";
import {
  Platform,
  ThreadMessage,
  ThreadMessageAugmented,
} from "@/lib/types/editorial";
import { useEditorialStore } from "@/lib/store/editorial-store";
import HashtagSelectorModal from "../modals/hashtag-selector-modal";
import { CaptionTextarea } from "./components/caption-textarea";
import { PlatformFilterButtons } from "./components/platform-filter-buttons";
import { PlatformCaptionSection } from "./sections/platform-caption-section";
import { useCaptionState } from "./hooks/use-caption-state";
import { useThreadMessages } from "./hooks/use-thread-messages";
import { useHashtagModal } from "./hooks/use-hashtag-modal";

type SelectedAccounts = Record<string, string[]>;

interface CaptionEditorProps {
  selectedAccounts: SelectedAccounts;
  platforms: Platform[];
  onAccountSelect: (platformId: string, accountId: string) => void;
  postType: "text" | "image" | "video";
  mediaUploadSlot?: React.ReactNode;
  threadMessages?: ThreadMessageAugmented[];
  onThreadMessagesChange?: (messages: ThreadMessage[]) => void;
  isGlobalUploading?: boolean;
  onLocalCaptionsChange?: (
    mainCaption: string,
    platformCaptions: Record<string, string>
  ) => void;
}

export default function CaptionEditor({
  selectedAccounts,
  platforms,
  onAccountSelect,
  postType,
  mediaUploadSlot,
  threadMessages = [],
  onThreadMessagesChange,
  isGlobalUploading = false,
  onLocalCaptionsChange,
}: CaptionEditorProps) {
  const captionState = useCaptionState(threadMessages, onLocalCaptionsChange);

  const activeCaptionFilter = useEditorialStore(
    (state) => state.activeCaptionFilter
  );
  const setActiveCaptionFilter = useCallback(
    (filter: string) => captionState.setState({ activeCaptionFilter: filter }),
    [captionState]
  );

  const selectedPlatformIds = useMemo(
    () => Object.keys(selectedAccounts),
    [selectedAccounts]
  );

  useEffect(() => {
    if (selectedPlatformIds.length === 0) {
      setActiveCaptionFilter("all");
    } else if (
      activeCaptionFilter !== "all" &&
      !selectedPlatformIds.includes(activeCaptionFilter)
    ) {
      setActiveCaptionFilter(selectedPlatformIds[0]);
    } else if (
      activeCaptionFilter === "all" &&
      selectedPlatformIds.length === 1
    ) {
      setActiveCaptionFilter(selectedPlatformIds[0]);
    }
  }, [selectedPlatformIds, activeCaptionFilter, setActiveCaptionFilter]);

  const threadMessagesHook = useThreadMessages(
    captionState.localThreadMessages,
    captionState.localPlatformThreadMessages,
    activeCaptionFilter,
    captionState.setLocalThreadMessages,
    captionState.setLocalPlatformThreadMessages,
    onThreadMessagesChange
  );

  const hashtagModal = useHashtagModal(
    captionState.localMainCaption,
    captionState.setLocalMainCaption,
    captionState.localPlatformCaptions,
    captionState.setLocalPlatformCaptions,
    threadMessagesHook.currentThreadMessages,
    threadMessagesHook.isEditingPlatformThread,
    activeCaptionFilter,
    captionState.setLocalThreadMessages,
    captionState.setLocalPlatformThreadMessages,
    captionState.localFirstComment,
    captionState.setLocalFirstComment,
    captionState.localFacebookFirstComment,
    captionState.setLocalFacebookFirstComment,
    onThreadMessagesChange
  );

  const mainPlaceholder =
    "Draft the main caption you want to adapt across platforms. You can update the specific caption per platform below";

  return (
    <>
      {mediaUploadSlot && <div className="mb-6">{mediaUploadSlot}</div>}

      <div>
        <label
          htmlFor="caption"
          className="eyebrow mb-2 flex items-center justify-between"
        >
          Main Caption
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </button>
        </label>

        <CaptionTextarea
          id="caption"
          value={captionState.localMainCaption}
          onChange={(event) =>
            captionState.setLocalMainCaption(event.target.value)
          }
          placeholder={mainPlaceholder}
          platformId="main"
          onHashtagClick={hashtagModal.openHashtagModal}
        />
      </div>

      <PlatformFilterButtons
        selectedPlatformIds={selectedPlatformIds}
        platforms={platforms}
        activeCaptionFilter={activeCaptionFilter}
        onFilterChange={setActiveCaptionFilter}
      />

      {Object.keys(selectedAccounts)
        .filter(
          (platformId) =>
            activeCaptionFilter === "all" || activeCaptionFilter === platformId
        )
        .map((platformId) => {
          const platform = platforms.find((p) => p.id === platformId);
          if (!platform) return null;

          const currentCaption =
            captionState.localPlatformCaptions[platformId] || "";

          return (
            <PlatformCaptionSection
              key={platformId}
              platformId={platformId}
              platform={platform}
              selectedAccounts={selectedAccounts}
              onAccountSelect={onAccountSelect}
              currentCaption={currentCaption}
              setLocalPlatformCaptions={captionState.setLocalPlatformCaptions}
              openHashtagModal={hashtagModal.openHashtagModal}
              postType={postType}
              currentPostType={captionState.currentPostType}
              facebookPostType={captionState.facebookPostType}
              setState={captionState.setState}
              localPlatformTitles={captionState.localPlatformTitles}
              setLocalPlatformTitles={captionState.setLocalPlatformTitles}
              currentThreadMessages={threadMessagesHook.currentThreadMessages}
              updateThreadMessageContent={
                threadMessagesHook.updateThreadMessageContent
              }
              removeThreadMessage={threadMessagesHook.removeThreadMessage}
              addThreadMessage={threadMessagesHook.addThreadMessage}
              openThreadHashtagModal={hashtagModal.openThreadHashtagModal}
              localFirstComment={captionState.localFirstComment}
              setLocalFirstComment={captionState.setLocalFirstComment}
              showFirstComment={captionState.showFirstComment}
              setShowFirstComment={captionState.setShowFirstComment}
              localFacebookFirstComment={captionState.localFacebookFirstComment}
              setLocalFacebookFirstComment={
                captionState.setLocalFacebookFirstComment
              }
              showFacebookFirstComment={captionState.showFacebookFirstComment}
              setShowFacebookFirstComment={
                captionState.setShowFacebookFirstComment
              }
            />
          );
        })}

      <HashtagSelectorModal
        isOpen={hashtagModal.isHashtagModalOpen}
        onClose={() => hashtagModal.setIsHashtagModalOpen(false)}
        initialHashtags={
          hashtagModal.targetThreadIndex !== null
            ? threadMessagesHook.currentThreadMessages[
                hashtagModal.targetThreadIndex
              ]?.content || ""
            : hashtagModal.targetPlatformId === "main"
            ? captionState.localMainCaption
            : hashtagModal.targetPlatformId === "instagram_first_comment"
            ? captionState.localFirstComment
            : hashtagModal.targetPlatformId === "facebook_first_comment"
            ? captionState.localFacebookFirstComment
            : captionState.localPlatformCaptions[
                hashtagModal.targetPlatformId || ""
              ] || ""
        }
        onSave={hashtagModal.handleInsertHashtags}
      />
    </>
  );
}
