"use client";

import { useState, useEffect, useMemo } from "react";
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
import MediaUpload from "../editorial/components/media-upload";
import { getConnections, Connection } from "@/lib/api/integrations";
import { createPost, CreatePostPayload } from "@/lib/api/publishing";
import { uploadMedia } from "@/lib/api/media";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import ConfirmationModal from "./components/confirmation-modal";

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
}

const initialState = {
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {} as SelectedAccounts,
  mainCaption: "",
  platformCaptions: {} as Record<string, string>,
  mediaItems: [] as MediaItem[],
  labels: "",
  hashtags: "",
  firstComment: "",
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
    firstComment,
    collaborators,
    location,
  } = state;

  const postType: "text" | "image" | "video" = useMemo(() => {
    if (mediaItems.length === 0) return "text";
    if (mediaItems.some((m) => m.file.type.startsWith("video/")))
      return "video";
    return "image";
  }, [mediaItems]);

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

  // --- NEW LOGIC STARTS HERE ---
  const handleMainCaptionChange = (newCaption: string) => {
    const oldMainCaption = state.mainCaption;

    // Copy existing platform captions
    const updatedPlatformCaptions = { ...state.platformCaptions };

    // Iterate over currently selected platforms
    Object.keys(state.selectedAccounts).forEach((platformId) => {
      const currentPlatformCaption = updatedPlatformCaptions[platformId];

      // Logic:
      // 1. If platform caption is empty/undefined -> Update it
      // 2. If platform caption matches the OLD main caption (meaning they were synced) -> Update it
      // 3. Otherwise (user customized it), leave it alone.
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
  // --- NEW LOGIC ENDS HERE ---

  useEffect(() => {
    if (draft) {
      const recoveredMediaItems: MediaItem[] = [];
      if (draft.media?.file && draft.media?.preview) {
        recoveredMediaItems.push({
          file: draft.media.file,
          preview: draft.media.preview,
          id: null,
          isUploading: false,
        });
      }

      updateState({
        mainCaption: draft.mainCaption,
        platformCaptions: draft.platformCaptions,
        selectedAccounts: draft.selectedAccounts,
        mediaItems: recoveredMediaItems,
        labels: draft.distribution?.labels || "",
        hashtags: draft.distribution?.hashtags || "",
        firstComment: draft.distribution?.firstComment || "",
        collaborators: draft.distribution?.collaborators || "",
        location: draft.distribution?.location || "",
        isScheduling: draft.schedule?.isScheduled || false,
        scheduleDate: draft.schedule?.date || getTodayString(),
        scheduleTime: draft.schedule?.time || "12:00",
      });
      clearDraft();
    }
  }, [draft, clearDraft]);

  const uploadMediaMutation = useMutation({
    mutationFn: (variables: { file: File; integrationId: string }) =>
      uploadMedia(variables.file, variables.integrationId),
    onSuccess: (data, variables) => {
      setState((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.map((item) =>
          item.file === variables.file
            ? { ...item, id: data.mediaId, isUploading: false }
            : item
        ),
      }));
    },
    onError: (error, variables) => {
      toast.error(`Upload failed for ${variables.file.name}: ${error.message}`);
      setState((prev) => ({
        ...prev,
        mediaItems: prev.mediaItems.filter(
          (item) => item.file !== variables.file
        ),
      }));
    },
  });

  const postMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onError: (error) => {
      toast.error(`A post failed: ${error.message}`);
    },
  });

  const handleMediaChange = (files: File[], previews: string[]) => {
    const xIntegrationId = selectedAccounts["x"]?.[0];

    if (files.length > 0 && !xIntegrationId) {
      toast.error("Please select a Twitter/X account before uploading.");
      return;
    }

    const newMediaItems: MediaItem[] = files.map((file, index) => {
      const existing = mediaItems.find((m) => m.file === file);
      if (existing) return existing;

      return {
        file,
        preview: previews[index],
        id: null,
        isUploading: true,
      };
    });

    updateState({ mediaItems: newMediaItems });

    newMediaItems.forEach((item) => {
      if (!item.id && item.isUploading && xIntegrationId) {
        uploadMediaMutation.mutate({
          file: item.file,
          integrationId: xIntegrationId,
        });
      }
    });
  };

  const handlePublish = async () => {
    if (!user) return toast.error("You must be logged in to post.");

    const integrationsToPost = Object.values(selectedAccounts).flat();
    if (integrationsToPost.length === 0)
      return toast.error("Please select at least one account.");

    if (mediaItems.some((m) => m.isUploading)) {
      return toast.error("Please wait for media to finish uploading.");
    }

    const uploadedIds = mediaItems.map((m) => m.id).filter(Boolean) as string[];

    if (
      (postType === "image" || postType === "video") &&
      uploadedIds.length === 0
    ) {
      return toast.error("Media failed to upload properly.");
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
      firstComment,
      collaborators,
      location,
    };

    const postPromises = Object.entries(selectedAccounts).flatMap(
      ([platformId, integrationIds]) =>
        integrationIds.map((integrationId) => {
          const payload: CreatePostPayload = {
            userId: user.id,
            integrationId,
            content: platformCaptions[platformId] || mainCaption,
            settings,
            scheduledAt,
            mediaIds: uploadedIds.length > 0 ? uploadedIds : undefined,
          };
          return postMutation.mutateAsync(payload);
        })
    );

    try {
      await Promise.all(postPromises);
      setConfirmationStatus(isScheduling ? "scheduled" : "sent");
      setConfirmationCount(postPromises.length);
    } catch (error) {
      console.error("One or more posts failed to publish.", error);
    }
  };

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
      // Initialize with current main caption so it starts synced
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

  const currentFiles = mediaItems.map((m) => m.file);
  const currentPreviews = mediaItems.map((m) => m.preview);
  const isGlobalUploading = mediaItems.some((m) => m.isUploading);

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
                // CHANGED: Passing the new smart handler
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
                  <MediaUpload
                    mediaFiles={currentFiles}
                    mediaPreviews={currentPreviews}
                    isUploading={isGlobalUploading}
                    onMediaChange={handleMediaChange}
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
              mediaPreview={currentPreviews}
              firstComment={firstComment}
              collaborators={collaborators}
              location={location}
            />

            {/* ... rest of component remains the same ... */}
            <DistributionPanel
              labels={labels}
              hashtags={hashtags}
              firstComment={firstComment}
              collaborators={collaborators}
              location={location}
              onLabelsChange={(val) => updateState({ labels: val })}
              onHashtagsChange={(val) => updateState({ hashtags: val })}
              onFirstCommentChange={(val) => updateState({ firstComment: val })}
              onCollaboratorsChange={(val) =>
                updateState({ collaborators: val })
              }
              onLocationChange={(val) => updateState({ location: val })}
              showActionButtons={false}
              activePlatforms={activePlatforms}
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
