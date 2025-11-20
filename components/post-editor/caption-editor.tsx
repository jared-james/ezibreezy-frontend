// components/post-editor/caption-editor.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import { Smile, Twitter, Instagram, Plus, Trash2, Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

const PlatformIcon = ({ platformId }: { platformId: string }) => {
  const Icon =
    platformId === "x"
      ? Twitter
      : platformId === "instagram"
      ? Instagram
      : null;

  if (!Icon) return null;

  return <Icon className="h-4 w-4 text-brand-primary" />;
};

const CaptionTextarea = ({
  id,
  value,
  onChange,
  placeholder,
  platformId,
  onHashtagClick,
}: {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  platformId: string;
  onHashtagClick: (platformId: string) => void;
}) => (
  <div className="relative">
    <Textarea
      id={id}
      rows={10}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-32 pr-10"
    />
    <button
      type="button"
      onClick={() => onHashtagClick(platformId)}
      className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
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

  const [localMainCaption, setLocalMainCaption] = useState(mainCaption);
  const [localPlatformCaptions, setLocalPlatformCaptions] =
    useState(platformCaptions);
  const [localThreadMessages, setLocalThreadMessages] =
    useState(threadMessages);

  useEffect(() => {
    setLocalMainCaption(mainCaption);
  }, [mainCaption]);

  useEffect(() => {
    setLocalPlatformCaptions(platformCaptions);
  }, [platformCaptions]);

  useEffect(() => {
    setLocalThreadMessages(threadMessages);
  }, [threadMessages]);

  useEffect(() => {
    onLocalCaptionsChange?.(localMainCaption, localPlatformCaptions);
  }, [localMainCaption, localPlatformCaptions, onLocalCaptionsChange]);

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

  const addThreadMessage = () => {
    if (localThreadMessages.length < 20 && onThreadMessagesChange) {
      const newMessages = [
        ...localThreadMessages,
        { content: "", mediaIds: [] },
      ];
      setLocalThreadMessages(newMessages);
      onThreadMessagesChange(newMessages);
    }
  };

  const removeThreadMessage = (index: number) => {
    if (onThreadMessagesChange) {
      const newMessages = localThreadMessages.filter((_, i) => i !== index);
      setLocalThreadMessages(newMessages);
      onThreadMessagesChange(newMessages);
    }
  };

  const updateThreadMessageContent = (index: number, content: string) => {
    const newMessages = localThreadMessages.map((msg, i) =>
      i === index ? { ...msg, content } : msg
    );
    setLocalThreadMessages(newMessages);
    onThreadMessagesChange?.(newMessages);
  };

  const handleInsertHashtags = useCallback(
    (hashtagString: string) => {
      if (!hashtagString) return;

      const hashtagsWithPadding = `\n\n${hashtagString.trim()}`;

      if (targetThreadIndex !== null) {
        const newMessages = localThreadMessages.map((msg, i) =>
          i === targetThreadIndex
            ? { ...msg, content: msg.content.trimEnd() + hashtagsWithPadding }
            : msg
        );
        setLocalThreadMessages(newMessages);
        onThreadMessagesChange?.(newMessages);
        setTargetThreadIndex(null);
      } else if (targetPlatformId === "main") {
        const newCaption = localMainCaption.trimEnd() + hashtagsWithPadding;
        setLocalMainCaption(newCaption);
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
      localThreadMessages,
      onThreadMessagesChange,
      targetPlatformId,
      targetThreadIndex,
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

      {Object.keys(selectedAccounts).map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        const isX = platformId === "x";
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
                {platform.accounts.length > 0 && (
                  <span className="ml-2 flex items-center gap-1.5">
                    {platform.accounts.map((account) => {
                      const isSelected = selectedAccounts[platformId]?.includes(
                        account.id
                      );

                      return (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() =>
                            onAccountSelect(platformId, account.id)
                          }
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition-all",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border bg-surface hover:border-primary/50"
                          )}
                          title={account.name}
                        >
                          <span className="sr-only">{account.name}</span>
                        </button>
                      );
                    })}
                  </span>
                )}
              </span>
              <button
                type="button"
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <Smile className="h-4 w-4" />
              </button>
            </label>

            <div className="space-y-4">
              <CaptionTextarea
                id={`caption-${platformId}`}
                value={currentCaption}
                onChange={(event) =>
                  setLocalPlatformCaptions((prev) => ({
                    ...prev,
                    [platformId]: event.target.value,
                  }))
                }
                placeholder={`${platform.name} specific caption...`}
                platformId={platformId}
                onHashtagClick={openHashtagModal}
              />

              {isX && (
                <>
                  {localThreadMessages.map((message, index) => {
                    const mediaFiles = message.mediaFiles || [];

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
                              onClick={() => removeThreadMessage(index)}
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
                                event.target.value
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
                                mediaPreviews={message.mediaPreviews || []}
                                isUploading={message.isUploading || false}
                                onMediaChange={handleThreadMediaChange}
                                onRemoveMedia={handleRemoveThreadMedia}
                              />
                            )}
                        </div>
                      </div>
                    );
                  })}

                  {localThreadMessages.length < 20 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={addThreadMessage}
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
            </div>
          </div>
        );
      })}

      <HashtagSelectorModal
        isOpen={isHashtagModalOpen}
        onClose={() => setIsHashtagModalOpen(false)}
        initialHashtags={
          targetThreadIndex !== null
            ? localThreadMessages[targetThreadIndex]?.content || ""
            : targetPlatformId === "main"
            ? localMainCaption
            : localPlatformCaptions[targetPlatformId || ""] || ""
        }
        onSave={handleInsertHashtags}
      />
    </>
  );
}
