// components/post-editor/index.tsx

"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { showError } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/client";

import ChannelSelector from "./panels/channel-selector";
import CaptionEditor from "./caption/caption-editor";
import DistributionPanel from "./panels/distribution-panel";
import PreviewPanel from "./panels/preview-panel";
import MediaUpload from "./media/media-upload";
import SchedulePanel from "./panels/schedule-panel";
import ConfirmationModal from "./modals/confirmation-modal";
import ValidationErrorModal from "./modals/validation-error-modal";

import { usePostEditor } from "@/lib/hooks/use-post-editor";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";

import type { CreatePostPayload, PostSettings } from "@/lib/api/publishing";
import { PlatformCrops } from "@/lib/utils/crop-utils";
import { usePostStatusPolling } from "./hooks/use-post-status-polling";
import { getAutoSelectionForPlatform } from "@/lib/utils/media-validation";
import { usePostValidator } from "./hooks/use-post-validator";

interface EditorialCoreProps {
  onPostSuccess?: () => void;
  mode?: "editorial" | "clipping";
  onSaveClipping?: () => void;
  isSavingClipping?: boolean;
  onOpenInEditorial?: () => void;
}

export default function EditorialCore({
  onPostSuccess,
  mode = "editorial",
}: EditorialCoreProps) {
  const [user, setUser] = useState<any>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<
    "sent" | "scheduled" | null
  >(null);
  const [confirmationCount, setConfirmationCount] = useState(0);

  const [localMainCaption, setLocalMainCaption] = useState("");
  const [localPlatformCaptions, setLocalPlatformCaptions] = useState<
    Record<string, string>
  >({});

  const resetUI = useEditorialUIStore((state) => state.resetUI);
  const resetDraft = useEditorialDraftStore((state) => state.resetDraft);
  const resetPublishing = usePublishingStore((state) => state.resetPublishing);

  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const platformMediaSelections = useEditorialDraftStore(
    (state) => state.platformMediaSelections
  );
  const threadMessages = useEditorialDraftStore(
    (state) => state.threadMessages
  );
  const platformPostType = useEditorialDraftStore((state) => state.postType);
  const facebookPostType = useEditorialDraftStore(
    (state) => state.facebookPostType
  );

  const { setDraftState, setThreadMessages } = useEditorialDraftStore();

  const selectedAccounts = usePublishingStore(
    (state) => state.selectedAccounts
  );
  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );

  const {
    stagedMediaFiles,
    stagedMediaItems: editorStagedMediaItems,
    stagedMediaPreviews,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    handleMediaChange,
    handleRemoveMedia,
    handleLibraryMediaSelect,
    selectedLibraryMediaIds,
    postMutation,
    postType,
  } = usePostEditor({ mode });

  const { startPolling, isPolling: isPollingStatus } = usePostStatusPolling();

  const { validatePost, validationErrors, clearErrors, mediaErrors } =
    usePostValidator({
      selectedAccounts,
      platformMediaSelections,
      stagedMediaItems,
      facebookPostType,
      postType: platformPostType,
    });

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const resetAll = () => {
    resetDraft();
    resetPublishing();
    resetUI();
  };

  const handleCloseConfirmation = () => {
    setConfirmationStatus(null);
    setConfirmationCount(0);
    resetAll();
    if (onPostSuccess) {
      onPostSuccess();
    }
  };

  const togglePlatform = (platformId: string) => {
    const platform = availablePlatforms.find((p) => p.id === platformId);
    if (!platform || platform.accounts.length === 0) return;

    const newSelected = { ...selectedAccounts };
    const newCaptions = { ...localPlatformCaptions };
    const newMediaSelections = { ...platformMediaSelections };

    if (newSelected[platformId]) {
      delete newSelected[platformId];
      delete newCaptions[platformId];
      delete newMediaSelections[platformId];
    } else {
      newSelected[platformId] = [platform.accounts[0].id];
      newCaptions[platformId] = localMainCaption;

      const uidsToAdd = getAutoSelectionForPlatform(
        platformId,
        [],
        stagedMediaItems
      );

      if (uidsToAdd.length > 0) {
        newMediaSelections[platformId] = uidsToAdd;
      }
    }

    setPublishingState({ selectedAccounts: newSelected });
    setDraftState({
      platformCaptions: newCaptions,
      platformMediaSelections: newMediaSelections,
    });
    setLocalPlatformCaptions(newCaptions);
  };

  const handleAccountSelect = (platformId: string, accountId: string) => {
    const currentSelection = selectedAccounts[platformId] || [];
    const newSelection = currentSelection.includes(accountId)
      ? currentSelection.filter((id) => id !== accountId)
      : [...currentSelection, accountId];

    const newSelected = { ...selectedAccounts };
    if (newSelection.length === 0) {
      delete newSelected[platformId];
    } else {
      newSelected[platformId] = newSelection;
    }

    setPublishingState({ selectedAccounts: newSelected });
  };

  const handlePublish = async () => {
    const draft = useEditorialDraftStore.getState();
    const pub = usePublishingStore.getState();

    const finalMainCaption = localMainCaption;
    const finalPlatformCaptions = localPlatformCaptions;

    if (!user) return showError("You must be logged in to post.");

    const integrationsToPost = Object.values(pub.selectedAccounts).flat();
    if (integrationsToPost.length === 0) {
      return showError("Please select at least one account.");
    }

    if (isGlobalUploading) {
      return showError("Please wait for media to finish uploading.");
    }

    const isValid = await validatePost();
    if (!isValid) {
      return;
    }

    for (const [platformId, selection] of Object.entries(
      draft.platformMediaSelections
    )) {
      if (
        !pub.selectedAccounts[platformId] ||
        pub.selectedAccounts[platformId].length === 0
      )
        continue;
      for (const uid of selection) {
        const mediaItem = draft.stagedMediaItems.find(
          (item) => item.uid === uid
        );
        if (mediaItem && !mediaItem.id) {
          return showError(
            `Media for ${platformId} is still processing. Please wait.`
          );
        }
      }
    }

    let scheduledAt: string | undefined;
    if (pub.isScheduling) {
      if (!pub.scheduleDate || !pub.scheduleTime) {
        return showError("Please select a valid date and time.");
      }
      const dateTime = new Date(`${pub.scheduleDate}T${pub.scheduleTime}`);
      if (isNaN(dateTime.getTime())) {
        return showError("Invalid schedule date or time.");
      }
      scheduledAt = dateTime.toISOString();
    }

    const baseSettings: PostSettings = {
      labels: pub.labels,
      collaborators: pub.collaborators,
      location: pub.location.name,
      locationId: pub.location.id || undefined,
      canonicalContent: finalMainCaption,
      postType: draft.postType,
      userTags: draft.userTags,
      productTags: draft.productTags,
    };

    const processThreadMessages = (messages: typeof draft.threadMessages) =>
      messages
        .map((msg) => {
          const backendMediaIds = (msg.mediaIds || [])
            .map(
              (uid) =>
                draft.stagedMediaItems.find((item) => item.uid === uid)?.id
            )
            .filter(Boolean) as string[];

          return {
            content: msg.content.trim(),
            mediaIds: backendMediaIds.length > 0 ? backendMediaIds : undefined,
          };
        })
        .filter(
          (msg) =>
            msg.content.length > 0 || (msg.mediaIds && msg.mediaIds.length > 0)
        );

    const finalThreadMessagesForPublish = processThreadMessages(
      draft.threadMessages
    );

    const mediaCrops: Record<string, PlatformCrops> = {};
    draft.stagedMediaItems.forEach((item) => {
      if (item.id && item.crops) {
        mediaCrops[item.id] = item.crops;
      }
    });

    const postPromises = Object.entries(pub.selectedAccounts).flatMap(
      ([platformId, integrationIds]) =>
        integrationIds.map((integrationId) => {
          const platformMediaUids =
            draft.platformMediaSelections[platformId] || [];
          const platformMediaIds = platformMediaUids
            .map(
              (uid) =>
                draft.stagedMediaItems.find((item) => item.uid === uid)?.id
            )
            .filter(Boolean) as string[];

          let platformThreadMessages: {
            content: string;
            mediaIds: string[] | undefined;
          }[] = [];

          if (platformId === "x" || platformId === "threads") {
            const platformSpecificThreads =
              draft.platformThreadMessages[platformId];
            if (platformSpecificThreads && platformSpecificThreads.length > 0) {
              platformThreadMessages = processThreadMessages(
                platformSpecificThreads
              );
            } else {
              platformThreadMessages = finalThreadMessagesForPublish;
            }
          }

          if (platformId === "instagram" && platformMediaIds.length === 0) {
            showError("Instagram posts require at least one image or video.");
            throw new Error("Instagram post validation failed");
          }

          const platformSpecificContent = finalPlatformCaptions[platformId];

          let contentToSend = "";

          const effectivePostType =
            platformId === "facebook" ? draft.facebookPostType : draft.postType;

          const isStory =
            (platformId === "instagram" && draft.postType === "story") ||
            (platformId === "facebook" && draft.facebookPostType === "story");

          if (isStory) {
            contentToSend = platformSpecificContent || "";
          } else {
            contentToSend =
              platformSpecificContent &&
              platformSpecificContent.trim().length > 0
                ? platformSpecificContent
                : finalMainCaption;
          }

          const payload: CreatePostPayload = {
            userId: user.id,
            integrationId,
            content: contentToSend,
            settings: {
              ...baseSettings,
              postType: effectivePostType,
            },
            scheduledAt,
            mediaIds:
              platformMediaIds.length > 0 ? platformMediaIds : undefined,
            threadMessages:
              platformThreadMessages.length > 0
                ? platformThreadMessages
                : undefined,
            recycleInterval: pub.recycleInterval || undefined,
            aiGenerated: pub.aiGenerated || undefined,
            sourceDraftId: pub.sourceDraftId || undefined,
            postType: effectivePostType,
            userTags: draft.userTags,
            mediaCrops,
          };

          if (platformId === "instagram") {
            if (draft.firstComment && draft.firstComment.trim().length > 0) {
              payload.settings!.firstComment = draft.firstComment.trim();
            }
            if (draft.instagramCoverUrl) {
              payload.settings!.coverUrl = draft.instagramCoverUrl;
            }
            if (draft.instagramThumbOffset !== null) {
              payload.settings!.thumbOffset = draft.instagramThumbOffset;
            }
            payload.settings!.shareToFeed = draft.instagramShareToFeed;

            if (pub.instagramCollaborators.length > 0) {
              payload.settings!.collaborators = pub.instagramCollaborators.map(
                (c) => c.username
              );
            }
          }

          if (platformId === "facebook") {
            payload.settings!.facebookPostType = draft.facebookPostType;
            if (
              draft.facebookFirstComment &&
              draft.facebookFirstComment.trim().length > 0
            ) {
              payload.settings!.facebookFirstComment =
                draft.facebookFirstComment.trim();
            }
          }

          if (platformId === "tiktok") {
            const tiktokTitle = draft.platformTitles["tiktok"];
            if (tiktokTitle && tiktokTitle.trim().length > 0) {
              payload.title = tiktokTitle.trim();
            }

            const hasVideo = platformMediaUids.some((uid) => {
              const item = draft.stagedMediaItems.find((i) => i.uid === uid);
              return item?.type === "video";
            });

            if (
              hasVideo &&
              draft.tiktokVideoCoverTimestamp !== null &&
              draft.tiktokVideoCoverTimestamp !== undefined
            ) {
              payload.settings!.video_cover_timestamp_ms =
                draft.tiktokVideoCoverTimestamp;
            }
          }

          if (platformId === "youtube") {
            const youtubeTitle = draft.platformTitles["youtube"];
            if (youtubeTitle && youtubeTitle.trim().length > 0) {
              payload.title = youtubeTitle.trim();
            }

            payload.settings!.privacyStatus = pub.youtubePrivacy;
            payload.settings!.categoryId = pub.youtubeCategory;
            payload.settings!.madeForKids = pub.youtubeMadeForKids;
            payload.settings!.thumbnailUrl =
              pub.youtubeThumbnailUrl || undefined;

            if (pub.youtubeTags.trim()) {
              payload.settings!.tags = pub.youtubeTags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            }
          }

          if (platformId === "threads") {
            delete payload.settings!.location;

            if (pub.threadsTopicTag && pub.threadsTopicTag.trim().length > 0) {
              payload.settings!.topicTag = pub.threadsTopicTag.trim();
            }

            if (
              platformMediaIds.length === 0 &&
              pub.threadsLinkAttachment &&
              pub.threadsLinkAttachment.trim().length > 0
            ) {
              payload.settings!.linkAttachment =
                pub.threadsLinkAttachment.trim();
            }

            if (pub.location.id) {
              payload.settings!.locationId = pub.location.id;
            }
          }

          if (platformId === "pinterest") {
            if (!pub.pinterestBoardId) {
              showError("Please select a board for Pinterest.");
              throw new Error("Pinterest validation failed");
            }
            payload.settings!.boardId = pub.pinterestBoardId;

            if (pub.pinterestLink && pub.pinterestLink.trim().length > 0) {
              payload.settings!.link = pub.pinterestLink.trim();
            }

            const pinTitle = draft.platformTitles["pinterest"];
            if (pinTitle && pinTitle.trim().length > 0) {
              payload.title = pinTitle.trim();
            }

            const activeMediaUid = platformMediaUids[0];
            const activeMedia = draft.stagedMediaItems.find(
              (i) => i.uid === activeMediaUid
            );

            if (activeMedia?.type === "video") {
              if (!pub.pinterestCoverUrl) {
                showError("Pinterest videos require a custom cover image.");
                throw new Error(
                  "Pinterest validation failed: Missing cover image"
                );
              }
              payload.settings!.coverUrl = pub.pinterestCoverUrl;
            }

            if (activeMedia?.altText) {
              payload.settings!.altText = activeMedia.altText;
            }
          }

          return postMutation.mutateAsync(payload);
        })
    );

    if (postPromises.length === 0) {
      return;
    }

    try {
      const results = await Promise.all(postPromises);
      const createdPostIds = results.map((r) => r.id);

      if (pub.isScheduling) {
        setConfirmationStatus("scheduled");
        setConfirmationCount(postPromises.length);
        postMutation.reset();
      } else {
        toast.loading("Sending to social platforms...", {
          id: "publishing-toast",
        });

        startPolling(
          createdPostIds,
          () => {
            toast.dismiss("publishing-toast");
            setConfirmationStatus("sent");
            setConfirmationCount(postPromises.length);
            postMutation.reset();
          },
          (errorMessage) => {
            toast.dismiss("publishing-toast");
            showError(`Publishing failed: ${errorMessage}`);
          },
          () => {
            toast.dismiss("publishing-toast");
            toast.success("Post queued! It will appear shortly.");
            setConfirmationStatus("sent");
            setConfirmationCount(postPromises.length);
            postMutation.reset();
          }
        );
      }
    } catch (error: any) {
      console.error("One or more posts failed to publish.", error);
      showError(error.message || "Failed to create posts.");
    }
  };

  return (
    <>
      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <div className="flex items-center justify-between border-b-2 pb-4">
            <h2 className="font-serif text-2xl font-bold">The Draft</h2>
            <FileText className="h-5 w-5 text-[--muted-foreground]" />
          </div>

          <div className="space-y-8">
            <ChannelSelector
              platforms={availablePlatforms}
              onTogglePlatform={togglePlatform}
            />

            <CaptionEditor
              selectedAccounts={selectedAccounts}
              platforms={availablePlatforms}
              onAccountSelect={handleAccountSelect}
              postType={postType}
              threadMessages={threadMessages}
              onThreadMessagesChange={setThreadMessages}
              isGlobalUploading={isGlobalUploading}
              onLocalCaptionsChange={(mainCaption, platformCaptions) => {
                setLocalMainCaption(mainCaption);
                setLocalPlatformCaptions(platformCaptions);
              }}
              mediaUploadSlot={
                <MediaUpload
                  items={editorStagedMediaItems}
                  mediaFiles={stagedMediaFiles}
                  mediaPreviews={stagedMediaPreviews}
                  isUploading={isGlobalUploading}
                  onMediaChange={(files, previews) =>
                    handleMediaChange(files, previews)
                  }
                  onRemoveMedia={(file, index) =>
                    handleRemoveMedia(file, index)
                  }
                  onLibraryMediaSelect={handleLibraryMediaSelect}
                  selectedLibraryMediaIds={selectedLibraryMediaIds}
                />
              }
              mediaErrors={mediaErrors}
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <PreviewPanel />
          <DistributionPanel />
          {mode === "editorial" && (
            <SchedulePanel
              onPublish={handlePublish}
              isPublishing={postMutation.isPending || isPollingStatus}
              isUploading={isGlobalUploading}
            />
          )}
        </div>
      </div>
      <div className="pb-64" />

      <ConfirmationModal
        isOpen={!!confirmationStatus}
        status={confirmationStatus}
        count={confirmationCount}
        onClose={handleCloseConfirmation}
      />

      <ValidationErrorModal
        isOpen={validationErrors.length > 0}
        onClose={clearErrors}
        errors={validationErrors}
      />
    </>
  );
}
