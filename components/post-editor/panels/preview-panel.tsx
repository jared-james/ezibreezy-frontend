// components/post-editor/preview-panel.tsx

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
import XPreview from "../previews/x";
import InstagramPreview from "../previews/instagram";
import LinkedInPreview from "../previews/linkedin";
import FacebookPreview from "../previews/facebook";
import ThreadsPreview from "../previews/threads";
import TikTokPreview from "../previews/tiktok";
import { cn } from "@/lib/utils";
import {
  LocationState,
  useEditorialStore,
  MediaItem,
} from "@/lib/store/editorial-store";
import { UserTagDto, ProductTagDto } from "@/lib/api/publishing";
import { useQuery } from "@tanstack/react-query";

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
}

function PreviewPanel({
  selectedAccounts,
  mainCaption,
  platformCaptions,
  collaborators,
}: PreviewPanelProps) {
  const userTags = useEditorialStore((state) => state.userTags);
  const productTags = useEditorialStore((state) => state.productTags);
  const postType = useEditorialStore((state) => state.postType);
  const facebookPostType = useEditorialStore((state) => state.facebookPostType);
  const platformTitles = useEditorialStore((state) => state.platformTitles);
  const setState = useEditorialStore((state) => state.setState);
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);
  const platformMediaSelections = useEditorialStore(
    (state) => state.platformMediaSelections
  );

  const instagramCoverUrl = useEditorialStore(
    (state) => state.instagramCoverUrl
  );
  const instagramThumbOffset = useEditorialStore(
    (state) => state.instagramThumbOffset
  );
  const instagramShareToFeed = useEditorialStore(
    (state) => state.instagramShareToFeed
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
  const activeCaptionFilter = useEditorialStore(
    (state) => state.activeCaptionFilter
  );

  const validActiveTab = useMemo(() => {
    if (activePlatforms.length === 0) return "empty";
    if (
      activeCaptionFilter !== "all" &&
      activePlatforms.includes(activeCaptionFilter)
    ) {
      return activeCaptionFilter;
    }
    if (activeTab !== "empty" && activePlatforms.includes(activeTab)) {
      return activeTab;
    }
    return activePlatforms[0];
  }, [activePlatforms, activeTab, activeCaptionFilter]);

  const activeMediaItems = useMemo(() => {
    const selectedUids = platformMediaSelections[validActiveTab] || [];
    return selectedUids
      .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
      .filter((item): item is MediaItem => !!item);
  }, [validActiveTab, platformMediaSelections, stagedMediaItems]);

  const activeAccount = useMemo(() => {
    if (validActiveTab === "empty") return null;
    const integrationId = selectedAccounts[validActiveTab]?.[0];
    if (!integrationId) return null;
    return connections.find((conn) => conn.id === integrationId) || null;
  }, [validActiveTab, selectedAccounts, connections]);

  const tabList = useMemo(
    () =>
      activePlatforms.map((id) => ({
        id,
        name: platformNames[id] || id,
        Icon: platformIcons[id] || Twitter,
      })),
    [activePlatforms]
  );

  const currentCaption = useMemo(
    () => platformCaptions[validActiveTab] || mainCaption,
    [platformCaptions, validActiveTab, mainCaption]
  );

  const handleUserTagsChange = (tags: Record<string, UserTagDto[]>) => {
    setState({ userTags: tags });
  };

  const handleProductTagsChange = (tags: Record<string, ProductTagDto[]>) => {
    setState({ productTags: tags });
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

    const mediaPostType = activeMediaItems.some((item) => item.type === "video")
      ? "video"
      : activeMediaItems.length > 0
      ? "image"
      : "text";
    const singleMediaItem = activeMediaItems[0];
    const mediaPreviews = activeMediaItems.map((item) => {
      const cropped =
        item.croppedPreviews?.[
          validActiveTab as keyof typeof item.croppedPreviews
        ];
      return cropped || item.preview;
    });

    switch (validActiveTab) {
      case "x": {
        return (
          <XPreview
            caption={currentCaption}
            mediaPreview={mediaPreviews}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            postType={mediaPostType}
            singleMediaItem={singleMediaItem}
          />
        );
      }
      case "instagram": {
        const instagramAspectRatio =
          singleMediaItem?.crops?.instagram?.aspectRatio ?? 1;
        return (
          <InstagramPreview
            caption={currentCaption}
            singleMediaItem={singleMediaItem || null}
            mediaItems={activeMediaItems}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            collaborators={collaborators}
            postType={postType}
            userTags={userTags}
            onUserTagsChange={handleUserTagsChange}
            productTags={productTags}
            onProductTagsChange={handleProductTagsChange}
            aspectRatio={instagramAspectRatio}
            coverUrl={instagramCoverUrl}
            onCoverChange={(url) => setState({ instagramCoverUrl: url })}
            thumbOffset={instagramThumbOffset}
            onThumbOffsetChange={(offset) =>
              setState({ instagramThumbOffset: offset })
            }
            shareToFeed={instagramShareToFeed}
            onShareToFeedChange={(val) =>
              setState({ instagramShareToFeed: val })
            }
          />
        );
      }
      case "linkedin": {
        const linkedinAspectRatio =
          singleMediaItem?.crops?.linkedin?.aspectRatio ?? 1.91;
        return (
          <LinkedInPreview
            caption={currentCaption}
            singleMediaItem={singleMediaItem || null}
            mediaItems={activeMediaItems}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            aspectRatio={linkedinAspectRatio}
          />
        );
      }
      case "facebook": {
        const fbAspectRatio =
          singleMediaItem?.crops?.facebook?.aspectRatio ?? 1.91;
        return (
          <FacebookPreview
            caption={currentCaption}
            singleMediaItem={singleMediaItem || null}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            postType={facebookPostType}
            aspectRatio={fbAspectRatio}
          />
        );
      }
      case "threads": {
        return (
          <ThreadsPreview
            caption={currentCaption}
            mediaPreview={mediaPreviews}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            singleMediaItem={singleMediaItem}
          />
        );
      }
      case "tiktok": {
        return (
          <TikTokPreview
            caption={currentCaption}
            title={platformTitles["tiktok"]}
            singleMediaItem={singleMediaItem || null}
            mediaItems={activeMediaItems}
            mediaType={mediaPostType}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
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
                "flex items-center justify-center rounded-full p-2 border-2",
                validActiveTab === tab.id
                  ? "border-brand-primary bg-surface text-brand-primary"
                  : "border-border bg-surface text-foreground hover:bg-surface-hover"
              )}
            >
              <tab.Icon className="w-4 h-4" />
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
