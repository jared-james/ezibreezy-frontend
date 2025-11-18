// app/(app)/ideas/components/edit-modal/distribution-panel.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Send,
  Tag,
  Hash,
  AtSign,
  MapPin,
  BookmarkPlus,
  Edit3,
  MessageSquare,
  X,
  Twitter,
  Instagram,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DistributionPanelProps {
  onOpenInEditorial?: () => void;
  onSaveClipping?: () => void;
  labels?: string;
  hashtags?: string;
  firstComment?: string;
  collaborators?: string;
  location?: string;
  onLabelsChange?: (value: string) => void;
  onHashtagsChange?: (value: string) => void;
  onFirstCommentChange?: (value: string) => void;
  onCollaboratorsChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  showActionButtons?: boolean;
  activePlatforms?: Set<string>;
}

const parseTags = (tagString: string | undefined): string[] => {
  if (!tagString) return [];
  return tagString
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter((t) => t.length > 0);
};

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
      key={platformId}
      className={cn(
        "size-4 rounded-sm flex items-center justify-center transition-opacity",
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
  firstComment = "",
  collaborators = "",
  location = "",
  onLabelsChange,
  onHashtagsChange,
  onFirstCommentChange,
  onCollaboratorsChange,
  onLocationChange,
  showActionButtons = true,
  activePlatforms = new Set(),
}: DistributionPanelProps) {
  const fieldSupport = useMemo(
    () => ({
      hashtags: ["x", "instagram"],
      firstComment: ["x"],
      collaborators: ["instagram"],
      location: ["instagram"],
    }),
    []
  );

  const shouldShowField = (field: keyof typeof fieldSupport) => {
    return fieldSupport[field].some((id) => activePlatforms.has(id));
  };

  const [tagChips, setTagChips] = useState<string[]>(parseTags(hashtags));
  const [currentTagInput, setCurrentTagInput] = useState("");

  useEffect(() => {
    if (
      tagChips.join(" ") !== parseTags(hashtags).join(" ") &&
      currentTagInput.length === 0
    ) {
      setTagChips(parseTags(hashtags));
    }
  }, [hashtags]);

  const updateParentHashtags = useCallback(
    (newChips: string[]) => {
      const formattedString = newChips.map((t) => `#${t}`).join(" ");
      onHashtagsChange?.(formattedString);
    },
    [onHashtagsChange]
  );

  const addTag = (input: string) => {
    const newTag = input.trim().toLowerCase().replace(/^#/, "");
    if (newTag.length > 0) {
      setTagChips((prev) => {
        const newChips = Array.from(new Set([...prev, newTag]));
        updateParentHashtags(newChips);
        return newChips;
      });
      setCurrentTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagChips((prev) => {
      const newChips = prev.filter((tag) => tag !== tagToRemove);
      updateParentHashtags(newChips);
      return newChips;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(currentTagInput);
    } else if (
      e.key === "Backspace" &&
      currentTagInput.length === 0 &&
      tagChips.length > 0
    ) {
      setTagChips((prev) => {
        const newChips = prev.slice(0, -1);
        updateParentHashtags(newChips);
        return newChips;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(",")) {
      const parts = e.target.value.split(",");
      parts.slice(0, -1).forEach(addTag);
      setCurrentTagInput(parts.pop() || "");
    } else {
      setCurrentTagInput(e.target.value);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Distribution
        </h3>
        <Send className="w-4 h-4 text-[--muted]" />
      </div>

      <div className="bg-[--surface] border border-[--border] p-5 space-y-6 mt-4">
        <div className="space-y-4">
          {/* Labels (Always visible, internal metadata) */}
          <div className="relative">
            <label htmlFor="labels" className="eyebrow">
              Labels
            </label>
            <div className="relative mt-2">
              <Tag className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="labels"
                value={labels}
                onChange={(e) => onLabelsChange?.(e.target.value)}
                placeholder="Promotion, News, Evergreen..."
                className="pl-8 h-9"
              />
            </div>
          </div>

          {/* Hashtags (Visible if X or Instagram is active) */}
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
                  "relative mt-2 flex flex-wrap gap-2 min-h-9 p-2 rounded-sm border border-border bg-surface focus-within:border-ring focus-within:ring-ring/40 focus-within:ring-[3px] transition-[border-color,box-shadow]",
                  tagChips.length > 0 ? "items-start" : "items-center"
                )}
              >
                <Hash className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground transition-all duration-100" />

                {/* Render Chips */}
                {tagChips.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-serif px-2 py-0.5 rounded-full"
                  >
                    <span className="font-medium">#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Input for new tag */}
                <Input
                  id="hashtags"
                  value={currentTagInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    tagChips.length === 0 ? "marketing, saas, growth" : ""
                  }
                  className={cn(
                    "flex-1 border-none h-auto p-0 m-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-none",
                    tagChips.length === 0 ? "pl-8" : "pl-1"
                  )}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* First Comment (Visible if X is active) */}
          {shouldShowField("firstComment") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="first-comment"
                className="eyebrow flex items-center gap-2"
              >
                First Comment
                {fieldSupport.firstComment.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div className="relative mt-2">
                <MessageSquare className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
                <Input
                  id="first-comment"
                  value={firstComment}
                  onChange={(e) => onFirstCommentChange?.(e.target.value)}
                  placeholder="Add your first comment (will post as a reply on X)..."
                  className="pl-8 h-9"
                />
              </div>
            </div>
          )}

          {/* Collaborators (Visible if Instagram is active) */}
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
                <AtSign className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
                <Input
                  id="collaborators"
                  value={collaborators}
                  onChange={(e) => onCollaboratorsChange?.(e.target.value)}
                  placeholder="@username"
                  className="pl-8 h-9"
                />
              </div>
            </div>
          )}

          {/* Location (Visible if Instagram is active) */}
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
                <MapPin className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => onLocationChange?.(e.target.value)}
                  placeholder="New York, NY"
                  className="pl-8 h-9"
                />
              </div>
            </div>
          )}
        </div>

        {showActionButtons && (
          <div className="pt-4 space-y-3">
            <Button onClick={onSaveClipping} className="w-full gap-2">
              <BookmarkPlus className="w-4 h-4" />
              Save Clipping
            </Button>
            <Button
              onClick={onOpenInEditorial}
              variant="outline"
              className="w-full gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Open in Editorial
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
