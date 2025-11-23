// components/post-editor/preview-panel.tsx

"use client";

import { useState, useMemo, memo } from "react";
import {
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  AtSign,
  Music2,
  LayoutGrid,
} from "lucide-react";
import Image from "next/image";
import { getConnections } from "@/lib/api/integrations";
import XPreview from "./x-preview";
import InstagramPreview from "./instagram-preview";
import LinkedInPreview from "./linkedin-preview";
import FacebookPreview from "./facebook-preview";
import ThreadsPreview from "./threads-preview";
import TikTokPreview from "./tiktok-preview";
import { cn } from "@/lib/utils";
import { usePostEditor } from "@/lib/hooks/use-post-editor";
import {
  LocationState,
  useEditorialStore,
  MediaItem,
} from "@/lib/store/editorial-store";
import { useQuery } from "@tanstack/react-query";
import { UserTagDto } from "@/lib/api/publishing";
import type { SocialPlatform } from "@/lib/utils/crop-utils";

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  threads: AtSign,
  tiktok: Music2,
};

const platformNames: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  facebook: "Facebook",
  threads: "Threads",
  tiktok: "TikTok",
};

interface PreviewPanelProps {
  selectedAccounts: Record<string, string[]>;
  mainCaption: string;
  platformCaptions: Record<string, string>;
  collaborators: string;
  location: LocationState;
}

