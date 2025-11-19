// app/(app)/ideas/components/edit-modal/caption-editor.tsx

"use client";

import { Smile, Twitter, Instagram, Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Platform,
  ThreadMessage,
  ThreadMessageAugmented,
} from "@/lib/types/editorial";
import ThreadPostMediaUpload from "@/app/(app)/editorial/components/thread-post-media-upload";

type SelectedAccounts = Record<string, string[]>;

interface CaptionEditorProps {
  mainCaption: string;
  onMainCaptionChange: (caption: string) => void;
  platformCaptions: Record<string, string>;
  onPlatformCaptionChange: (platformId: string, caption: string) => void;
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
        <Textarea
          id="caption"
          rows={10}
          value={mainCaption}
          onChange={(event) => onMainCaptionChange(event.target.value)}
          placeholder={mainPlaceholder}
          className="min-h-32"
        />
      </div>

      {Object.keys(selectedAccounts).map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        const isX = platformId === "x";

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
              <Textarea
                id={`caption-${platformId}`}
                rows={10}
                value={platformCaptions[platformId] || ""}
                onChange={(event) =>
                  onPlatformCaptionChange(platformId, event.target.value)
                }
                placeholder={`${platform.name} specific caption...`}
                className="min-h-32"
              />

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

                          <Textarea
                            rows={4}
                            value={message.content}
                            onChange={(event) =>
                              updateThreadMessageContent(
                                index,
                                event.target.value
                              )
                            }
                            placeholder="What's happening next?"
                            className="min-h-24"
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
    </>
  );
}
