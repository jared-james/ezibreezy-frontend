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

import { usePostEditor } from "@/lib/hooks/use-post-editor";
import { useEditorialStore } from "@/lib/store/editorial-store";
import type { CreatePostPayload, PostSettings } from "@/lib/api/publishing";
import { PlatformCrops } from "@/lib/utils/crop-utils";
import { usePostStatusPolling } from "./hooks/use-post-status-polling";

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
  onSaveClipping,
  isSavingClipping = false,
  onOpenInEditorial,
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
  const [localLabels, setLocalLabels] = useState("");
  const [localCollaborators, setLocalCollaborators] = useState("");

  const resetEditor = useEditorialStore((state) => state.reset);
  const setState = useEditorialStore((state) => state.setState);

  const isScheduling = useEditorialStore((state) => state.isScheduling);
  const scheduleDate = useEditorialStore((state) => state.scheduleDate);
  const scheduleTime = useEditorialStore((state) => state.scheduleTime);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);
  const platformMediaSelections = useEditorialStore(
    (state) => state.platformMediaSelections
  );
  const storeThreadMessages = useEditorialStore(
    (state) => state.threadMessages
  );
  const storePlatformThreadMessages = useEditorialStore(
    (state) => state.platformThreadMessages
  );
  const recycleInterval = useEditorialStore((state) => state.recycleInterval);
  const aiGenerated = useEditorialStore((state) => state.aiGenerated);
  const sourceDraftId = useEditorialStore((state) => state.sourceDraftId);

  const firstComment = useEditorialStore((state) => state.firstComment);
  const postTypeFromStore = useEditorialStore((state) => state.postType);
  const userTags = useEditorialStore((state) => state.userTags);

  const facebookPostType = useEditorialStore((state) => state.facebookPostType);
  const facebookFirstComment = useEditorialStore(
    (state) => state.facebookFirstComment
  );
  const platformTitles = useEditorialStore((state) => state.platformTitles);

  const instagramCoverUrl = useEditorialStore(
    (state) => state.instagramCoverUrl
  );
  const instagramThumbOffset = useEditorialStore(
    (state) => state.instagramThumbOffset
  );
  const instagramShareToFeed = useEditorialStore(
    (state) => state.instagramShareToFeed
  );

  const {
    stagedMediaFiles,
    stagedMediaPreviews,
    postType,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    threadMessages,
    handleMediaChange,
    handleRemoveMedia,
    handleLibraryMediaSelect,
    selectedLibraryMediaIds,
    setThreadMessages,
    postMutation,
  } = usePostEditor({ mode });

  const { startPolling, isPolling: isPollingStatus } = usePostStatusPolling();

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

  const handleCloseConfirmation = () => {
    setConfirmationStatus(null);
    setConfirmationCount(0);
    resetEditor();
    if (onPostSuccess) {
      onPostSuccess();
    }
  };

  const togglePlatform = (platformId: string) => {
    const platform = availablePlatforms.find((p) => p.id === platformId);
    if (!platform || platform.accounts.length === 0) return;

    const newSelected = { ...selectedAccounts };
    const newCaptions = { ...localPlatformCaptions };

    if (newSelected[platformId]) {
      delete newSelected[platformId];
      delete newCaptions[platformId];
    } else {
      newSelected[platformId] = [platform.accounts[0].id];
      newCaptions[platformId] = localMainCaption;
    }

    setState({
      selectedAccounts: newSelected,
      platformCaptions: newCaptions,
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

    setState({ selectedAccounts: newSelected });
  };

  const handlePublish = async () => {
    setState({
      mainCaption: localMainCaption,
      platformCaptions: localPlatformCaptions,
      labels: localLabels,
      collaborators: localCollaborators,
    });

    if (!user) return showError("You must be logged in to post.");

    const integrationsToPost = Object.values(selectedAccounts).flat();
    if (integrationsToPost.length === 0) {
      return showError("Please select at least one account.");
    }

    if (isGlobalUploading) {
      return showError("Please wait for media to finish uploading.");
    }

    // Ensure all selected media for publishing have been uploaded
    for (const [platformId, selection] of Object.entries(
      platformMediaSelections
    )) {
      if (
        !selectedAccounts[platformId] ||
        selectedAccounts[platformId].length === 0
      )
        continue;
      for (const uid of selection) {
        const mediaItem = stagedMediaItems.find((item) => item.uid === uid);
        if (mediaItem && !mediaItem.id) {
          return showError(
            `Media for ${platformId} is still processing. Please wait.`
          );
        }
      }
    }

    let scheduledAt: string | undefined;
    if (isScheduling) {
      if (!scheduleDate || !scheduleTime) {
        return showError("Please select a valid date and time.");
      }
      const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      if (isNaN(dateTime.getTime())) {
        return showError("Invalid schedule date or time.");
      }
      scheduledAt = dateTime.toISOString();
    }

    const location = useEditorialStore.getState().location;
    const productTags = useEditorialStore.getState().productTags;
    const baseSettings: PostSettings = {
      labels: localLabels,
      collaborators: localCollaborators,
      location: location.name,
      locationId: location.id || undefined,
      canonicalContent: localMainCaption,
      postType: postTypeFromStore,
      userTags,
      productTags,
    };

    const processThreadMessages = (messages: typeof storeThreadMessages) =>
      messages
        .map((msg) => ({
          content: msg.content.trim(),
          mediaIds: msg.mediaIds?.filter(Boolean) || undefined,
        }))
        .filter(
          (msg) =>
            msg.content.length > 0 || (msg.mediaIds && msg.mediaIds.length > 0)
        );

    const finalThreadMessagesForPublish =
      processThreadMessages(storeThreadMessages);

    const mediaCrops: Record<string, PlatformCrops> = {};
    stagedMediaItems.forEach((item) => {
      if (item.id && item.crops) {
        mediaCrops[item.id] = item.crops;
      }
    });

    const postPromises = Object.entries(selectedAccounts).flatMap(
      ([platformId, integrationIds]) =>
        integrationIds.map((integrationId) => {
          const platformMediaUids = platformMediaSelections[platformId] || [];
          const platformMediaIds = platformMediaUids
            .map((uid) => stagedMediaItems.find((item) => item.uid === uid)?.id)
            .filter(Boolean) as string[];

          let platformThreadMessages: {
            content: string;
            mediaIds: string[] | undefined;
          }[] = [];
          if (platformId === "x" || platformId === "threads") {
            const platformSpecificThreads =
              storePlatformThreadMessages[platformId];
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

          const platformSpecificContent = localPlatformCaptions[platformId];

          let contentToSend = "";

          const isStory =
            (platformId === "instagram" && postTypeFromStore === "story") ||
            (platformId === "facebook" && facebookPostType === "story");

          if (isStory) {
            contentToSend = platformSpecificContent || "";
          } else {
            contentToSend =
              platformSpecificContent &&
              platformSpecificContent.trim().length > 0
                ? platformSpecificContent
                : localMainCaption;
          }

          const payload: CreatePostPayload = {
            userId: user.id,
            integrationId,
            content: contentToSend,
            settings: { ...baseSettings },
            scheduledAt,
            mediaIds:
              platformMediaIds.length > 0 ? platformMediaIds : undefined,
            threadMessages:
              platformThreadMessages.length > 0
                ? platformThreadMessages
                : undefined,
            recycleInterval: recycleInterval || undefined,
            aiGenerated: aiGenerated || undefined,
            sourceDraftId: sourceDraftId || undefined,
            postType: postTypeFromStore,
            userTags,
            mediaCrops,
          };

          if (platformId === "instagram") {
            if (firstComment && firstComment.trim().length > 0) {
              payload.settings!.firstComment = firstComment.trim();
            }
            if (instagramCoverUrl) {
              payload.settings!.coverUrl = instagramCoverUrl;
            }
            if (instagramThumbOffset !== null) {
              payload.settings!.thumbOffset = instagramThumbOffset;
            }
            payload.settings!.shareToFeed = instagramShareToFeed;
          }

          if (platformId === "facebook") {
            payload.settings!.facebookPostType = facebookPostType;
            if (
              facebookFirstComment &&
              facebookFirstComment.trim().length > 0
            ) {
              payload.settings!.facebookFirstComment =
                facebookFirstComment.trim();
            }
          }

          if (platformId === "tiktok") {
            const tiktokTitle = platformTitles["tiktok"];
            if (tiktokTitle && tiktokTitle.trim().length > 0) {
              payload.title = tiktokTitle.trim();
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

      if (isScheduling) {
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
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
            <h2 className="font-serif text-xl font-bold text-[--foreground]">
              The Draft
            </h2>
            <FileText className="h-4 w-4 text-[--muted]" />
          </div>

          <div className="space-y-6">
            <ChannelSelector
              platforms={availablePlatforms}
              activePlatforms={activePlatforms}
              onTogglePlatform={togglePlatform}
            />

            <CaptionEditor
              selectedAccounts={selectedAccounts}
              platforms={availablePlatforms}
              onAccountSelect={handleAccountSelect}
              postType={postType}
              threadMessages={threadMessages}
              onThreadMessagesChange={setThreadMessages}
              handleThreadMediaChange={(files, previews, index) =>
                handleMediaChange(files, previews, index)
              }
              handleRemoveThreadMedia={handleRemoveMedia}
              isGlobalUploading={isGlobalUploading}
              onLocalCaptionsChange={(mainCaption, platformCaptions) => {
                setLocalMainCaption(mainCaption);
                setLocalPlatformCaptions(platformCaptions);
              }}
              mediaUploadSlot={
                <MediaUpload
                  mediaFiles={stagedMediaFiles}
                  mediaPreviews={stagedMediaPreviews}
                  isUploading={isGlobalUploading}
                  onMediaChange={(files, previews) =>
                    handleMediaChange(files, previews, null)
                  }
                  onRemoveMedia={(file) => handleRemoveMedia(file, null)}
                  onLibraryMediaSelect={handleLibraryMediaSelect}
                  selectedLibraryMediaIds={selectedLibraryMediaIds}
                />
              }
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <PreviewPanel
            selectedAccounts={selectedAccounts}
            mainCaption={localMainCaption}
            platformCaptions={localPlatformCaptions}
            collaborators={localCollaborators}
          />
          <DistributionPanel
            showActionButtons={mode === "clipping"}
            onSaveClipping={onSaveClipping}
            onOpenInEditorial={onOpenInEditorial}
            isSaving={isSavingClipping}
            onLocalFieldsChange={(labels, collaborators) => {
              setLocalLabels(labels);
              setLocalCollaborators(collaborators);
            }}
          />
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
    </>
  );
}
