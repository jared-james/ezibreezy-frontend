// app/(app)/editorial/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { FileText, CheckSquare, Calendar, Loader2 } from "lucide-react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import ChannelSelector from "../ideas/components/edit-modal/channel-selector";
import CaptionEditor from "../ideas/components/edit-modal/caption-editor";
import DistributionPanel from "../ideas/components/edit-modal/distribution-panel";
import PreviewPanel from "../editorial/components/preview-panel";
import MediaUpload from "./components/media-upload";
import { usePostEditor, type EditorState } from "@/lib/hooks/use-post-editor";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import ConfirmationModal from "./components/confirmation-modal";
import type { CreatePostPayload } from "@/lib/api/publishing";

const getTodayString = () => new Date().toISOString().split("T")[0];

const initialState: EditorState = {
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {},
  mainCaption: "",
  platformCaptions: {},
  mediaItems: [],
  labels: "",
  hashtags: "",
  threadMessages: [],
  collaborators: "",
  location: "",
};

export default function EditorialPage() {
  const { draft, clearDraft } = useEditorialStore();
  const [user, setUser] = useState<any>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<
    "sent" | "scheduled" | null
  >(null);
  const [confirmationCount, setConfirmationCount] = useState(0);

  const initialEditorState: Partial<EditorState> = useMemo(() => {
    if (!draft) return {};
    return {
      mainCaption: draft.mainCaption,
      platformCaptions: draft.platformCaptions,
      selectedAccounts: draft.selectedAccounts,
      labels: draft.distribution?.labels || "",
      hashtags: draft.distribution?.hashtags || "",
      threadMessages: draft.distribution?.threadMessages || [],
      collaborators: draft.distribution?.collaborators || "",
      location: draft.distribution?.location || "",
      isScheduling: draft.schedule?.isScheduled || false,
      scheduleDate: draft.schedule?.date,
      scheduleTime: draft.schedule?.time,
    };
  }, [draft]);

  const {
    state,
    mainPostMediaFiles,
    mainPostMediaPreviews,
    postType,
    isGlobalUploading,
    availablePlatforms,
    activePlatforms,
    threadMessages,
    updateState,
    handleMediaChange,
    handleRemoveMedia,
    setThreadMessages,
    postMutation,
  } = usePostEditor(initialEditorState);

  const {
    isScheduling,
    scheduleDate,
    scheduleTime,
    selectedAccounts,
    mainCaption,
    platformCaptions,
    collaborators,
    location,
    labels,
    hashtags,
  } = state;

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

  useEffect(() => {
    if (draft) {
      if (draft.media?.file && draft.media?.preview) {
        handleMediaChange([draft.media.file], [draft.media.preview], null);
      }
      clearDraft();
    }
  }, [draft, clearDraft, handleMediaChange]);

  const handleCloseConfirmation = () => {
    setConfirmationStatus(null);
    setConfirmationCount(0);
    updateState({ ...initialState });
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

    updateState({
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

    updateState({ selectedAccounts: newSelected });
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

    const mainPostUploadedIds = state.mediaItems
      .filter((m) => m.threadIndex === null && m.id !== null)
      .map((m) => m.id) as string[];

    const mainPostMedia = state.mediaItems.filter(
      (m) => m.threadIndex === null
    );

    if (
      mainPostMedia.length > 0 &&
      mainPostUploadedIds.length !== mainPostMedia.length
    ) {
      return toast.error(
        "One or more main post media files failed to upload properly."
      );
    }

    const threadMediaItems = state.mediaItems.filter(
      (m) => m.threadIndex !== null
    );
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

    const settings = { labels, hashtags, collaborators, location };

    const finalThreadMessagesForPublish = state.threadMessages
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
          }

          const payload: CreatePostPayload = {
            userId: user.id,
            integrationId,
            content: platformCaptions[platformId] || mainCaption,
            settings,
            scheduledAt,
            mediaIds:
              platformMediaIds.length > 0 ? platformMediaIds : undefined,
            threadMessages:
              platformThreadMessages.length > 0
                ? platformThreadMessages
                : undefined,
          };

          return postMutation.mutateAsync(payload);
        })
    );

    try {
      await Promise.all(postPromises);
      setConfirmationStatus(isScheduling ? "scheduled" : "sent");
      setConfirmationCount(postPromises.length);
      handleCloseConfirmation();
    } catch (error) {
      console.error("One or more posts failed to publish.", error);
    }
  };

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 md:p-6">
        <div className="mb-8 border-b-4 border-[--foreground] border-double pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-2">The Workroom</p>
              <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-[--foreground] md:text-5xl">
                Editorial Desk
              </h1>
            </div>
          </div>
        </div>

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
                  updateState({ mainCaption: caption })
                }
                platformCaptions={platformCaptions}
                onPlatformCaptionChange={(platformId, caption) =>
                  updateState({
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
                mediaUploadSlot={
                  <MediaUpload
                    mediaFiles={mainPostMediaFiles}
                    mediaPreviews={mainPostMediaPreviews}
                    isUploading={state.mediaItems
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
            <PreviewPanel
              postType={postType}
              selectedAccounts={selectedAccounts}
              mainCaption={mainCaption}
              platformCaptions={platformCaptions}
              mediaPreview={mainPostMediaPreviews}
              threadMessages={threadMessages}
              collaborators={collaborators}
              location={location}
            />

            <DistributionPanel
              labels={labels}
              hashtags={hashtags}
              threadMessages={threadMessages}
              collaborators={collaborators}
              location={location}
              onLabelsChange={(value) => updateState({ labels: value })}
              onHashtagsChange={(value) => updateState({ hashtags: value })}
              onThreadMessagesChange={setThreadMessages}
              onCollaboratorsChange={(value) =>
                updateState({ collaborators: value })
              }
              onLocationChange={(value) => updateState({ location: value })}
              handleThreadMediaChange={(files, previews, index) =>
                handleMediaChange(files, previews, index)
              }
              handleRemoveThreadMedia={handleRemoveMedia}
              showActionButtons={false}
              activePlatforms={activePlatforms}
              isGlobalUploading={isGlobalUploading}
            />

            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
                <h3 className="font-serif text-xl font-bold text-[--foreground]">
                  Schedule
                </h3>
                <Calendar className="h-4 w-4 text-[--muted]" />
              </div>

              <div className="mt-4 space-y-6 border border-[--border] bg-[--surface] p-5">
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-3 p-2 hover:bg-[--surface-hover]">
                    <input
                      type="radio"
                      name="timing"
                      checked={!isScheduling}
                      onChange={() => updateState({ isScheduling: false })}
                      className="accent-[--foreground]"
                    />
                    <span className="font-serif text-sm">
                      Immediate Release
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 p-2 hover:bg-[--surface-hover]">
                    <input
                      type="radio"
                      name="timing"
                      checked={isScheduling}
                      onChange={() => updateState({ isScheduling: true })}
                      className="accent-[--foreground]"
                    />
                    <span className="font-serif text-sm">
                      Schedule for Later
                    </span>
                  </label>
                </div>

                {isScheduling && (
                  <div className="animate-in fade-in-50 space-y-3 border border-[--border] bg-[--background] p-3">
                    <div>
                      <label htmlFor="date" className="eyebrow">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={scheduleDate}
                        onChange={(event) =>
                          updateState({ scheduleDate: event.target.value })
                        }
                        className="mt-1 w-full border border-[--border] p-2 font-serif"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="eyebrow">
                        Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        value={scheduleTime}
                        onChange={(event) =>
                          updateState({ scheduleTime: event.target.value })
                        }
                        className="mt-1 w-full border border-[--border] p-2 font-serif"
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-[--border] border-dashed pt-4">
                  <button
                    onClick={handlePublish}
                    disabled={postMutation.isPending || isGlobalUploading}
                    className="flex w-full items-center justify-center gap-2 bg-[--foreground] py-3 px-4 font-serif text-xs font-bold uppercase tracking-wider text-[--background] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {postMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckSquare className="h-4 w-4" />
                    )}
                    {isScheduling ? "Schedule Post" : "Send to Press"}
                  </button>
                </div>
              </div>
            </div>
          </div>
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
