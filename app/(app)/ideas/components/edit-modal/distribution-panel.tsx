// app/(app)/ideas/components/edit-modal/distribution-panel.tsx

"use client";

import { useMemo } from "react";
import {
  Send,
  Tag,
  Hash,
  AtSign,
  MapPin,
  BookmarkPlus,
  Edit3,
  X,
  Twitter,
  Instagram,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import ThreadPostMediaUpload from "@/app/(app)/editorial/components/thread-post-media-upload";
import type {
  ThreadMessage,
  ThreadMessageAugmented,
} from "@/lib/types/editorial";
import { useTagInput } from "@/lib/hooks/use-tag-input";

interface DistributionPanelProps {
  onOpenInEditorial?: () => void;
  onSaveClipping?: () => void;
  labels?: string;
  hashtags?: string;
  threadMessages?: ThreadMessageAugmented[];
  collaborators?: string;
  location?: string;
  onLabelsChange?: (value: string) => void;
  onHashtagsChange?: (value: string) => void;
  onThreadMessagesChange?: (value: ThreadMessage[]) => void;
  onCollaboratorsChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  handleThreadMediaChange: (
    files: File[],
    previews: string[],
    threadIndex: number
  ) => void;
  handleRemoveThreadMedia: (fileToRemove: File, threadIndex: number) => void;
  showActionButtons?: boolean;
  activePlatforms?: Set<string>;
  isGlobalUploading?: boolean;
}

interface PlatformIconDisplayProps {
  platformId: string;
  isActive: boolean;
}

const PlatformIconDisplay = ({
  platformId,
  isActive,
}: PlatformIconDisplayProps) => {
  const Icon =
    platformId === "x"
      ? Twitter
      : platformId === "instagram"
      ? Instagram
      : null;

  if (!Icon) return null;

  return (
    <div
      className={cn(
        "flex size-4 items-center justify-center rounded-sm transition-opacity",
        isActive ? "text-brand-primary" : "text-muted-foreground opacity-50"
      )}
      title={platformId === "x" ? "Shows on X/Twitter" : "Shows on Instagram"}
    >
      <Icon className="size-3.5" />
    </div>
  );
};

export default function DistributionPanel({
  onOpenInEditorial,
  onSaveClipping,
  labels = "",
  hashtags = "",
  threadMessages = [],
  collaborators = "",
  location = "",
  onLabelsChange,
  onHashtagsChange,
  onThreadMessagesChange,
  onCollaboratorsChange,
  onLocationChange,
  handleThreadMediaChange,
  handleRemoveThreadMedia,
  showActionButtons = true,
  activePlatforms = new Set(),
  isGlobalUploading = false,
}: DistributionPanelProps) {
  const {
    tagChips,
    currentTagInput,
    handleInputChange,
    handleKeyDown,
    removeTag,
    inputPlaceholder,
  } = useTagInput({
    initialHashtags: hashtags,
    onHashtagsChange: onHashtagsChange || (() => {}),
  });

  const fieldSupport = useMemo(
    () => ({
      hashtags: ["x", "instagram"],
      threadMessages: ["x"],
      collaborators: ["instagram"],
      location: ["instagram"],
    }),
    []
  );

  const shouldShowField = (field: keyof typeof fieldSupport) =>
    fieldSupport[field].some((id) => activePlatforms.has(id));

  const addThreadMessage = () => {
    if (threadMessages.length < 20) {
      onThreadMessagesChange?.([
        ...threadMessages,
        { content: "", mediaIds: [] },
      ]);
    }
  };

  const removeThreadMessage = (index: number) => {
    onThreadMessagesChange?.(threadMessages.filter((_, i) => i !== index));
  };

  const updateThreadMessageContent = (index: number, content: string) => {
    const newMessages = threadMessages.map((msg, i) =>
      i === index
        ? {
            ...msg,
            content,
          }
        : msg
    );
    onThreadMessagesChange?.(newMessages);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Distribution
        </h3>
        <Send className="h-4 w-4 text-[--muted]" />
      </div>

      <div className="mt-4 space-y-6 border border-border bg-surface p-5">
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="labels" className="eyebrow">
              Labels
            </label>
            <div className="relative mt-2">
              <Tag className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="labels"
                value={labels}
                onChange={(event) => onLabelsChange?.(event.target.value)}
                placeholder="Promotion, News, Evergreen..."
                className="h-9 pl-8"
              />
            </div>
          </div>

          {shouldShowField("hashtags") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="hashtags"
                className="eyebrow flex items-center gap-2"
              >
                Hashtags
                {fieldSupport.hashtags.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div
                className={cn(
                  "mt-2 flex min-h-9 flex-wrap gap-2 rounded-sm border border-border bg-surface p-2 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40",
                  tagChips.length > 0 ? "items-start" : "items-center"
                )}
              >
                <Hash className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground transition-all duration-100" />

                {tagChips.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-serif text-xs text-secondary-foreground"
                  >
                    <span className="font-medium">#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <Input
                  id="hashtags"
                  value={currentTagInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={inputPlaceholder}
                  className={cn(
                    "m-0 h-auto flex-1 border-none bg-transparent p-0 shadow-none focus-visible:border-none focus-visible:ring-0",
                    tagChips.length === 0 ? "pl-8" : "pl-1"
                  )}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {shouldShowField("threadMessages") && (
            <div className="relative space-y-4 border-t border-border border-dashed pt-2 animate-in fade-in-50">
              <label className="eyebrow flex items-center gap-2">
                X Thread Messages
                {fieldSupport.threadMessages.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>

              {threadMessages.map((message, index) => {
                const fileMocks =
                  message.mediaPreviews?.map(
                    () => new File(["mock"], "mock", { type: "image/jpeg" })
                  ) || [];

                return (
                  <div
                    key={index}
                    className="space-y-3 border border-border bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-sm font-bold text-foreground">
                        Post #{index + 2} in Thread
                      </p>
                      <Button
                        type="button"
                        onClick={() => removeThreadMessage(index)}
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    </div>

                    <Textarea
                      rows={4}
                      value={message.content}
                      onChange={(event) =>
                        updateThreadMessageContent(index, event.target.value)
                      }
                      placeholder="Add the next message in your thread..."
                      className="min-h-24"
                    />

                    <ThreadPostMediaUpload
                      threadIndex={index}
                      mediaFiles={fileMocks}
                      mediaPreviews={message.mediaPreviews || []}
                      isUploading={message.isUploading || false}
                      onMediaChange={handleThreadMediaChange}
                      onRemoveMedia={handleRemoveThreadMedia}
                    />
                  </div>
                );
              })}

              {threadMessages.length < 20 && (
                <Button
                  type="button"
                  onClick={addThreadMessage}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-dashed"
                  disabled={isGlobalUploading}
                >
                  <Plus className="h-4 w-4" />
                  Add Thread Post
                </Button>
              )}
            </div>
          )}

          {shouldShowField("collaborators") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="collaborators"
                className="eyebrow flex items-center gap-2"
              >
                Collaborators
                {fieldSupport.collaborators.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div className="relative mt-2">
                <AtSign className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="collaborators"
                  value={collaborators}
                  onChange={(event) =>
                    onCollaboratorsChange?.(event.target.value)
                  }
                  placeholder="@username"
                  className="h-9 pl-8"
                />
              </div>
            </div>
          )}

          {shouldShowField("location") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="location"
                className="eyebrow flex items-center gap-2"
              >
                Location
                {fieldSupport.location.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(event) => onLocationChange?.(event.target.value)}
                  placeholder="New York, NY"
                  className="h-9 pl-8"
                />
              </div>
            </div>
          )}
        </div>

        {showActionButtons && (
          <div className="space-y-3 pt-4">
            <Button onClick={onSaveClipping} className="w-full gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Save Clipping
            </Button>
            <Button
              onClick={onOpenInEditorial}
              variant="outline"
              className="w-full gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Open in Editorial
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
