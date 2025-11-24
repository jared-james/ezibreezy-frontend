// components/post-editor/caption-editor.tsx

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Smile,
  Twitter,
  Instagram,
  Plus,
  Trash2,
  Hash,
  Facebook,
  AtSign,
  Music2,
  MessageSquare,
  Book,
  Clapperboard,
  Type,
  Linkedin,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Platform,
  ThreadMessage,
  ThreadMessageAugmented,
} from "@/lib/types/editorial";
import ThreadPostMediaUpload from "./thread-post-media-upload";
import { useEditorialStore } from "@/lib/store/editorial-store";
import HashtagSelectorModal from "./hashtag-selector-modal";

type SelectedAccounts = Record<string, string[]>;

interface CaptionEditorProps {
  selectedAccounts: SelectedAccounts;
  platforms: Platform[];
  onAccountSelect: (platformId: string, accountId: string) => void;
  postType: "text" | "image" | "video";
  mediaUploadSlot?: React.ReactNode;
  threadMessages?: ThreadMessageAugmented[];
  onThreadMessagesChange?: (messages: ThreadMessage[]) => void;
  handleThreadMediaChange?: (
    files: File[],
    previews: string[],
    threadIndex: number
  ) => void;
  handleRemoveThreadMedia?: (fileToRemove: File, threadIndex: number) => void;
  isGlobalUploading?: boolean;
  onLocalCaptionsChange?: (
    mainCaption: string,
    platformCaptions: Record<string, string>
  ) => void;
}

const PlatformIcon = ({ platformId, className }: { platformId: string; className?: string }) => {
  const Icon =
    platformId === "x"
      ? Twitter
      : platformId === "instagram"
      ? Instagram
      : platformId === "facebook"
      ? Facebook
      : platformId === "linkedin"
      ? Linkedin
      : platformId === "threads"
      ? AtSign
      : platformId === "tiktok"
      ? Music2
      : null;

  if (!Icon) return null;

  return <Icon className={cn("h-4 w-4", className || "text-brand-primary")} />;
};

const CaptionTextarea = ({
  id,
  value,
  onChange,
  placeholder,
  platformId,
  onHashtagClick,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  platformId: string;
  onHashtagClick: (platformId: string) => void;
  disabled?: boolean;
}) => (
  <div className="relative">
    <Textarea
      id={id}
      rows={10}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-32 pr-10"
      disabled={disabled}
    />
    <button
      type="button"
      onClick={() => onHashtagClick(platformId)}
      className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
      disabled={disabled}
    >
      <Hash className="h-4 w-4" />
    </button>
  </div>
);

const ThreadTextarea = ({
  value,
  onChange,
  placeholder,
  threadIndex,
  onHashtagClick,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  threadIndex: number;
  onHashtagClick: (threadIndex: number) => void;
}) => (
  <div className="relative">
    <Textarea
      rows={4}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-24 pr-10"
    />
    <button
      type="button"
      onClick={() => onHashtagClick(threadIndex)}
      className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
    >
      <Hash className="h-4 w-4" />
    </button>
  </div>
);

const PostTypeSelector = ({
  currentType,
  onTypeChange,
}: {
  currentType: "post" | "story" | "reel";
  onTypeChange: (type: "post" | "story" | "reel") => void;
}) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => onTypeChange("post")}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        currentType === "post"
          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
          : "border-border bg-transparent text-muted-foreground hover:bg-surface-hover"
      )}
    >
      <Book className="h-3 w-3" />
      Post
    </button>
    <button
      type="button"
      onClick={() => onTypeChange("story")}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        currentType === "story"
          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
          : "border-border bg-transparent text-muted-foreground hover:bg-surface-hover"
      )}
    >
      <Clapperboard className="h-3 w-3" />
      Story
    </button>
  </div>
);

