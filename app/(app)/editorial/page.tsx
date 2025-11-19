// app/(app)/editorial/page.tsx

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FileText,
  CheckSquare,
  Twitter,
  Linkedin,
  Youtube,
  Calendar,
  Loader2,
  Instagram,
} from "lucide-react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import ChannelSelector, {
  type Platform,
} from "../ideas/components/edit-modal/channel-selector";
import CaptionEditor from "../ideas/components/edit-modal/caption-editor";
import DistributionPanel from "../ideas/components/edit-modal/distribution-panel";
import PreviewPanel from "../editorial/components/preview-panel";
import MediaUpload from "./components/media-upload"; // Keeping original name for simplicity, but function changed
import { getConnections, Connection } from "@/lib/api/integrations";
import { createPost, CreatePostPayload } from "@/lib/api/publishing";
import { uploadMedia } from "@/lib/api/media";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import ConfirmationModal from "./components/confirmation-modal";
import type { ThreadMessage } from "@/lib/types/editorial";

const platformDefinitions = {
  x: { name: "Twitter/X", icon: Twitter },
  linkedin: { name: "LinkedIn", icon: Linkedin },
  youtube: { name: "YouTube", icon: Youtube },
  instagram: { name: "Instagram", icon: Instagram },
};

type SelectedAccounts = Record<string, string[]>;
const getTodayString = () => new Date().toISOString().split("T")[0];

interface MediaItem {
  file: File;
  preview: string;
  id: string | null;
  isUploading: boolean;
  // New field: null for main post, index (0, 1, 2...) for thread posts
  threadIndex: number | null;
}

// Helper to remove media items by file reference
const filterMediaItems = (mediaItems: MediaItem[], fileToRemove: File) =>
  mediaItems.filter((item) => item.file !== fileToRemove);

const initialState = {
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {} as SelectedAccounts,
  mainCaption: "",
  platformCaptions: {} as Record<string, string>,
  mediaItems: [] as MediaItem[], // Combined pool of all media
  labels: "",
  hashtags: "",
  threadMessages: [] as ThreadMessage[],
  collaborators: "",
  location: "",
};

