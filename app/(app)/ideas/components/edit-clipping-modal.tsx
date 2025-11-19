// app/(app)/ideas/components/edit-clipping-modal.tsx

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Video,
} from "lucide-react";
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";
import type { Clipping } from "@/lib/types/editorial";
import { useEditorialStore } from "@/lib/store/editorial-store";
import type { EditorialDraft } from "@/lib/types/editorial";
import ModalHeader from "./edit-modal/modal-header";
import PostTypeSelector from "./edit-modal/post-type-selector";
import ChannelSelector, { type Platform } from "./edit-modal/channel-selector";
import CaptionEditor from "./edit-modal/caption-editor";
import MediaPanel from "./edit-modal/media-panel";
import DistributionPanel from "./edit-modal/distribution-panel";
import { Connection, getConnections } from "@/lib/api/integrations";
import { useQuery } from "@tanstack/react-query";
// app/(app)/ideas/components/edit-clipping-modal.tsx

interface EditClippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Clipping | GeneratedClipping;
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
    const connectionsByPlatform = connections.reduce((acc, conn) => {
      acc[conn.platform] = acc[conn.platform] || [];
      acc[conn.platform].push(conn);
      return acc;
    }, {} as Record<string, Connection[]>);

    return Object.keys(platformDefinitions)
      .map((platformId) => {
        const def =
          platformDefinitions[platformId as keyof typeof platformDefinitions];
        const accounts =
          connectionsByPlatform[platformId]?.map((conn) => ({
            id: conn.id,
            name: `@${conn.platformUsername}`,
            img: conn.avatarUrl || "/placeholder-pfp.png",
          })) || [];
        return { ...def, id: platformId, accounts };
      })
      .filter((platform) => platform.accounts.length > 0);
  }, [connections]);

  const initialPlatform = availablePlatforms.find((p) => p.accounts.length > 0);

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
  const [firstComment, setFirstComment] = useState("");
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
        firstComment,
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
      setActivePlatforms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(platformId);
        return newSet;
      });
      setSelectedAccounts((prev) => {
        const { [platformId]: _, ...rest } = prev;
        return rest;
      });
      setPlatformCaptions((prev) => {
        const { [platformId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      const platform = availablePlatforms.find((p) => p.id === platformId);
      if (!platform || platform.accounts.length === 0) return;

      setActivePlatforms((prev) => new Set(prev).add(platformId));

      if (platform.accounts.length > 0) {
        setSelectedAccounts((prev) => ({
          ...prev,
          [platformId]: [platform.accounts[0].id],
        }));
        setPlatformCaptions((prev) => ({
          ...prev,
          [platformId]: mainCaption,
        }));
      }
    }
  };

  const handleAccountSelect = (platformId: string, accountId: string) => {
    setSelectedAccounts((prev) => {
      const currentSelection = prev[platformId] || [];
      const isSelected = currentSelection.includes(accountId);

      const newSelection = isSelected
        ? currentSelection.filter((id) => id !== accountId)
        : [...currentSelection, accountId];

      if (newSelection.length === 0) {
        const { [platformId]: _, ...rest } = prev;
        setPlatformCaptions((prevCaptions) => {
          const { [platformId]: __, ...restCaptions } = prevCaptions;
          return restCaptions;
        });
        return rest;
      }

      if (currentSelection.length === 0 && newSelection.length === 1) {
        setPlatformCaptions((prevCaptions) => ({
          ...prevCaptions,
          [platformId]: mainCaption,
        }));
      }

      return { ...prev, [platformId]: newSelection };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
      <div className="bg-white border-4 border-[--foreground] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <ModalHeader idea={idea} onClose={onClose} />
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
                  <h3 className="font-serif text-xl font-bold text-[--foreground]">
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
                      setPlatformCaptions((prev) => ({
                        ...prev,
                        [platformId]: caption,
                      }))
                    }
                    selectedAccounts={selectedAccounts}
                    platforms={availablePlatforms}
                    onAccountSelect={handleAccountSelect}
                    postType={postType}
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6 flex flex-col">
                <DistributionPanel
                  onOpenInEditorial={handleOpenInEditorial}
                  onSaveClipping={handleSaveClipping}
                  labels={labels}
                  hashtags={hashtags}
                  firstComment={firstComment}
                  collaborators={collaborators}
                  location={location}
                  onLabelsChange={setLabels}
                  onHashtagsChange={setHashtags}
                  onFirstCommentChange={setFirstComment}
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
