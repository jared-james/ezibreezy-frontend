// app/(app)/ideas/components/edit-modal/caption-editor.tsx

"use client";

import { useState, useCallback } from "react"; // ADDED useState, useCallback
import { Smile, Twitter, Instagram, Plus, Trash2, Hash } from "lucide-react"; // ADDED Hash
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Platform,
  ThreadMessage,
  ThreadMessageAugmented,
} from "@/lib/types/editorial";
import ThreadPostMediaUpload from "@/app/(app)/editorial/components/thread-post-media-upload";

// ADDED: Import the modal
import HashtagSelectorModal from "./hashtag-selector-modal";

type SelectedAccounts = Record<string, string[]>;

interface CaptionEditorProps {
  mainCaption: string;
  onMainCaptionChange: (caption: string) => void;
  platformCaptions: Record<string, string>;
  onPlatformCaptionChange: (platformId: string, caption: string) => void;
  // ... other props remain the same
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

// Custom Textarea wrapper to include the Hashtag button
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
      className="min-h-32 pr-10" // Added padding-right to make space for the button
    />
    <button
      type="button"
      onClick={() => onHashtagClick(platformId)}
      title="Insert Hashtags"
      className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
    >
      <Hash className="h-4 w-4" />
    </button>
  </div>
);

// Thread Textarea wrapper with hashtag button
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
      className="min-h-24 pr-10" // Added padding-right to make space for the button
    />
    <button
      type="button"
      onClick={() => onHashtagClick(threadIndex)}
      title="Insert Hashtags"
      className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
    >
      <Hash className="h-4 w-4" />
    </button>
  </div>
);

export default function CaptionEditor({
  mainCaption,
  onMainCaptionChange,
  platformCaptions,
  onPlatformCaptionChange,
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
}: CaptionEditorProps) {
  // ADDED: State for hashtag modal
  const [isHashtagModalOpen, setIsHashtagModalOpen] = useState(false);
  const [targetPlatformId, setTargetPlatformId] = useState<string | null>(null);
  const [targetThreadIndex, setTargetThreadIndex] = useState<number | null>(null);

  const mainPlaceholder =
    postType === "video"
      ? "Introduce the hook, context, and call to action for your video..."
      : postType === "image"
      ? "Describe the visual, context, and what you want people to feel..."
      : "Draft the main caption you want to adapt across platforms...";

  const addThreadMessage = () => {
    if (threadMessages.length < 20 && onThreadMessagesChange) {
      onThreadMessagesChange([
        ...threadMessages,
        { content: "", mediaIds: [] },
      ]);
    }
  };

  const removeThreadMessage = (index: number) => {
    if (onThreadMessagesChange) {
      onThreadMessagesChange(threadMessages.filter((_, i) => i !== index));
    }
  };

  const updateThreadMessageContent = (index: number, content: string) => {
    if (onThreadMessagesChange) {
      const newMessages = threadMessages.map((msg, i) =>
        i === index ? { ...msg, content } : msg
      );
      onThreadMessagesChange(newMessages);
    }
  };

  // ADDED: Logic to insert hashtags into the appropriate caption
  const handleInsertHashtags = useCallback(
    (hashtagString: string) => {
      if (!hashtagString) return;

      // Determine the caption to update
      const hashtagsWithPadding = `\n\n${hashtagString.trim()}`;

      if (targetThreadIndex !== null) {
        // Insert into thread message
        if (onThreadMessagesChange) {
          const newMessages = threadMessages.map((msg, i) =>
            i === targetThreadIndex
              ? { ...msg, content: msg.content.trimEnd() + hashtagsWithPadding }
              : msg
          );
          onThreadMessagesChange(newMessages);
        }
        setTargetThreadIndex(null);
      } else if (targetPlatformId === "main") {
        onMainCaptionChange(mainCaption.trimEnd() + hashtagsWithPadding);
        setTargetPlatformId(null);
      } else if (targetPlatformId) {
        const currentCaption =
          platformCaptions[targetPlatformId] || mainCaption;
        onPlatformCaptionChange(
          targetPlatformId,
          currentCaption.trimEnd() + hashtagsWithPadding
        );
        setTargetPlatformId(null);
      }
    },
    [
      mainCaption,
      platformCaptions,
      onMainCaptionChange,
      onPlatformCaptionChange,
      targetPlatformId,
      targetThreadIndex,
      threadMessages,
      onThreadMessagesChange,
    ]
  );

  // ADDED: Function to open modal and set target platform
  const openHashtagModal = useCallback((platformId: string) => {
    setTargetPlatformId(platformId);
    setTargetThreadIndex(null);
    setIsHashtagModalOpen(true);
  }, []);

  // ADDED: Function to open modal for thread messages
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

        {/* MODIFIED: Use the custom CaptionTextarea wrapper */}
        <CaptionTextarea
          id="caption"
          value={mainCaption}
          onChange={(event) => onMainCaptionChange(event.target.value)}
          placeholder={mainPlaceholder}
          platformId="main" // Special ID for main caption
          onHashtagClick={openHashtagModal}
        />
        {/* END MODIFIED */}
      </div>

      {Object.keys(selectedAccounts).map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        const isX = platformId === "x";
        const currentCaption = platformCaptions[platformId] || "";

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
              {/* MODIFIED: Use the custom CaptionTextarea wrapper for platform caption */}
              <CaptionTextarea
                id={`caption-${platformId}`}
                value={currentCaption}
                onChange={(event) =>
                  onPlatformCaptionChange(platformId, event.target.value)
                }
                placeholder={`${platform.name} specific caption...`}
                platformId={platformId}
                onHashtagClick={openHashtagModal}
              />
              {/* END MODIFIED */}

              {isX && (
                <>
                  {threadMessages.map((message, index) => {
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

                  {threadMessages.length < 20 && (
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

      {/* ADDED: Hashtag Selector Modal */}
      <HashtagSelectorModal
        isOpen={isHashtagModalOpen}
        onClose={() => setIsHashtagModalOpen(false)}
        // MODIFIED: Pass the appropriate caption based on context (main, platform, or thread)
        initialHashtags={
          targetThreadIndex !== null
            ? threadMessages[targetThreadIndex]?.content || ""
            : targetPlatformId === "main"
            ? mainCaption
            : platformCaptions[targetPlatformId || ""] || ""
        }
        onSave={handleInsertHashtags} // Use the new insert handler
      />
    </>
  );
}
