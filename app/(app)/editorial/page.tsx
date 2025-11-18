// app/(app)/editorial/page.tsx

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
import PostTypeSelector from "../ideas/components/edit-modal/post-type-selector";
import ChannelSelector, {
  type Platform,
} from "../ideas/components/edit-modal/channel-selector";
import CaptionEditor from "../ideas/components/edit-modal/caption-editor";
import MediaPanel from "../ideas/components/edit-modal/media-panel";
import DistributionPanel from "../ideas/components/edit-modal/distribution-panel";
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

const initialState = {
  postType: "text" as "text" | "image" | "video",
  isScheduling: false,
  scheduleDate: getTodayString(),
  scheduleTime: "12:00",
  selectedAccounts: {} as SelectedAccounts,
  mainCaption: "",
  platformCaptions: {} as Record<string, string>,
  mediaFile: null as File | null,
  mediaPreview: null as string | null,
  uploadedMediaId: null as string | null,
  labels: "",
  hashtags: "",
  firstComment: "",
  collaborators: "",
  location: "",
};

export default function EditorialPage() {
  const [state, setState] = useState(initialState);
  const {
    postType,
    isScheduling,
    scheduleDate,
    scheduleTime,
    selectedAccounts,
    mainCaption,
    platformCaptions,
    mediaFile,
    mediaPreview,
    uploadedMediaId,
    labels,
    hashtags,
    firstComment,
    collaborators,
    location,
  } = state;

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

  useEffect(() => {
    if (draft) {
      updateState({
        postType: draft.postType,
        mainCaption: draft.mainCaption,
        platformCaptions: draft.platformCaptions,
        selectedAccounts: draft.selectedAccounts,
        mediaFile: draft.media?.file || null,
        mediaPreview: draft.media?.preview || null,
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
    onSuccess: (data) => {
      toast.success("Image uploaded successfully!");
      updateState({ uploadedMediaId: data.mediaId });
    },
    onError: (error) => {
      toast.error(`Image upload failed: ${error.message}`);
      updateState({
        mediaFile: null,
        mediaPreview: null,
        uploadedMediaId: null,
      });
    },
  });

  const postMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onError: (error) => {
      toast.error(`A post failed: ${error.message}`);
    },
  });

  const handlePublish = async () => {
    if (!user) return toast.error("You must be logged in to post.");

    const integrationsToPost = Object.values(selectedAccounts).flat();
    if (integrationsToPost.length === 0)
      return toast.error("Please select at least one account.");

    if ((postType === "image" || postType === "video") && !uploadedMediaId) {
      return toast.error(
        "Please wait for the media to finish uploading before publishing."
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
            mediaIds: uploadedMediaId ? [uploadedMediaId] : undefined,
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
              <PostTypeSelector
                postType={postType}
                onPostTypeChange={(type) => updateState({ postType: type })}
              />

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
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <MediaPanel
              postType={postType}
              mediaFile={mediaFile}
              mediaPreview={mediaPreview}
              isUploading={uploadMediaMutation.isPending}
              onMediaChange={(file, preview) => {
                updateState({ mediaFile: file, mediaPreview: preview });
                if (file) {
                  const xIntegrationId = selectedAccounts["x"]?.[0];
                  if (!xIntegrationId) {
                    toast.error(
                      "Please select a Twitter/X account before uploading an image."
                    );
                    updateState({ mediaFile: null, mediaPreview: null });
                    return;
                  }
                  uploadMediaMutation.mutate({
                    file,
                    integrationId: xIntegrationId,
                  });
                } else {
                  updateState({ uploadedMediaId: null });
                }
              }}
            />

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
                    disabled={
                      postMutation.isPending || uploadMediaMutation.isPending
                    }
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