function PreviewPanel({
  selectedAccounts,
  mainCaption,
  platformCaptions,
  collaborators,
  location,
}: PreviewPanelProps) {
  const {
    postType: mediaPostType,
    mainPostMediaPreviews,
    threadMessages,
  } = usePostEditor();
  const userTags = useEditorialStore((state) => state.userTags);
  const postType = useEditorialStore((state) => state.postType);
  const facebookPostType = useEditorialStore((state) => state.facebookPostType);
  const setState = useEditorialStore((state) => state.setState);
  const mediaItems = useEditorialStore((state) => state.mediaItems);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);

  const mainPostMediaItems = useMemo(
    () => mediaItems.filter((m) => m.threadIndex === null),
    [mediaItems]
  );

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const activePlatforms = useMemo(
    () => Object.keys(selectedAccounts),
    [selectedAccounts]
  );

  const [activeTab, setActiveTab] = useState<string>("empty");

  const validActiveTab = useMemo(() => {
    if (activePlatforms.length === 0) return "empty";
    if (activeTab !== "empty" && activePlatforms.includes(activeTab)) {
      return activeTab;
    }
    return activePlatforms[0];
  }, [activePlatforms, activeTab]);

  const activeAccount = useMemo(() => {
    if (validActiveTab === "empty") return null;

    const integrationId = selectedAccounts[validActiveTab]?.[0];
    if (!integrationId) return null;

    return connections.find((conn) => conn.id === integrationId) || null;
  }, [validActiveTab, selectedAccounts, connections]);

  const tabList = useMemo(
    () =>
      activePlatforms.map((id) => {
        const Icon = platformIcons[id] || Twitter;
        return {
          id,
          name: platformNames[id] || id,
          Icon,
        };
      }),
    [activePlatforms]
  );

  const showIconsOnly = activePlatforms.length > 2;

  const currentCaption = useMemo(
    () => platformCaptions[validActiveTab] || mainCaption,
    [platformCaptions, validActiveTab, mainCaption]
  );

  const handleUserTagsChange = (tags: UserTagDto[]) => {
    setState({ userTags: tags });
  };

  if (activePlatforms.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
          <h3 className="font-serif text-xl font-bold text-[--foreground]">
            Post Preview
          </h3>
          <LayoutGrid className="w-4 h-4 text-[--muted]" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-[--border] bg-[--surface] text-center p-8 mt-4">
          <Image
            src="/select_a_channel.webp"
            alt="Select a channel"
            width={160}
            height={160}
            className="mb-3"
          />
          <h3 className="font-serif text-lg font-bold">Select a Channel</h3>
          <p className="font-serif text-sm text-[--muted-foreground] max-w-xs mt-2">
            Select an account on the left to see a live preview of your post
            here.
          </p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    if (!activeAccount) {
      return (
        <div className="text-center p-8 text-[--muted-foreground]">
          No account selected for preview.
        </div>
      );
    }

    const singleMedia = Array.isArray(mainPostMediaPreviews)
      ? mainPostMediaPreviews[0]
      : mainPostMediaPreviews;

    switch (validActiveTab) {
      case "x": {
        const xMediaItem = mainPostMediaItems[0];
        const xOriginalSrc = xMediaItem?.preview;
        const xCroppedPreview = xMediaItem?.croppedPreviews?.x;
        return (
          <XPreview
            caption={currentCaption}
            mediaPreview={mainPostMediaPreviews}
            threadMessages={threadMessages}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            postType={mediaPostType}
            originalMediaSrc={xOriginalSrc}
            croppedPreview={xCroppedPreview}
            onCropComplete={(cropData, croppedPreviewUrl) => {
              const mediaIndex = mediaItems.findIndex(
                (m) => m.threadIndex === null
              );
              if (mediaIndex !== -1) {
                setCropForMedia(mediaIndex, "x", cropData, croppedPreviewUrl);
              }
            }}
          />
        );
      }
      case "instagram": {
        const mediaItem = mainPostMediaItems[0];
        const originalSrc = mediaItem?.preview;
        const croppedPreview = mediaItem?.croppedPreviews?.instagram;
        const instagramAspectRatio =
          mediaItem?.crops?.instagram?.aspectRatio ?? 1;
        return (
          <InstagramPreview
            caption={currentCaption}
            mediaPreview={singleMedia}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            collaborators={collaborators}
            location={location.name}
            postType={postType}
            userTags={userTags}
            onUserTagsChange={handleUserTagsChange}
            originalMediaSrc={originalSrc}
            croppedPreview={croppedPreview}
            aspectRatio={instagramAspectRatio}
            onCropComplete={(cropData, croppedPreviewUrl) => {
              if (mainPostMediaItems.length > 0) {
                const mediaIndex = mediaItems.findIndex(
                  (m) => m.threadIndex === null
                );
                if (mediaIndex !== -1) {
                  setCropForMedia(
                    mediaIndex,
                    "instagram",
                    cropData,
                    croppedPreviewUrl
                  );
                }
              }
            }}
          />
        );
      }
      case "linkedin": {
        const liMediaItem = mainPostMediaItems[0];
        const liOriginalSrc = liMediaItem?.preview;
        const liCroppedPreview = liMediaItem?.croppedPreviews?.linkedin;
        return (
          <LinkedInPreview
            caption={currentCaption}
            mediaPreview={singleMedia}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            originalMediaSrc={liOriginalSrc}
            croppedPreview={liCroppedPreview}
            onCropComplete={(cropData, croppedPreviewUrl) => {
              const mediaIndex = mediaItems.findIndex(
                (m) => m.threadIndex === null
              );
              if (mediaIndex !== -1) {
                setCropForMedia(
                  mediaIndex,
                  "linkedin",
                  cropData,
                  croppedPreviewUrl
                );
              }
            }}
          />
        );
      }
      case "facebook": {
        const fbMediaItem = mainPostMediaItems[0];
        const fbOriginalSrc = fbMediaItem?.preview;
        const fbCroppedPreview = fbMediaItem?.croppedPreviews?.facebook;
        const fbAspectRatio = fbMediaItem?.crops?.facebook?.aspectRatio ?? 1.91;
        return (
          <FacebookPreview
            caption={currentCaption}
            mediaPreview={singleMedia}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            originalMediaSrc={fbOriginalSrc}
            croppedPreview={fbCroppedPreview}
            postType={facebookPostType}
            aspectRatio={fbAspectRatio}
            onCropComplete={(cropData, croppedPreviewUrl) => {
              const mediaIndex = mediaItems.findIndex(
                (m) => m.threadIndex === null
              );
              if (mediaIndex !== -1) {
                setCropForMedia(
                  mediaIndex,
                  "facebook",
                  cropData,
                  croppedPreviewUrl
                );
              }
            }}
          />
        );
      }
      case "threads": {
        const thMediaItem = mainPostMediaItems[0];
        const thOriginalSrc = thMediaItem?.preview;
        const thCroppedPreview = thMediaItem?.croppedPreviews?.threads;
        return (
          <ThreadsPreview
            caption={currentCaption}
            mediaPreview={mainPostMediaPreviews}
            mediaType={mediaPostType}
            threadMessages={threadMessages}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            originalMediaSrc={thOriginalSrc}
            croppedPreview={thCroppedPreview}
            onCropComplete={(cropData, croppedPreviewUrl) => {
              const mediaIndex = mediaItems.findIndex(
                (m) => m.threadIndex === null
              );
              if (mediaIndex !== -1) {
                setCropForMedia(
                  mediaIndex,
                  "threads",
                  cropData,
                  croppedPreviewUrl
                );
              }
            }}
          />
        );
      }
      case "tiktok": {
        const ttMediaItem = mainPostMediaItems[0];
        const ttOriginalSrc = ttMediaItem?.preview;
        const ttCroppedPreview = ttMediaItem?.croppedPreviews?.tiktok;
        return (
          <TikTokPreview
            caption={currentCaption}
            mediaPreview={singleMedia}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            originalMediaSrc={ttOriginalSrc}
            croppedPreview={ttCroppedPreview}
            onCropComplete={(cropData, croppedPreviewUrl) => {
              const mediaIndex = mediaItems.findIndex(
                (m) => m.threadIndex === null
              );
              if (mediaIndex !== -1) {
                setCropForMedia(
                  mediaIndex,
                  "tiktok",
                  cropData,
                  croppedPreviewUrl
                );
              }
            }}
          />
        );
      }
      default:
        return (
          <div className="text-center p-8 text-[--muted-foreground]">
            No preview available for {validActiveTab}.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Post Preview
        </h3>
        <LayoutGrid className="w-4 h-4 text-[--muted]" />
      </div>

      <div className="bg-[--surface] border border-[--border] mt-4">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[--border] bg-[--background]">
          {tabList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.name}
              className={cn(
                "flex items-center gap-2 text-sm font-serif transition-colors",
                showIconsOnly ? "p-2" : "px-3 py-1.5",
                validActiveTab === tab.id
                  ? "bg-[--foreground] text-[--background] font-bold"
                  : "text-[--muted] hover:bg-[--surface-hover]"
              )}
            >
              <tab.Icon className="w-4 h-4" />
              {!showIconsOnly && tab.name}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[--background] min-h-[400px]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}

export default memo(PreviewPanel);
