// app/(app)/editorial/components/editorial-core.tsx

"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import ChannelSelector from "@/app/(app)/ideas/components/edit-modal/channel-selector";
import CaptionEditor from "@/app/(app)/ideas/components/edit-modal/caption-editor";
import DistributionPanel from "@/app/(app)/ideas/components/edit-modal/distribution-panel";
import PreviewPanel from "./preview-panel";
import MediaUpload from "./media-upload";
import ScheduleCard from "./schedule-card";
import ConfirmationModal from "./confirmation-modal";

import { usePostEditor } from "@/lib/hooks/use-post-editor";
import { useEditorialStore } from "@/lib/store/editorial-store";
import type { CreatePostPayload } from "@/lib/api/publishing";

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

  const resetEditor = useEditorialStore((state) => state.reset);
  const setState = useEditorialStore((state) => state.setState);

  // Select only what we need from the store
  const isScheduling = useEditorialStore((state) => state.isScheduling);
  const scheduleDate = useEditorialStore((state) => state.scheduleDate);
  const scheduleTime = useEditorialStore((state) => state.scheduleTime);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const mainCaption = useEditorialStore((state) => state.mainCaption);
  const platformCaptions = useEditorialStore((state) => state.platformCaptions);
  const collaborators = useEditorialStore((state) => state.collaborators);
  const location = useEditorialStore((state) => state.location);
  const labels = useEditorialStore((state) => state.labels);
  const mediaItems = useEditorialStore((state) => state.mediaItems);
  const storeThreadMessages = useEditorialStore(
    (state) => state.threadMessages
  );
  const recycleInterval = useEditorialStore((state) => state.recycleInterval);
  const aiGenerated = useEditorialStore((state) => state.aiGenerated);
  const sourceDraftId = useEditorialStore((state) => state.sourceDraftId); // NEW: Get sourceDraftId

  const {
    mainPostMediaFiles,
    mainPostMediaPreviews,
    postType,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    threadMessages,
    handleMediaChange,
    handleRemoveMedia,
    setThreadMessages,
    postMutation,
  } = usePostEditor({ mode });

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
    const newCaptions = { ...platformCaptions };

    if (newSelected[platformId]) {
      delete newSelected[platformId];
      delete newCaptions[platformId];
    } else {
      newSelected[platformId] = [platform.accounts[0].id];
      newCaptions[platformId] = mainCaption;
    }

    setState({
      selectedAccounts: newSelected,
      platformCaptions: newCaptions,
    });
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
    if (!user) return toast.error("You must be logged in to post.");

    const integrationsToPost = Object.values(selectedAccounts).flat();
    if (integrationsToPost.length === 0) {
      return toast.error("Please select at least one account.");
    }

    if (isGlobalUploading) {
      return toast.error("Please wait for media to finish uploading.");
    }

    const mainPostMedia = mediaItems.filter((m) => m.threadIndex === null);

    const mainPostUploadedIds = mainPostMedia
      .filter((m) => m.id !== null)
      .map((m) => m.id) as string[];

    if (
      mainPostMedia.length > 0 &&
      mainPostUploadedIds.length !== mainPostMedia.length
    ) {
      return toast.error(
        "One or more main post media files failed to upload properly."
      );
    }

    const threadMediaItems = mediaItems.filter((m) => m.threadIndex !== null);
    const threadMediaUploadedCount = threadMediaItems.filter(
      (m) => m.id !== null
    ).length;

    if (threadMediaUploadedCount !== threadMediaItems.length) {
      return toast.error(
        "One or more thread media files failed to upload properly."
      );
    }

    let scheduledAt: string | undefined;
    if (isScheduling) {
      if (!scheduleDate || !scheduleTime) {
        return toast.error("Please select a valid date and time.");
      }
      const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      if (isNaN(dateTime.getTime())) {
        return toast.error("Invalid schedule date or time.");
      }
      scheduledAt = dateTime.toISOString();
    }

    // FIX 1: Save the universal main caption in settings.canonicalContent
    const settings = {
      labels,
      collaborators,
      location,
      canonicalContent: mainCaption, // <-- NEW FIELD
    };

    const finalThreadMessagesForPublish = storeThreadMessages
      .map((msg) => ({
        content: msg.content.trim(),
        mediaIds: msg.mediaIds?.filter(Boolean) || undefined,
      }))
      .filter(
        (msg) =>
          msg.content.length > 0 || (msg.mediaIds && msg.mediaIds.length > 0)
      );

    const postPromises = Object.entries(selectedAccounts).flatMap(
      ([platformId, integrationIds]) =>
        integrationIds.map((integrationId) => {
          let platformMediaIds = mainPostUploadedIds;
          let platformThreadMessages = finalThreadMessagesForPublish;

          if (platformId === "x") {
            platformMediaIds = mainPostUploadedIds.slice(0, 4);
          } else {
            platformThreadMessages = [];
            platformMediaIds = platformMediaIds.slice(0, 1);
          }

          // FIX 2: Correctly decide the content to send to the database
          const platformSpecificContent = platformCaptions[platformId];
          const contentToSend =
            platformSpecificContent && platformSpecificContent.trim().length > 0
              ? platformSpecificContent
              : mainCaption;

          const payload: CreatePostPayload = {
            userId: user.id,
            integrationId,
            content: contentToSend, // Send platform-specific or main
            settings, // Includes canonicalContent
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
          };

          return postMutation.mutateAsync(payload);
        })
    );

    try {
      await Promise.all(postPromises);
      setConfirmationStatus(isScheduling ? "scheduled" : "sent");
      setConfirmationCount(postPromises.length);
      postMutation.reset();
    } catch (error) {
      console.error("One or more posts failed to publish.", error);
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
              mainCaption={mainCaption}
              onMainCaptionChange={(caption) =>
                setState({ mainCaption: caption })
              }
              platformCaptions={platformCaptions}
              onPlatformCaptionChange={(platformId, caption) =>
                setState({
                  platformCaptions: {
                    ...platformCaptions,
                    [platformId]: caption,
                  },
                })
              }
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
              mediaUploadSlot={
                <MediaUpload
                  mediaFiles={mainPostMediaFiles}
                  mediaPreviews={mainPostMediaPreviews}
                  isUploading={mediaItems
                    .filter((m) => m.threadIndex === null)
                    .some((m) => m.isUploading)}
                  onMediaChange={(files, previews) =>
                    handleMediaChange(files, previews, null)
                  }
                  onRemoveMedia={(file) => handleRemoveMedia(file, null)}
                  activePlatforms={activePlatforms}
                />
              }
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <PreviewPanel />
          <DistributionPanel
            showActionButtons={mode === "clipping"}
            onSaveClipping={onSaveClipping}
            onOpenInEditorial={onOpenInEditorial}
            isSaving={isSavingClipping}
          />
          {mode === "editorial" && (
            <ScheduleCard
              onPublish={handlePublish}
              isPublishing={postMutation.isPending}
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
