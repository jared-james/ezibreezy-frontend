// components/post-editor/panels/preview-panel.tsx

"use client";

import { useMemo, memo } from "react";
import {
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  AtSign,
  Music2,
  LayoutGrid,
  Pin,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getConnectionsAction } from "@/app/actions/integrations";
import XPreview from "../previews/x";
import InstagramPreview from "../previews/instagram";
import LinkedInPreview from "../previews/linkedin";
import FacebookPreview from "../previews/facebook";
import ThreadsPreview from "../previews/threads";
import TikTokPreview from "../previews/tiktok";
import YouTubePreview from "../previews/youtube";
import PinterestPreview from "../previews/pinterest";
import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import { UserTagDto, ProductTagDto } from "@/lib/types/publishing";
import { useQuery } from "@tanstack/react-query";

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  threads: AtSign,
  tiktok: Music2,
  pinterest: Pin,
};

const platformNames: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  facebook: "Facebook",
  threads: "Threads",
  tiktok: "TikTok",
  pinterest: "Pinterest",
};

function PreviewPanel() {
  const params = useParams();
  const workspaceId = params.workspace as string;

  const mainCaption = useEditorialDraftStore((state) => state.mainCaption);
  const platformCaptions = useEditorialDraftStore(
    (state) => state.platformCaptions
  );
  const userTags = useEditorialDraftStore((state) => state.userTags);
  const productTags = useEditorialDraftStore((state) => state.productTags);
  const postType = useEditorialDraftStore((state) => state.postType);
  const facebookPostType = useEditorialDraftStore(
    (state) => state.facebookPostType
  );
  const platformTitles = useEditorialDraftStore(
    (state) => state.platformTitles
  );
  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const platformMediaSelections = useEditorialDraftStore(
    (state) => state.platformMediaSelections
  );
  const instagramCoverUrl = useEditorialDraftStore(
    (state) => state.instagramCoverUrl
  );
  const instagramThumbOffset = useEditorialDraftStore(
    (state) => state.instagramThumbOffset
  );
  const instagramShareToFeed = useEditorialDraftStore(
    (state) => state.instagramShareToFeed
  );

  const setDraftState = useEditorialDraftStore((state) => state.setDraftState);

  const selectedAccounts = usePublishingStore(
    (state) => state.selectedAccounts
  );
  const pinterestLink = usePublishingStore((state) => state.pinterestLink);
  const collaborators = usePublishingStore((state) => state.collaborators);

  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );

  const activeCaptionFilter = useEditorialUIStore(
    (state) => state.activeCaptionFilter
  );

  const { data: connections = [] } = useQuery({
    queryKey: ["connections", workspaceId],
    queryFn: async () => {
      const result = await getConnectionsAction(workspaceId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });

  const activePlatforms = useMemo(
    () => Object.keys(selectedAccounts),
    [selectedAccounts]
  );

  const validActiveTab = useMemo(() => {
    if (activePlatforms.length === 0) return "empty";
    if (
      activeCaptionFilter !== "all" &&
      activePlatforms.includes(activeCaptionFilter)
    ) {
      return activeCaptionFilter;
    }
    return activePlatforms[0];
  }, [activePlatforms, activeCaptionFilter]);

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

  const currentCaption = useMemo(
    () => platformCaptions[validActiveTab] || mainCaption,
    [platformCaptions, validActiveTab, mainCaption]
  );

  const handleUserTagsChange = (tags: Record<string, UserTagDto[]>) => {
    setDraftState({ userTags: tags });
  };

  const handleProductTagsChange = (tags: Record<string, ProductTagDto[]>) => {
    setDraftState({ productTags: tags });
  };

  if (activePlatforms.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b-2 pb-4">
          <h3 className="font-serif text-2xl font-bold">Post Preview</h3>
          <LayoutGrid className="w-5 h-5 text-[--muted-foreground]" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-[--border] bg-[--surface] text-center p-8 mt-6 rounded-lg">
          <Image
            src="/select_a_channel.webp"
            alt="Select a channel"
            width={160}
            height={160}
            className="mb-4 opacity-50"
          />
          <h3 className="font-serif text-lg font-bold">Select a Channel</h3>
          <p className="font-serif text-sm text-[--muted-foreground] max-w-xs mt-2">
            Select a channel on the left to see a live preview of your post
            here.
          </p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    if (!activeAccount) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-[--muted-foreground] italic font-serif">
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
            mediaItems={activeMediaItems}
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
            onCoverChange={(url) => setDraftState({ instagramCoverUrl: url })}
            thumbOffset={instagramThumbOffset}
            onThumbOffsetChange={(offset) =>
              setDraftState({ instagramThumbOffset: offset })
            }
            shareToFeed={instagramShareToFeed}
            onShareToFeedChange={(val) =>
              setDraftState({ instagramShareToFeed: val })
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
            mediaItems={activeMediaItems}
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
            mediaItems={activeMediaItems}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
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
      case "youtube": {
        return (
          <YouTubePreview
            caption={currentCaption}
            title={platformTitles["youtube"]}
            singleMediaItem={singleMediaItem || null}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
          />
        );
      }
      case "pinterest": {
        return (
          <PinterestPreview
            caption={currentCaption}
            title={platformTitles["pinterest"]}
            singleMediaItem={singleMediaItem || null}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            link={pinterestLink}
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

  const PlatformIcon = platformIcons[validActiveTab];
  const platformName = platformNames[validActiveTab] || validActiveTab;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 pb-4">
        <h3 className="font-serif text-2xl font-bold">Post Preview</h3>
        <LayoutGrid className="w-5 h-5 text-[--muted-foreground]" />
      </div>

      <div className="bg-[--surface] border border-[--border] mt-6 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[--border] bg-[--background]/50">
          {PlatformIcon && (
            <PlatformIcon className="w-5 h-5 text-brand-primary" />
          )}
          <span className="font-serif font-bold text-sm text-[--foreground]">
            {platformName}
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[--background] min-h-[400px]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}

export default memo(PreviewPanel);
