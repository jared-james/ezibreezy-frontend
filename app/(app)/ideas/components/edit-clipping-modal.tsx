// app/(app)/ideas/components/edit-clipping-modal.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";
import {
  type Clipping as EditorialClipping,
  type EditorialDraft,
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

export default function EditClippingModal({
  isOpen,
  onClose,
  idea,
}: EditClippingModalProps) {
  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const setState = useEditorialStore((state) => state.setState);
  const reset = useEditorialStore((state) => state.reset);
  const setDraft = useEditorialStore((state) => state.setDraft);
  const mainCaption = useEditorialStore((state) => state.mainCaption);
  const platformCaptions = useEditorialStore((state) => state.platformCaptions);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const threadMessages = useEditorialStore((state) => state.threadMessages);
  const labels = useEditorialStore((state) => state.labels);
  const collaborators = useEditorialStore((state) => state.collaborators);
  const location = useEditorialStore((state) => state.location);

  const [postType, setPostType] = useState<"text" | "image" | "video">("text");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const router = useRouter();

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

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );

  useEffect(() => {
    if (isOpen) {
      const initialPlatform = availablePlatforms.find(
        (p) => p.accounts.length > 0
      );
      const initialSelected = initialPlatform
        ? { [initialPlatform.id]: [initialPlatform.accounts[0].id] }
        : {};

      setState({
        mainCaption: idea.body,
        selectedAccounts: initialSelected,
      });
    } else {
      reset();
      setPostType("text");
      setMediaFile(null);
      setMediaPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idea.body]);

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

  const togglePlatform = (platformId: string) => {
    const isCurrentlyActive = activePlatforms.has(platformId);
    const newSelected = { ...selectedAccounts };
    const newCaptions = { ...platformCaptions };

    if (isCurrentlyActive) {
      delete newSelected[platformId];
      delete newCaptions[platformId];
    } else {
      const platform = availablePlatforms.find((p) => p.id === platformId);
      if (!platform || platform.accounts.length === 0) return;
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
    const newCaptions = { ...platformCaptions };

    if (newSelection.length === 0) {
      delete newSelected[platformId];
      delete newCaptions[platformId];
    } else {
      newSelected[platformId] = newSelection;
      if (currentSelection.length === 0) {
        newCaptions[platformId] = mainCaption;
      }
    }

    setState({
      selectedAccounts: newSelected,
      platformCaptions: newCaptions,
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
                    onMediaChange={(file, preview) => {
                      setMediaFile(file);
                      setMediaPreview(preview);
                    }}
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
                    threadMessages={threadMessages as ThreadMessageAugmented[]}
                    onThreadMessagesChange={(msgs) =>
                      setState({ threadMessages: msgs })
                    }
                    handleThreadMediaChange={handleThreadMediaChangeNoop}
                    handleRemoveThreadMedia={handleRemoveThreadMediaNoop}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 lg:col-span-5">
                <DistributionPanel
                  onOpenInEditorial={handleOpenInEditorial}
                  onSaveClipping={handleSaveClipping}
                  showActionButtons={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
