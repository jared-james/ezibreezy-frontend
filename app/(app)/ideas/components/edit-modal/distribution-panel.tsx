// app/(app)/ideas/components/edit-modal/distribution-panel.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // <-- Import hooks
import {
  Send,
  Tag,
  Hash,
  AtSign,
  MapPin,
  BookmarkPlus,
  Edit3,
  MessageSquare,
  X, // <-- Import X icon for removing chips
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // <-- Import cn for styling

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
  showActionButtons?: boolean; // <-- Add this prop
}

// Helper to convert the single string prop into an array of tags (excluding empty strings)
const parseTags = (tagString: string | undefined): string[] => {
  if (!tagString) return [];
  // Split by whitespace and optionally trim the leading #
  return tagString
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter((t) => t.length > 0);
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
  showActionButtons = true, // <-- Give it a default value
}: DistributionPanelProps) {
  // --- Hashtag Chip Logic ---
  const [tagChips, setTagChips] = useState<string[]>(parseTags(hashtags));
  const [currentTagInput, setCurrentTagInput] = useState("");

  // Sync internal state with external prop change
  useEffect(() => {
    // Only update internal state if the prop changes and we are not currently typing a new tag
    if (
      tagChips.join(" ") !== parseTags(hashtags).join(" ") &&
      currentTagInput.length === 0
    ) {
      setTagChips(parseTags(hashtags));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashtags]);

  // Debounced update to the parent component
  const updateParentHashtags = useCallback(
    (newChips: string[]) => {
      // Format: "#tag1 #tag2 #tag3"
      const formattedString = newChips.map((t) => `#${t}`).join(" ");
      onHashtagsChange?.(formattedString);
    },
    [onHashtagsChange]
  );

  const addTag = (input: string) => {
    const newTag = input.trim().toLowerCase().replace(/^#/, "");
    if (newTag.length > 0) {
      // Use a Set to ensure uniqueness and convert back to array
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
      // Delete last chip if input is empty
      setTagChips((prev) => {
        const newChips = prev.slice(0, -1);
        updateParentHashtags(newChips);
        return newChips;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allows comma to trigger tag creation on change (e.g., paste with commas)
    if (e.target.value.includes(",")) {
      const parts = e.target.value.split(",");
      parts.slice(0, -1).forEach(addTag);
      setCurrentTagInput(parts.pop() || "");
    } else {
      setCurrentTagInput(e.target.value);
    }
  };
  // --- END Hashtag Chip Logic ---

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
          {/* Labels */}
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

          {/* Hashtags (The Modified Input) */}
          <div className="relative">
            <label htmlFor="hashtags" className="eyebrow">
              Hashtags
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

          {/* First Comment */}
          <div className="relative">
            <label htmlFor="first-comment" className="eyebrow">
              First Comment
            </label>
            <div className="relative mt-2">
              <MessageSquare className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="first-comment"
                value={firstComment}
                onChange={(e) => onFirstCommentChange?.(e.target.value)}
                placeholder="Add your first comment..."
                className="pl-8 h-9"
              />
            </div>
          </div>

          {/* Collaborators */}
          <div className="relative">
            <label htmlFor="collaborators" className="eyebrow">
              Collaborators
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

          {/* Location */}
          <div className="relative">
            <label htmlFor="location" className="eyebrow">
              Location
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
        </div>

        {/* --- START OF ACTION BUTTONS (NO CHANGE) --- */}
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
        {/* --- END OF ACTION BUTTONS (NO CHANGE) --- */}
      </div>
    </div>
  );
}