export default function CaptionEditor({
  selectedAccounts,
  platforms,
  onAccountSelect,
  postType,
  mediaUploadSlot,
  threadMessages = [],
  onThreadMessagesChange,
  handleThreadMediaChange,
  handleRemoveThreadMedia,
  isGlobalUploading = false,
  onLocalCaptionsChange,
}: CaptionEditorProps) {
  const mainCaption = useEditorialStore((state) => state.mainCaption);
  const platformCaptions = useEditorialStore((state) => state.platformCaptions);
  const platformTitles = useEditorialStore((state) => state.platformTitles);
  const platformThreadMessages = useEditorialStore((state) => state.platformThreadMessages);
  const firstComment = useEditorialStore((state) => state.firstComment);
  const facebookFirstComment = useEditorialStore((state) => state.facebookFirstComment);
  const currentPostType = useEditorialStore((state) => state.postType);
  const facebookPostType = useEditorialStore((state) => state.facebookPostType);
  const setState = useEditorialStore((state) => state.setState);

  const [localMainCaption, setLocalMainCaption] = useState(mainCaption);
  const [localPlatformCaptions, setLocalPlatformCaptions] =
    useState(platformCaptions);
  const [localPlatformTitles, setLocalPlatformTitles] =
    useState(platformTitles);
  const [localThreadMessages, setLocalThreadMessages] =
    useState(threadMessages);
  const [localPlatformThreadMessages, setLocalPlatformThreadMessages] =
    useState<Record<string, ThreadMessage[]>>(platformThreadMessages);
  const [localFirstComment, setLocalFirstComment] = useState(firstComment);
  const [localFacebookFirstComment, setLocalFacebookFirstComment] = useState(facebookFirstComment);
  const [showFirstComment, setShowFirstComment] = useState(
    !!firstComment && firstComment.length > 0
  );
  const [showFacebookFirstComment, setShowFacebookFirstComment] = useState(
    !!facebookFirstComment && facebookFirstComment.length > 0
  );

  // Caption filter tab state - tracks which platform's caption section to show (shared via store)
  const activeCaptionFilter = useEditorialStore((state) => state.activeCaptionFilter);
  const setActiveCaptionFilter = useCallback((filter: string) => setState({ activeCaptionFilter: filter }), [setState]);

  // Get the list of selected platform IDs
  const selectedPlatformIds = useMemo(
    () => Object.keys(selectedAccounts),
    [selectedAccounts]
  );

  // Sync active filter when selected accounts change
  useEffect(() => {
    if (selectedPlatformIds.length === 0) {
      setActiveCaptionFilter("all");
    } else if (activeCaptionFilter !== "all" && !selectedPlatformIds.includes(activeCaptionFilter)) {
      // If current filter is no longer valid, switch to first selected platform
      setActiveCaptionFilter(selectedPlatformIds[0]);
    } else if (activeCaptionFilter === "all" && selectedPlatformIds.length === 1) {
      // If only one platform selected, auto-select it
      setActiveCaptionFilter(selectedPlatformIds[0]);
    }
  }, [selectedPlatformIds, activeCaptionFilter, setActiveCaptionFilter]);

  useEffect(() => {
    setLocalMainCaption(mainCaption);
  }, [mainCaption]);

  useEffect(() => {
    setLocalPlatformCaptions(platformCaptions);
  }, [platformCaptions]);

  useEffect(() => {
    setLocalPlatformTitles(platformTitles);
  }, [platformTitles]);

  useEffect(() => {
    setLocalThreadMessages(threadMessages);
  }, [threadMessages]);

  useEffect(() => {
    setLocalPlatformThreadMessages(platformThreadMessages);
  }, [platformThreadMessages]);

  useEffect(() => {
    setLocalFirstComment(firstComment);
    if (currentPostType === "story") {
      setShowFirstComment(false);
    } else {
      setShowFirstComment(!!firstComment && firstComment.length > 0);
    }
  }, [firstComment, currentPostType]);

  useEffect(() => {
    setLocalFacebookFirstComment(facebookFirstComment);
    if (facebookPostType === "story") {
      setShowFacebookFirstComment(false);
    } else {
      setShowFacebookFirstComment(!!facebookFirstComment && facebookFirstComment.length > 0);
    }
  }, [facebookFirstComment, facebookPostType]);

  useEffect(() => {
    if (currentPostType === "story") {
      setLocalPlatformCaptions((prev) => ({ ...prev, instagram: "" }));
    }
  }, [currentPostType]);

  useEffect(() => {
    if (facebookPostType === "story") {
      setLocalPlatformCaptions((prev) => ({ ...prev, facebook: "" }));
    }
  }, [facebookPostType]);

  useEffect(() => {
    onLocalCaptionsChange?.(localMainCaption, localPlatformCaptions);
  }, [localMainCaption, localPlatformCaptions, onLocalCaptionsChange]);

  useEffect(() => {
    setState({ firstComment: localFirstComment });
  }, [localFirstComment, setState]);

  useEffect(() => {
    setState({ facebookFirstComment: localFacebookFirstComment });
  }, [localFacebookFirstComment, setState]);

  useEffect(() => {
    setState({ platformTitles: localPlatformTitles });
  }, [localPlatformTitles, setState]);

  useEffect(() => {
    setState({ platformThreadMessages: localPlatformThreadMessages });
  }, [localPlatformThreadMessages, setState]);

  // Get the current thread messages based on the active filter
  const currentThreadMessages = useMemo(() => {
    const supportsThreading = activeCaptionFilter === "x" || activeCaptionFilter === "threads";
    if (supportsThreading && localPlatformThreadMessages[activeCaptionFilter]?.length > 0) {
      return localPlatformThreadMessages[activeCaptionFilter];
    }
    return localThreadMessages;
  }, [activeCaptionFilter, localPlatformThreadMessages, localThreadMessages]);

  const [isHashtagModalOpen, setIsHashtagModalOpen] = useState(false);
  const [targetPlatformId, setTargetPlatformId] = useState<string | null>(null);
  const [targetThreadIndex, setTargetThreadIndex] = useState<number | null>(
    null
  );

  const mainPlaceholder =
    postType === "video"
      ? "Introduce the hook, context, and call to action for your video..."
      : postType === "image"
      ? "Describe the visual, context, and what you want people to feel..."
      : "Draft the main caption you want to adapt across platforms...";

  // Check if we're editing platform-specific thread messages
  const isEditingPlatformThread = activeCaptionFilter === "x" || activeCaptionFilter === "threads";

  const addThreadMessage = (platformId: string) => {
    if (currentThreadMessages.length < 20) {
      const newMessages = [
        ...currentThreadMessages,
        { content: "", mediaIds: [] },
      ];

      if (isEditingPlatformThread) {
        // Update platform-specific thread messages
        setLocalPlatformThreadMessages((prev) => ({
          ...prev,
          [platformId]: newMessages,
        }));
      } else {
        // Update base thread messages
        setLocalThreadMessages(newMessages);
        onThreadMessagesChange?.(newMessages);
      }
    }
  };

  const removeThreadMessage = (index: number, platformId: string) => {
    const newMessages = currentThreadMessages.filter((_, i) => i !== index);

    if (isEditingPlatformThread) {
      setLocalPlatformThreadMessages((prev) => ({
        ...prev,
        [platformId]: newMessages,
      }));
    } else {
      setLocalThreadMessages(newMessages);
      onThreadMessagesChange?.(newMessages);
    }
  };

  const updateThreadMessageContent = (index: number, content: string, platformId: string) => {
    const newMessages = currentThreadMessages.map((msg, i) =>
      i === index ? { ...msg, content } : msg
    );

    if (isEditingPlatformThread) {
      setLocalPlatformThreadMessages((prev) => ({
        ...prev,
        [platformId]: newMessages,
      }));
    } else {
      setLocalThreadMessages(newMessages);
      onThreadMessagesChange?.(newMessages);
    }
  };

  const handleInsertHashtags = useCallback(
    (hashtagString: string) => {
      if (!hashtagString) return;

      const hashtagsWithPadding = `\n\n${hashtagString.trim()}`;

      if (targetThreadIndex !== null) {
        const newMessages = currentThreadMessages.map((msg, i) =>
          i === targetThreadIndex
            ? { ...msg, content: msg.content.trimEnd() + hashtagsWithPadding }
            : msg
        );

        if (isEditingPlatformThread) {
          setLocalPlatformThreadMessages((prev) => ({
            ...prev,
            [activeCaptionFilter]: newMessages,
          }));
        } else {
          setLocalThreadMessages(newMessages);
          onThreadMessagesChange?.(newMessages);
        }
        setTargetThreadIndex(null);
      } else if (targetPlatformId === "main") {
        const newCaption = localMainCaption.trimEnd() + hashtagsWithPadding;
        setLocalMainCaption(newCaption);
        setTargetPlatformId(null);
      } else if (targetPlatformId === "instagram_first_comment") {
        const newComment = localFirstComment.trimEnd() + hashtagsWithPadding;
        setLocalFirstComment(newComment);
        setTargetPlatformId(null);
      } else if (targetPlatformId === "facebook_first_comment") {
        const newComment = localFacebookFirstComment.trimEnd() + hashtagsWithPadding;
        setLocalFacebookFirstComment(newComment);
        setTargetPlatformId(null);
      } else if (targetPlatformId) {
        const currentCaption =
          localPlatformCaptions[targetPlatformId] || localMainCaption;
        const newCaption = currentCaption.trimEnd() + hashtagsWithPadding;
        setLocalPlatformCaptions((prev) => ({
          ...prev,
          [targetPlatformId]: newCaption,
        }));
        setTargetPlatformId(null);
      }
    },
    [
      localMainCaption,
      localPlatformCaptions,
      currentThreadMessages,
      isEditingPlatformThread,
      activeCaptionFilter,
      onThreadMessagesChange,
      targetPlatformId,
      targetThreadIndex,
      localFirstComment,
      localFacebookFirstComment,
    ]
  );

  const openHashtagModal = useCallback((platformId: string) => {
    setTargetPlatformId(platformId);
    setTargetThreadIndex(null);
    setIsHashtagModalOpen(true);
  }, []);

  const openThreadHashtagModal = useCallback((threadIndex: number) => {
    setTargetThreadIndex(threadIndex);
    setTargetPlatformId(null);
    setIsHashtagModalOpen(true);
  }, []);

  return (
    <>
      {mediaUploadSlot && <div className="mb-6">{mediaUploadSlot}</div>}

      <div>
        <label
          htmlFor="caption"
          className="eyebrow mb-2 flex items-center justify-between"
        >
          Main Caption
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </button>
        </label>

        <CaptionTextarea
          id="caption"
          value={localMainCaption}
          onChange={(event) => setLocalMainCaption(event.target.value)}
          placeholder={mainPlaceholder}
          platformId="main"
          onHashtagClick={openHashtagModal}
        />
      </div>

      {/* Caption Filter Tabs - only show when multiple platforms are selected */}
      {selectedPlatformIds.length > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCaptionFilter("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              activeCaptionFilter === "all"
                ? "border-2 border-brand-primary bg-surface text-brand-primary"
                : "border border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
          >
            All
          </button>
          {selectedPlatformIds.map((platformId) => {
            const platform = platforms.find((p) => p.id === platformId);
            if (!platform) return null;

            const isActive = activeCaptionFilter === platformId;

            return (
              <button
                key={platformId}
                type="button"
                onClick={() => setActiveCaptionFilter(platformId)}
                title={platform.name}
                className={cn(
                  "flex items-center justify-center rounded-full p-2 border-2",
                  isActive
                    ? "border-brand-primary bg-surface"
                    : "border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <PlatformIcon platformId={platformId} className={isActive ? "text-brand-primary" : undefined} />
              </button>
            );
          })}
        </div>
      )}

      {Object.keys(selectedAccounts)
        .filter((platformId) => activeCaptionFilter === "all" || activeCaptionFilter === platformId)
        .map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        const supportsThreading =
          platformId === "x" || platformId === "threads";
        const supportsFirstComment = platformId === "instagram" || platformId === "facebook";
        const supportsPostTypeSelection = platformId === "instagram" || platformId === "facebook";
        const supportsTitle = platformId === "tiktok";

        const isInstagramStory = platformId === "instagram" && currentPostType === "story";
        const isFacebookStory = platformId === "facebook" && facebookPostType === "story";
        const isStory = isInstagramStory || isFacebookStory;

        const currentCaption = localPlatformCaptions[platformId] || "";

        return (
          <div key={platformId} className="mt-6">
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
                <>
                  {currentThreadMessages.map((message, index) => {
                    const mediaFiles = (message as ThreadMessageAugmented).mediaFiles || [];

                    return (
                      <div
                        key={index}
                        className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border ml-2"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="eyebrow text-[0.65rem]">
                              Thread Post {index + 2}
                            </p>
                            <Button
                              type="button"
                              onClick={() => removeThreadMessage(index, platformId)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-muted-foreground hover:text-error"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <ThreadTextarea
                            value={message.content}
                            onChange={(event) =>
                              updateThreadMessageContent(
                                index,
                                event.target.value,
                                platformId
                              )
                            }
                            placeholder="What's happening next?"
                            threadIndex={index}
                            onHashtagClick={openThreadHashtagModal}
                          />

                          {handleThreadMediaChange &&
                            handleRemoveThreadMedia && (
                              <ThreadPostMediaUpload
                                threadIndex={index}
                                mediaFiles={mediaFiles}
                                mediaPreviews={(message as ThreadMessageAugmented).mediaPreviews || []}
                                isUploading={(message as ThreadMessageAugmented).isUploading || false}
                                onMediaChange={handleThreadMediaChange}
                                onRemoveMedia={handleRemoveThreadMedia}
                              />
                            )}
                        </div>
                      </div>
                    );
                  })}

                  {currentThreadMessages.length < 20 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => addThreadMessage(platformId)}
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                        disabled={isGlobalUploading}
                      >
                        <Plus className="h-3 w-3" />
                        Add to thread
                      </Button>
                    </div>
                  )}
                </>
              )}

              {supportsFirstComment && platformId === "instagram" && (
                <>
                  {showFirstComment ? (
                    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border ml-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="eyebrow flex items-center gap-1.5 text-[0.65rem]">
                            <MessageSquare className="h-3 w-3" />
                            First Comment
                          </p>
                          <Button
                            type="button"
                            onClick={() => {
                              setLocalFirstComment("");
                              setShowFirstComment(false);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-muted-foreground hover:text-error"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="relative">
                          <Textarea
                            rows={4}
                            value={localFirstComment}
                            onChange={(e) =>
                              setLocalFirstComment(e.target.value)
                            }
                            placeholder="Add your hashtags or opening line here..."
                            className="min-h-24 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              openHashtagModal("instagram_first_comment")
                            }
                            className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
                          >
                            <Hash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setShowFirstComment(true)}
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                        disabled={currentPostType === "story"}
                      >
                        <Plus className="h-3 w-3" />
                        Add first comment
                      </Button>
                    </div>
                  )}
                </>
              )}

              {supportsFirstComment && platformId === "facebook" && (
                <>
                  {showFacebookFirstComment ? (
                    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border ml-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="eyebrow flex items-center gap-1.5 text-[0.65rem]">
                            <MessageSquare className="h-3 w-3" />
                            First Comment
                          </p>
                          <Button
                            type="button"
                            onClick={() => {
                              setLocalFacebookFirstComment("");
                              setShowFacebookFirstComment(false);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-muted-foreground hover:text-error"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="relative">
                          <Textarea
                            rows={4}
                            value={localFacebookFirstComment}
                            onChange={(e) =>
                              setLocalFacebookFirstComment(e.target.value)
                            }
                            placeholder="Add your hashtags or opening line here..."
                            className="min-h-24 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              openHashtagModal("facebook_first_comment")
                            }
                            className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
                          >
                            <Hash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setShowFacebookFirstComment(true)}
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                        disabled={facebookPostType === "story"}
                      >
                        <Plus className="h-3 w-3" />
                        Add first comment
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      <HashtagSelectorModal
        isOpen={isHashtagModalOpen}
        onClose={() => setIsHashtagModalOpen(false)}
        initialHashtags={
          targetThreadIndex !== null
            ? currentThreadMessages[targetThreadIndex]?.content || ""
            : targetPlatformId === "main"
            ? localMainCaption
            : targetPlatformId === "instagram_first_comment"
            ? localFirstComment
            : targetPlatformId === "facebook_first_comment"
            ? localFacebookFirstComment
            : localPlatformCaptions[targetPlatformId || ""] || ""
        }
        onSave={handleInsertHashtags}
      />
    </>
  );
}
