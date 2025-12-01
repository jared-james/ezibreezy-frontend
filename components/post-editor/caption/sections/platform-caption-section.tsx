// components/post-editor/caption/sections/platform-caption-section.tsx

"use client";

import { Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Platform, ThreadMessageAugmented } from "@/lib/types/editorial";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "../components/platform-icon";
import { CaptionTextarea } from "../components/caption-textarea";
import { PostTypeSelector } from "../components/post-type-selector";
import { ThreadSection } from "./thread-section";
import { FirstCommentSection } from "./first-comment-section";
import PlatformMediaSelector from "../../media/platform-media-selector";
import { YouTubeOptions } from "../../previews/youtube/youtube-options";
import { PinterestOptions } from "../../previews/pinterest/pinterest-options";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";

interface PlatformCaptionSectionProps {
  platformId: string;
  platform: Platform;
  selectedAccounts: Record<string, string[]>;
  onAccountSelect: (platformId: string, accountId: string) => void;
  currentCaption: string;
  onCaptionChange: (value: string) => void;
  openHashtagModal: (platformId: string) => void;
  postType: "text" | "image" | "video";
  currentPostType: "post" | "story" | "reel";
  facebookPostType: "post" | "story" | "reel";
  setState: (state: any) => void; // Generically typed as it maps to setDraftState
  localPlatformTitles: Record<string, string>;
  setLocalPlatformTitles: (
    update: (prev: Record<string, string>) => Record<string, string>
  ) => void;
  currentThreadMessages: ThreadMessageAugmented[];
  updateThreadMessageContent: (
    index: number,
    content: string,
    platformId: string
  ) => void;
  removeThreadMessage: (index: number, platformId: string) => void;
  addThreadMessage: (platformId: string) => void;
  openThreadHashtagModal: (threadIndex: number) => void;
  localFirstComment: string;
  setLocalFirstComment: (comment: string) => void;
  showFirstComment: boolean;
  setShowFirstComment: (show: boolean) => void;
  localFacebookFirstComment: string;
  setLocalFacebookFirstComment: (comment: string) => void;
  showFacebookFirstComment: boolean;
  setShowFacebookFirstComment: (show: boolean) => void;
  localPinterestLink?: string;
  setLocalPinterestLink?: (link: string) => void;
  localPinterestBoardId?: string | null;
  setLocalPinterestBoardId?: (id: string | null) => void;
  mediaErrors?: Record<string, string[]>;
}

const PLATFORM_LIMITS = {
  facebook: { post: 5000, story: 5000, comment: 5000 },
  instagram: { caption: 2200, story: 120, comment: 2196 },
  x: { free: 280, premium: 25000 },
  linkedin: { post: 3000, comment: 1248 },
  pinterest: { description: 500, title: 100 },
  tiktok: { caption: 2200 },
  threads: { post: 500, topic: 50 },
  bluesky: { post: 300 },
  google_business: { post: 1500 },
  youtube: { shorts: 5000 },
};