export default function EditorialPage() {
  const [state, setState] = useState(initialState);
  const {
    isScheduling,
    scheduleDate,
    scheduleTime,
    selectedAccounts,
    mainCaption,
    platformCaptions,
    mediaItems,
    labels,
    hashtags,
    threadMessages,
    collaborators,
    location,
  } = state;

  const mainPostMedia = useMemo(
    () => mediaItems.filter((m) => m.threadIndex === null),
    [mediaItems]
  );

  const postType: "text" | "image" | "video" = useMemo(() => {
    if (mainPostMedia.length === 0) return "text";
    if (mainPostMedia.some((m) => m.file.type.startsWith("video/")))
      return "video";
    return "image";
  }, [mainPostMedia]);

  const updateState = (updates: Partial<typeof initialState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const resetState = () => setState(initialState);

  const [confirmationStatus, setConfirmationStatus] = useState<
    "sent" | "scheduled" | null
  >(null);
  const [confirmationCount, setConfirmationCount] = useState(0);

  const { draft, clearDraft } = useEditorialStore();
  const [user, setUser] = useState<any>(null);

  // --- MUTATIONS ---
  const postMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onError: (error: any) => {
      toast.error(`A post failed: ${error.message || "Unknown error"}`);
    },
  });

  const uploadMediaMutation = useMutation({
    mutationFn: (variables: {
      file: File;
      integrationId: string;
      threadIndex: number | null;
    }) => uploadMedia(variables.file, variables.integrationId),
    onSuccess: (data, variables) => {
      setState((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.map((item) =>
          item.file === variables.file
            ? { ...item, id: data.mediaId, isUploading: false }
            : item
        ),
        // FIX: Ensure threadMessages update logic is contained here and uses 'prev'
        threadMessages:
          variables.threadIndex !== null
            ? prev.threadMessages.map((msg, i) =>
                i === variables.threadIndex
                  ? {
                      ...msg,
                      mediaIds: [...(msg.mediaIds || []), data.mediaId],
                    }
                  : msg
              )
            : prev.threadMessages,
      }));
    },
    onError: (error: any, variables) => {
      toast.error(
        `Upload failed for ${variables.file.name}: ${
          error.message || "Unknown error"
        }`
      );
      setState((prev) => ({
        ...prev,
        mediaItems: filterMediaItems(prev.mediaItems, variables.file),
      }));
    },
  });
  // --- END MUTATIONS ---

  // ... (unchanged connections/user fetching logic)
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

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const availablePlatforms = useMemo((): Platform[] => {
    if (!connections) return [];
    const connectionsByPlatform = connections.reduce((acc, conn) => {
      acc[conn.platform] = acc[conn.platform] || [];
      acc[conn.platform].push(conn);
      return acc;
    }, {} as Record<string, Connection[]>);

    return Object.keys(platformDefinitions).map((platformId) => {
      const def =
        platformDefinitions[platformId as keyof typeof platformDefinitions];
      const accounts =
        connectionsByPlatform[platformId]?.map((conn) => ({
          id: conn.id,
          name: `@${conn.platformUsername}`,
          img: conn.avatarUrl || "/placeholder-pfp.png",
        })) || [];
      return { ...def, id: platformId, accounts };
    });
  }, [connections]);

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );
  // ... (unchanged handleMainCaptionChange logic)

  const handleMainCaptionChange = (newCaption: string) => {
    const oldMainCaption = state.mainCaption;
    const updatedPlatformCaptions = { ...state.platformCaptions };

    Object.keys(state.selectedAccounts).forEach((platformId) => {
      const currentPlatformCaption = updatedPlatformCaptions[platformId];

      if (
        !currentPlatformCaption ||
        currentPlatformCaption === oldMainCaption
      ) {
        updatedPlatformCaptions[platformId] = newCaption;
      }
    });

    updateState({
      mainCaption: newCaption,
      platformCaptions: updatedPlatformCaptions,
    });
  };

  useEffect(() => {
    // ... (unchanged draft recovery logic, assuming draft only contains single media)
    if (draft) {
      const recoveredMediaItems: MediaItem[] = [];
      if (draft.media?.file && draft.media?.preview) {
        recoveredMediaItems.push({
          file: draft.media.file,
          preview: draft.media.preview,
          id: null,
          isUploading: false,
          threadIndex: null, // Main post media
        });
      }

      updateState({
        mainCaption: draft.mainCaption,
        platformCaptions: draft.platformCaptions,
        selectedAccounts: draft.selectedAccounts,
        mediaItems: recoveredMediaItems,
        labels: draft.distribution?.labels || "",
        hashtags: draft.distribution?.hashtags || "",
        threadMessages: draft.distribution?.threadMessages || [],
        collaborators: draft.distribution?.collaborators || "",
        location: draft.distribution?.location || "",
        isScheduling: draft.schedule?.isScheduled || false,
        scheduleDate: draft.schedule?.date || getTodayString(),
        scheduleTime: draft.schedule?.time || "12:00",
      });
      clearDraft();
    }
  }, [draft, clearDraft]);

  // Unified media change handler
  const handleMediaChange = useCallback(
    (
      files: File[],
      previews: string[],
      threadIndex: number | null = null,
      fileToReplace?: File | null // Used for drag-and-drop replacement/removal logic
    ) => {
      const allSelectedIds = Object.values(selectedAccounts).flat();
      const uploadIntegrationId = allSelectedIds[0];

      if (files.length > 0 && !uploadIntegrationId) {
        toast.error("Please select at least one account before uploading.");
        return;
      }

      const newMediaItems: MediaItem[] = [];
      const newFilesForUpload: MediaItem[] = [];

      const existingMedia = mediaItems.filter(
        (m) => m.threadIndex === threadIndex
      );
      const otherMedia = mediaItems.filter(
        (m) => m.threadIndex !== threadIndex
      );

      // 1. Determine the new list of media items for this post/threadIndex
      files.forEach((file, index) => {
        const existing = existingMedia.find((m) => m.file === file);

        if (existing) {
          newMediaItems.push(existing);
        } else {
          const newItem: MediaItem = {
            file,
            preview: previews[index],
            id: null,
            isUploading: true,
            threadIndex,
          };
          newMediaItems.push(newItem);
          newFilesForUpload.push(newItem);
        }
      });

      // 2. Set the complete new mediaItems state
      updateState({
        mediaItems: [...otherMedia, ...newMediaItems],
      });

      // 3. Start uploads for new files
      newFilesForUpload.forEach((item) => {
        if (!item.id && item.isUploading && uploadIntegrationId) {
          uploadMediaMutation.mutate({
            file: item.file,
            integrationId: uploadIntegrationId,
            threadIndex: item.threadIndex,
          });
        }
      });

      // 4. Update threadMessages state with mediaPreviews (for immediate UI update in preview)
      if (threadIndex !== null) {
        setState((prev) => ({
          // FIX: Use functional update here
          ...prev,
          threadMessages: prev.threadMessages.map((msg, i) =>
            i === threadIndex
              ? {
                  ...msg,
                  // Use the *new* file previews for immediate local preview
                  mediaPreviews: newMediaItems
                    .map((m) => m.preview)
                    .filter(Boolean) as string[],
                }
              : msg
          ),
        }));
      }
    },
    [selectedAccounts, mediaItems, uploadMediaMutation] // Removed updateState and state.threadMessages from deps, relying on setState functional update for threadMessages
  );

  // Custom remove handler for thread media
  const handleRemoveThreadMedia = useCallback(
    (fileToRemove: File, threadIndex: number) => {
      const mediaItem = mediaItems.find(
        (m) => m.file === fileToRemove && m.threadIndex === threadIndex
      );
      if (!mediaItem) return;

      // 1. Filter out the item from the main mediaItems pool
      const newMediaItems = filterMediaItems(mediaItems, fileToRemove);
      updateState({ mediaItems: newMediaItems });

      // 2. Update the threadMessage's mediaIds (for publishing) and mediaPreviews (for preview)
      setState((prev) => ({
        // FIX: Use functional update here
        ...prev,
        threadMessages: prev.threadMessages.map((msg, i) => {
          if (i === threadIndex) {
            return {
              ...msg,
              mediaIds:
                msg.mediaIds?.filter((id) => id !== mediaItem.id) || undefined,
              mediaPreviews:
                msg.mediaPreviews?.filter(
                  (preview) => preview !== mediaItem.preview
                ) || undefined,
            };
          }
          return msg;
        }),
      }));
    },
    [mediaItems, updateState] // Removed state.threadMessages from deps
  );

  // Custom remove handler for main post media
  const handleRemoveMainMedia = useCallback(
    (fileToRemove: File) => {
      const newMediaItems = filterMediaItems(mediaItems, fileToRemove);
      updateState({ mediaItems: newMediaItems });
    },
    [mediaItems, updateState]
  );

  const handlePublish = async () => {
    if (!user) return toast.error("You must be logged in to post.");

    const integrationsToPost = Object.values(selectedAccounts).flat();
    if (integrationsToPost.length === 0)
      return toast.error("Please select at least one account.");

    if (mediaItems.some((m) => m.isUploading)) {
      return toast.error("Please wait for media to finish uploading.");
    }

    // Consolidated Media IDs
    const mainPostUploadedIds = mediaItems
      .filter((m) => m.threadIndex === null && m.id !== null)
      .map((m) => m.id) as string[];

    if (
      mainPostMedia.length > 0 &&
      mainPostUploadedIds.length !== mainPostMedia.length
    ) {
      return toast.error(
        "One or more main post media files failed to upload properly."
      );
    }

    // Check all thread media as well
    const threadMediaItems = mediaItems.filter((m) => m.threadIndex !== null);
    const threadMediaUploadedCount = threadMediaItems.filter(
      (m) => m.id !== null
    ).length;
    if (threadMediaUploadedCount !== threadMediaItems.length) {
      return toast.error(
        "One or more thread media files failed to upload properly."
      );
    }

    let scheduledAt: string | undefined = undefined;
    if (isScheduling) {
      if (!scheduleDate || !scheduleTime)
        return toast.error("Please select a valid date and time.");
      const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      if (isNaN(dateTime.getTime()))
        return toast.error("Invalid schedule date or time.");
      scheduledAt = dateTime.toISOString();
    }

    const settings = {
      labels,
      hashtags,
      collaborators,
      location,
    };

    // Filter and prepare thread messages for the payload
    const finalThreadMessagesForPublish = threadMessages
      .map((msg) => ({
        content: msg.content.trim(),
        mediaIds: msg.mediaIds?.filter(Boolean) || undefined, // Use uploaded IDs
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

          // Special handling for X:
          if (platformId === "x") {
            // Main post uses the uploaded media items assigned to the main post
            platformMediaIds = mainPostUploadedIds.slice(0, 4);
          } else {
            // For non-X platforms, clear thread messages
            platformThreadMessages = [];
            // Non-X platforms use all media uploaded to the main post
            // (limits are assumed to be handled by the MediaUpload component on the main post)
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
      handleCloseConfirmation(); // Reset state after successful publish
    } catch (error) {
      console.error("One or more posts failed to publish.", error);
    }
  };

  // ... (handleCloseConfirmation, togglePlatform, handleAccountSelect unchanged)
  const handleCloseConfirmation = () => {
    setConfirmationStatus(null);
    setConfirmationCount(0);
    resetState();
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

  const mainPostFiles = mainPostMedia.map((m) => m.file);
  const mainPostPreviews = mainPostMedia.map((m) => m.preview);
  const isGlobalUploading = mediaItems.some((m) => m.isUploading);

  // Media Previews for the main post
  const mainPostMediaPreviews = mainPostMedia.map((m) => m.preview);

  // Media Previews for the thread messages (for XPreview)
  const threadMessagesWithPreviews = threadMessages.map((msg, index) => {
    const threadMedia = mediaItems.filter((m) => m.threadIndex === index);
    return {
      ...msg,
      // Pass the local preview URLs for XPreview
      mediaPreviews: threadMedia
        .map((m) => m.preview)
        .filter(Boolean) as string[],
      isUploading: threadMedia.some((m) => m.isUploading),
    };
  });

  return (
    <>
      <div className="h-full flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6 ">
        <div className="mb-8 border-b-4 border-double border-[--foreground] pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">The Workroom</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
                Editorial Desk
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
              <h2 className="font-serif text-xl font-bold text-[--foreground]">
                The Draft
              </h2>
              <FileText className="w-4 h-4 text-[--muted]" />
            </div>

            <div className="space-y-6">
              <ChannelSelector
                platforms={availablePlatforms}
                activePlatforms={activePlatforms}
                onTogglePlatform={togglePlatform}
              />

              <CaptionEditor
                mainCaption={mainCaption}
                onMainCaptionChange={handleMainCaptionChange}
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
                  // Main post media upload uses its dedicated handler
                  <MediaUpload
                    mediaFiles={mainPostFiles}
                    mediaPreviews={mainPostPreviews}
                    isUploading={mainPostMedia.some((m) => m.isUploading)}
                    onMediaChange={(files, previews) =>
                      handleMediaChange(files, previews, null)
                    }
                    onRemoveMedia={handleRemoveMainMedia}
                    activePlatforms={activePlatforms}
                  />
                }
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <PreviewPanel
              postType={postType}
              selectedAccounts={selectedAccounts}
              mainCaption={mainCaption}
              platformCaptions={platformCaptions}
              mediaPreview={mainPostMediaPreviews} // Main post media only
              threadMessages={threadMessagesWithPreviews} // Thread messages with full preview data
              collaborators={collaborators}
              location={location}
            />

            <DistributionPanel
              labels={labels}
              hashtags={hashtags}
              threadMessages={threadMessagesWithPreviews} // Pass the augmented thread messages
              collaborators={collaborators}
              location={location}
              onLabelsChange={(val) => updateState({ labels: val })}
              onHashtagsChange={(val) => updateState({ hashtags: val })}
              onThreadMessagesChange={(val) =>
                updateState({
                  threadMessages: val.map((m) => ({
                    content: m.content,
                    mediaIds: m.mediaIds,
                  })),
                })
              } // Convert back to DTO format
              onCollaboratorsChange={(val) =>
                updateState({ collaborators: val })
              }
              onLocationChange={(val) => updateState({ location: val })}
              handleThreadMediaChange={(files, previews, index) =>
                handleMediaChange(files, previews, index)
              } // Pass the unified handler
              handleRemoveThreadMedia={handleRemoveThreadMedia} // Pass the specific removal handler
              showActionButtons={false}
              activePlatforms={activePlatforms}
              isGlobalUploading={isGlobalUploading}
            />

            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
                <h3 className="font-serif text-xl font-bold text-[--foreground]">
                  Schedule
                </h3>
                <Calendar className="w-4 h-4 text-[--muted]" />
              </div>

              <div className="bg-[--surface] border border-[--border] p-5 space-y-6 mt-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[--surface-hover]">
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
                  <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[--surface-hover]">
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
                  <div className="p-3 bg-[--background] border border-[--border] space-y-3 animate-in fade-in-50">
                    <div>
                      <label htmlFor="date" className="eyebrow">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={scheduleDate}
                        onChange={(e) =>
                          updateState({ scheduleDate: e.target.value })
                        }
                        className="w-full p-2 border border-[--border] mt-1 font-serif"
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
                        onChange={(e) =>
                          updateState({ scheduleTime: e.target.value })
                        }
                        className="w-full p-2 border border-[--border] mt-1 font-serif"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-dashed border-[--border]">
                  <button
                    onClick={handlePublish}
                    disabled={postMutation.isPending || isGlobalUploading}
                    className="w-full py-3 px-4 bg-[--foreground] text-[--background] font-serif font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {postMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckSquare className="w-4 h-4" />
                    )}
                    {isScheduling ? "Schedule Post" : "Send to Press"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-64"></div>

      <ConfirmationModal
        isOpen={!!confirmationStatus}
        status={confirmationStatus}
        count={confirmationCount}
        onClose={handleCloseConfirmation}
      />
    </>
  );
}
