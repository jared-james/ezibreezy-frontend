// components/post-editor/caption/sections/platform-caption-section.tsx

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

interface PlatformCaptionSectionProps {
  platformId: string;
  platform: Platform;
  selectedAccounts: Record<string, string[]>;
  onAccountSelect: (platformId: string, accountId: string) => void;
  currentCaption: string;
  setLocalPlatformCaptions: (
    update: (prev: Record<string, string>) => Record<string, string>
  ) => void;
  openHashtagModal: (platformId: string) => void;
  postType: "text" | "image" | "video";
  currentPostType: "post" | "story" | "reel";
  facebookPostType: "post" | "story" | "reel";
  setState: (state: Partial<{
    postType: "post" | "story" | "reel";
    facebookPostType: "post" | "story" | "reel";
  }>) => void;
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
  handleThreadMediaChange?: (
    files: File[],
    previews: string[],
    threadIndex: number
  ) => void;
  handleRemoveThreadMedia?: (fileToRemove: File, threadIndex: number) => void;
  isGlobalUploading?: boolean;
  localFirstComment: string;
  setLocalFirstComment: (comment: string) => void;
  showFirstComment: boolean;
  setShowFirstComment: (show: boolean) => void;
  localFacebookFirstComment: string;
  setLocalFacebookFirstComment: (comment: string) => void;
  showFacebookFirstComment: boolean;
  setShowFacebookFirstComment: (show: boolean) => void;
}

export function PlatformCaptionSection({
  platformId,
  platform,
  selectedAccounts,
  onAccountSelect,
  currentCaption,
  setLocalPlatformCaptions,
  openHashtagModal,
  postType,
  currentPostType,
  facebookPostType,
  setState,
  localPlatformTitles,
  setLocalPlatformTitles,
  currentThreadMessages,
  updateThreadMessageContent,
  removeThreadMessage,
  addThreadMessage,
  openThreadHashtagModal,
  handleThreadMediaChange,
  handleRemoveThreadMedia,
  isGlobalUploading = false,
  localFirstComment,
  setLocalFirstComment,
  showFirstComment,
  setShowFirstComment,
  localFacebookFirstComment,
  setLocalFacebookFirstComment,
  showFacebookFirstComment,
  setShowFacebookFirstComment,
}: PlatformCaptionSectionProps) {
  const supportsThreading = platformId === "x" || platformId === "threads";
  const supportsFirstComment =
    platformId === "instagram" || platformId === "facebook";
  const supportsPostTypeSelection =
    platformId === "instagram" || platformId === "facebook";
  const supportsTitle = platformId === "tiktok";

  const isInstagramStory =
    platformId === "instagram" && currentPostType === "story";
  const isFacebookStory =
    platformId === "facebook" && facebookPostType === "story";
  const isStory = isInstagramStory || isFacebookStory;

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
        {platform.accounts.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5">
            {platform.accounts.map((account) => {
              const isSelected = selectedAccounts[platformId]?.includes(
                account.id
              );

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => onAccountSelect(platformId, account.id)}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-all overflow-hidden",
                    isSelected
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  )}
                  title={account.name}
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
          </span>
        )}
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
                {postType === "video" ? "Max 2200 chars" : "Max 90 chars"}
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
              placeholder="Add a title for your TikTok..."
              maxLength={postType === "video" ? 2200 : 90}
            />
          </div>
        )}

        <CaptionTextarea
          id={`caption-${platformId}`}
          value={isStory ? "" : currentCaption}
          onChange={(event) =>
            setLocalPlatformCaptions((prev) => ({
              ...prev,
              [platformId]: event.target.value,
            }))
          }
          placeholder={
            isStory
              ? "Captions are not used for Instagram Stories."
              : `${platform.name} specific caption...`
          }
          platformId={platformId}
          onHashtagClick={openHashtagModal}
          disabled={isStory}
        />

        <PlatformMediaSelector platformId={platformId} />

        {supportsPostTypeSelection && platformId === "instagram" && (
          <div className="flex justify-end">
            <PostTypeSelector
              currentType={currentPostType}
              onTypeChange={(type) => setState({ postType: type })}
            />
          </div>
        )}

        {supportsPostTypeSelection && platformId === "facebook" && (
          <div className="flex justify-end">
            <PostTypeSelector
              currentType={facebookPostType}
              onTypeChange={(type) => setState({ facebookPostType: type })}
            />
          </div>
        )}

        {supportsThreading && (
          <ThreadSection
            currentThreadMessages={currentThreadMessages}
            platformId={platformId}
            updateThreadMessageContent={updateThreadMessageContent}
            removeThreadMessage={removeThreadMessage}
            addThreadMessage={addThreadMessage}
            openThreadHashtagModal={openThreadHashtagModal}
            handleThreadMediaChange={handleThreadMediaChange}
            handleRemoveThreadMedia={handleRemoveThreadMedia}
            isGlobalUploading={isGlobalUploading}
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
          />
        )}
      </div>
    </div>
  );
}
