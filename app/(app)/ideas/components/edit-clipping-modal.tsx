// app/(app)/ideas/components/edit-clipping-modal.tsx

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";
import {
  type Clipping as EditorialClipping,
  type EditorialDraft,
  type ThreadMessage,
  type ThreadMessageAugmented,
  type Platform,
} from "@/lib/types/editorial";
import { useEditorialStore } from "@/lib/store/editorial-store";
import ModalHeader from "./edit-modal/modal-header";
import PostTypeSelector from "./edit-modal/post-type-selector";
import ChannelSelector from "./edit-modal/channel-selector";
import CaptionEditor from "./edit-modal/caption-editor";
import MediaPanel from "./edit-modal/media-panel";
import DistributionPanel from "./edit-modal/distribution-panel";
import { type Connection, getConnections } from "@/lib/api/integrations";
import { useQuery } from "@tanstack/react-query";

interface EditClippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: EditorialClipping | GeneratedClipping;
}

const platformDefinitions = {
  x: { name: "Twitter/X", icon: Twitter },
  linkedin: { name: "LinkedIn", icon: Linkedin },
  youtube: { name: "YouTube", icon: Youtube },
  instagram: { name: "Instagram", icon: Instagram },
};

type SelectedAccounts = Record<string, string[]>;

export default function EditClippingModal({
  isOpen,
  onClose,
  idea,
}: EditClippingModalProps) {
  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const availablePlatforms = useMemo((): Platform[] => {
    if (!connections) return [];

    const connectionsByPlatform = connections.reduce((acc, connection) => {
      acc[connection.platform] = acc[connection.platform] || [];
      acc[connection.platform].push(connection);
      return acc;
    }, {} as Record<string, Connection[]>);

    return Object.keys(platformDefinitions)
      .map((platformId) => {
        const definition =
          platformDefinitions[platformId as keyof typeof platformDefinitions];
        const accounts =
          connectionsByPlatform[platformId]?.map((connection) => ({
            id: connection.id,
            name: `@${connection.platformUsername}`,
            img: connection.avatarUrl || "/placeholder-pfp.png",
          })) || [];

        return { ...definition, id: platformId, accounts };
      })
      .filter((platform) => platform.accounts.length > 0);
  }, [connections]);

  const initialPlatform = availablePlatforms.find(
    (platform) => platform.accounts.length > 0
  );

  const [postType, setPostType] = useState<"text" | "image" | "video">("text");

  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccounts>(
    initialPlatform
      ? { [initialPlatform.id]: [initialPlatform.accounts[0].id] }
      : {}
  );

  const [mainCaption, setMainCaption] = useState(idea.body);
  const [platformCaptions, setPlatformCaptions] = useState<
    Record<string, string>
  >({});

  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(
    new Set(initialPlatform ? [initialPlatform.id] : [])
  );

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [labels, setLabels] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
  const [collaborators, setCollaborators] = useState("");
  const [location, setLocation] = useState("");

  const router = useRouter();
  const { setDraft } = useEditorialStore();

  const handleOpenInEditorial = () => {
    const draft: EditorialDraft = {
      postType,
      mainCaption,
      platformCaptions,
      activePlatforms: Array.from(activePlatforms),
      selectedAccounts,
      media:
        mediaFile && mediaPreview
          ? {
              file: mediaFile,
              preview: mediaPreview,
              type: postType === "video" ? "video" : "image",
            }
          : undefined,
      distribution: {
        labels,
        hashtags,
        threadMessages,
        collaborators,
        location,
      },
      sourceId: "id" in idea ? idea.id : undefined,
      sourceTitle: idea.title,
    };

    setDraft(draft);
    router.push("/editorial");
    onClose();
  };

  const handleSaveClipping = () => {
    console.log("Save clipping functionality to be implemented");
  };

  const handleMediaChange = (file: File | null, preview: string | null) => {
    setMediaFile(file);
    setMediaPreview(preview);
  };

  const togglePlatform = (platformId: string) => {
    const isCurrentlyActive = activePlatforms.has(platformId);

    if (isCurrentlyActive) {
      setActivePlatforms((previous) => {
        const updated = new Set(previous);
        updated.delete(platformId);
        return updated;
      });

      setSelectedAccounts((previous) => {
        const { [platformId]: _, ...rest } = previous;
        return rest;
      });

      setPlatformCaptions((previous) => {
        const { [platformId]: _, ...rest } = previous;
        return rest;
      });

      return;
    }

    const platform = availablePlatforms.find((p) => p.id === platformId);
    if (!platform || platform.accounts.length === 0) return;

    setActivePlatforms((previous) => new Set(previous).add(platformId));

    setSelectedAccounts((previous) => ({
      ...previous,
      [platformId]: [platform.accounts[0].id],
    }));

    setPlatformCaptions((previous) => ({
      ...previous,
      [platformId]: mainCaption,
    }));
  };

  const handleAccountSelect = (platformId: string, accountId: string) => {
    setSelectedAccounts((previous) => {
      const currentSelection = previous[platformId] || [];
      const isSelected = currentSelection.includes(accountId);

      const newSelection = isSelected
        ? currentSelection.filter((id) => id !== accountId)
        : [...currentSelection, accountId];

      if (newSelection.length === 0) {
        const { [platformId]: _, ...rest } = previous;

        setPlatformCaptions((previousCaptions) => {
          const { [platformId]: __, ...restCaptions } = previousCaptions;
          return restCaptions;
        });

        return rest;
      }

      if (currentSelection.length === 0 && newSelection.length === 1) {
        setPlatformCaptions((previousCaptions) => ({
          ...previousCaptions,
          [platformId]: mainCaption,
        }));
      }

      return { ...previous, [platformId]: newSelection };
    });
  };

  if (!isOpen) return null;

  const handleThreadMediaChangeNoop = (..._args: unknown[]) => {
    console.warn(
      "Thread media editing is only supported in the main Editorial Desk."
    );
  };

  const handleRemoveThreadMediaNoop = (..._args: unknown[]) => {
    console.warn(
      "Thread media editing is only supported in the main Editorial Desk."
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden border-4 border-foreground bg-surface shadow-2xl">
        <div className="flex-1 overflow-y-auto">
          <ModalHeader idea={idea} onClose={onClose} />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="flex flex-col gap-4 lg:col-span-7">
                <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    The Draft
                  </h3>
                </div>

                <div className="space-y-6">
                  <PostTypeSelector
                    postType={postType}
                    onPostTypeChange={setPostType}
                  />

                  <ChannelSelector
                    platforms={availablePlatforms}
                    activePlatforms={activePlatforms}
                    onTogglePlatform={togglePlatform}
                  />

                  <MediaPanel
                    postType={postType}
                    mediaFile={mediaFile}
                    mediaPreview={mediaPreview}
                    onMediaChange={handleMediaChange}
                  />

                  <CaptionEditor
                    mainCaption={mainCaption}
                    onMainCaptionChange={setMainCaption}
                    platformCaptions={platformCaptions}
                    onPlatformCaptionChange={(platformId, caption) =>
                      setPlatformCaptions((previous) => ({
                        ...previous,
                        [platformId]: caption,
                      }))
                    }
                    selectedAccounts={selectedAccounts}
                    platforms={availablePlatforms}
                    onAccountSelect={handleAccountSelect}
                    postType={postType}
                    threadMessages={threadMessages as ThreadMessageAugmented[]}
                    onThreadMessagesChange={setThreadMessages}
                    handleThreadMediaChange={handleThreadMediaChangeNoop}
                    handleRemoveThreadMedia={handleRemoveThreadMediaNoop}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 lg:col-span-5">
                <DistributionPanel
                  onOpenInEditorial={handleOpenInEditorial}
                  onSaveClipping={handleSaveClipping}
                  labels={labels}
                  hashtags={hashtags}
                  collaborators={collaborators}
                  location={location}
                  onLabelsChange={setLabels}
                  onHashtagsChange={setHashtags}
                  onCollaboratorsChange={setCollaborators}
                  onLocationChange={setLocation}
                  activePlatforms={activePlatforms}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