export function PlatformCaptionSection({
  platformId,
  platform,
  selectedAccounts,
  onAccountSelect,
  currentCaption,
  onCaptionChange,
  openHashtagModal,
  postType,
  currentPostType,
  facebookPostType,
  setState, // This is setDraftState from the parent
  localPlatformTitles,
  setLocalPlatformTitles,
  currentThreadMessages,
  updateThreadMessageContent,
  removeThreadMessage,
  addThreadMessage,
  openThreadHashtagModal,
  localFirstComment,
  setLocalFirstComment,
  showFirstComment,
  setShowFirstComment,
  localFacebookFirstComment,
  setLocalFacebookFirstComment,
  showFacebookFirstComment,
  setShowFacebookFirstComment,
  localPinterestLink,
  setLocalPinterestLink,
  localPinterestBoardId,
  setLocalPinterestBoardId,
  mediaErrors,
}: PlatformCaptionSectionProps) {
  const supportsThreading = platformId === "x" || platformId === "threads";
  const supportsFirstComment =
    platformId === "instagram" || platformId === "facebook";
  const supportsPostTypeSelection =
    platformId === "instagram" || platformId === "facebook";
  const supportsTitle =
    platformId === "tiktok" ||
    platformId === "youtube" ||
    platformId === "pinterest";

  const isInstagramStory =
    platformId === "instagram" && currentPostType === "story";
  const isFacebookStory =
    platformId === "facebook" && facebookPostType === "story";
  const isStory = isInstagramStory || isFacebookStory;

  // Access stores directly for platform-specific metadata
  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );

  const youtubePrivacy = usePublishingStore((state) => state.youtubePrivacy);
  const youtubeCategory = usePublishingStore((state) => state.youtubeCategory);
  const youtubeTags = usePublishingStore((state) => state.youtubeTags);
  const youtubeMadeForKids = usePublishingStore(
    (state) => state.youtubeMadeForKids
  );
  const youtubeThumbnailUrl = usePublishingStore(
    (state) => state.youtubeThumbnailUrl
  );

  const pinterestCoverUrl = usePublishingStore(
    (state) => state.pinterestCoverUrl
  );

  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const platformMediaSelections = useEditorialDraftStore(
    (state) => state.platformMediaSelections
  );

  // Get active media for Pinterest options
  const activeMediaUids = platformMediaSelections[platformId] || [];
  const activeMediaItem =
    activeMediaUids.length > 0
      ? stagedMediaItems.find((i) => i.uid === activeMediaUids[0])
      : undefined;

  // Get integration ID for this platform (assuming single select for settings dependent platforms)
  const integrationId = selectedAccounts[platformId]?.[0];

  let characterLimit: number | undefined;
  let commentLimit: number | undefined;
  let warningLimit: number | undefined;

  switch (platformId) {
    case "facebook":
      characterLimit = PLATFORM_LIMITS.facebook.post;
      commentLimit = PLATFORM_LIMITS.facebook.comment;
      break;
    case "instagram":
      characterLimit = isInstagramStory
        ? PLATFORM_LIMITS.instagram.story
        : PLATFORM_LIMITS.instagram.caption;
      commentLimit = PLATFORM_LIMITS.instagram.comment;
      break;
    case "x":
      characterLimit = PLATFORM_LIMITS.x.premium;
      warningLimit = PLATFORM_LIMITS.x.free;
      break;
    case "linkedin":
      characterLimit = PLATFORM_LIMITS.linkedin.post;
      commentLimit = PLATFORM_LIMITS.linkedin.comment;
      break;
    case "tiktok":
      characterLimit = PLATFORM_LIMITS.tiktok.caption;
      break;
    case "threads":
      characterLimit = PLATFORM_LIMITS.threads.post;
      break;
    case "youtube":
      characterLimit = PLATFORM_LIMITS.youtube.shorts;
      break;
    case "bluesky":
      characterLimit = PLATFORM_LIMITS.bluesky.post;
      break;
    case "pinterest":
      characterLimit = PLATFORM_LIMITS.pinterest.description;
      break;
    case "google_business":
      characterLimit = PLATFORM_LIMITS.google_business.post;
      break;
  }

  return (
    <div className="mt-6">
      <label
        htmlFor={`caption-${platformId}`}
        className="eyebrow mb-2 flex items-center gap-3"
      >
        <span className="flex items-center gap-2">
          <PlatformIcon platformId={platformId} />
          {platform.name} Caption
        </span>
        <span className="ml-auto flex items-center gap-3">
          {supportsPostTypeSelection && platformId === "instagram" && (
            <PostTypeSelector
              currentType={currentPostType}
              onTypeChange={(type) => setState({ postType: type })}
            />
          )}
          {supportsPostTypeSelection && platformId === "facebook" && (
            <PostTypeSelector
              currentType={facebookPostType}
              onTypeChange={(type) => setState({ facebookPostType: type })}
            />
          )}
          {platform.accounts.length > 0 && (
            <>
              <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wide">
                Select Accounts
              </span>
              {platform.accounts.map((account) => {
                const isSelected = selectedAccounts[platformId]?.includes(
                  account.id
                );
                const selectedCount = selectedAccounts[platformId]?.length || 0;
                const isLastSelected = isSelected && selectedCount === 1;

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => {
                      if (!isLastSelected) {
                        onAccountSelect(platformId, account.id);
                      }
                    }}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all overflow-hidden",
                      isSelected
                        ? "border-primary"
                        : "border-border hover:border-primary/50",
                      isLastSelected ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                    title={
                      isLastSelected
                        ? `${account.name} (Cannot deselect the last account)`
                        : account.name
                    }
                  >
                    {account.img ? (
                      <img
                        src={account.img}
                        alt={account.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="sr-only">{account.name}</span>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </span>
      </label>

      <div className="space-y-4">
        {supportsTitle && (
          <div>
            <label
              htmlFor={`title-${platformId}`}
              className="eyebrow mb-2 flex items-center gap-1.5"
            >
              <Type className="h-3 w-3" />
              Title
              <span className="ml-auto text-[0.65rem] text-muted-foreground">
                {platformId === "tiktok"
                  ? postType === "video"
                    ? "Video: Max 2200 chars"
                    : "Photo: Max 90 chars"
                  : platformId === "pinterest"
                  ? "Max 100 chars"
                  : "Max 100 chars"}
              </span>
            </label>
            <Input
              id={`title-${platformId}`}
              value={localPlatformTitles[platformId] || ""}
              onChange={(event) =>
                setLocalPlatformTitles((prev) => ({
                  ...prev,
                  [platformId]: event.target.value,
                }))
              }
              placeholder={
                platformId === "tiktok"
                  ? "Add a title for your TikTok..."
                  : platformId === "pinterest"
                  ? "Add a title for your Pin..."
                  : "Add a title for your video..."
              }
              maxLength={platformId === "tiktok" ? 2200 : 100}
            />
          </div>
        )}

        <CaptionTextarea
          id={`caption-${platformId}`}
          value={isStory ? "" : currentCaption}
          onChange={(event) => onCaptionChange(event.target.value)}
          placeholder={
            isStory
              ? "Captions are not used for stories."
              : `${platform.name} specific caption / description...`
          }
          platformId={platformId}
          onHashtagClick={openHashtagModal}
          disabled={isStory}
          maxLength={characterLimit}
          warningLimit={warningLimit}
        />

        <PlatformMediaSelector
          platformId={platformId}
          mediaErrors={mediaErrors}
        />

        {platformId === "youtube" && (
          <YouTubeOptions
            integrationId={integrationId}
            privacy={youtubePrivacy}
            onPrivacyChange={(v) => setPublishingState({ youtubePrivacy: v })}
            category={youtubeCategory}
            onCategoryChange={(v) => setPublishingState({ youtubeCategory: v })}
            tags={youtubeTags}
            onTagsChange={(v) => setPublishingState({ youtubeTags: v })}
            madeForKids={youtubeMadeForKids}
            onMadeForKidsChange={(v) =>
              setPublishingState({ youtubeMadeForKids: v })
            }
            thumbnailUrl={youtubeThumbnailUrl}
            onThumbnailChange={(v) =>
              setPublishingState({ youtubeThumbnailUrl: v })
            }
          />
        )}

        {platformId === "pinterest" &&
          setLocalPinterestLink &&
          setLocalPinterestBoardId && (
            <PinterestOptions
              integrationId={integrationId || null}
              boardId={localPinterestBoardId || null}
              onBoardChange={setLocalPinterestBoardId}
              link={localPinterestLink || ""}
              onLinkChange={setLocalPinterestLink}
              activeMediaItem={activeMediaItem}
              coverUrl={pinterestCoverUrl}
              onCoverChange={(url) =>
                setPublishingState({ pinterestCoverUrl: url })
              }
            />
          )}

        {supportsThreading && (
          <ThreadSection
            currentThreadMessages={currentThreadMessages}
            platformId={platformId}
            updateThreadMessageContent={updateThreadMessageContent}
            removeThreadMessage={removeThreadMessage}
            addThreadMessage={addThreadMessage}
            openThreadHashtagModal={openThreadHashtagModal}
          />
        )}

        {supportsFirstComment && platformId === "instagram" && (
          <FirstCommentSection
            platformId="instagram"
            showFirstComment={showFirstComment}
            setShowFirstComment={setShowFirstComment}
            firstComment={localFirstComment}
            setFirstComment={setLocalFirstComment}
            openHashtagModal={openHashtagModal}
            isStoryMode={currentPostType === "story"}
            maxLength={commentLimit}
          />
        )}

        {supportsFirstComment && platformId === "facebook" && (
          <FirstCommentSection
            platformId="facebook"
            showFirstComment={showFacebookFirstComment}
            setShowFirstComment={setShowFacebookFirstComment}
            firstComment={localFacebookFirstComment}
            setFirstComment={setLocalFacebookFirstComment}
            openHashtagModal={openHashtagModal}
            isStoryMode={facebookPostType === "story"}
            maxLength={commentLimit}
          />
        )}
      </div>
    </div>
  );
}
